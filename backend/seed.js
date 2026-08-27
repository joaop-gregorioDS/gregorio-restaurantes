const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const Category = require('./models/Category');
const Product = require('./models/Product');

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Conectado para Importação...');

    // Limpar o banco de dados antes
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Coleções antigas limpas.');

    // Ler arquivos JSON
    const categoriasPath = path.join(__dirname, '../frontend/dados/categorias.json');
    const produtosPath = path.join(__dirname, '../frontend/dados/produtos.json');

    const categoriasData = JSON.parse(fs.readFileSync(categoriasPath, 'utf-8'));
    const produtosData = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));

    // Inserir categorias
    // A estrutura JSON original é: { id, nome, slug, icone }
    // Vamos salvar a correlação do ID antigo com o novo ObjectId
    const categoryIdMap = {};

    for (const cat of categoriasData) {
      const novaCategoria = await Category.create({
        nome: cat.nome,
        slug: cat.slug,
        icone: cat.icone
      });
      categoryIdMap[cat.id] = novaCategoria._id;
    }
    console.log('Categorias importadas com sucesso!');

    // Inserir produtos
    // A estrutura JSON é: { id, categoria_id, nome, desc, preco, emoji, tags, harmoniza, destaque, disponivel }
    const produtosMongoose = produtosData.map(prod => {
      return {
        nome: prod.nome,
        desc: prod.desc,
        preco: prod.preco,
        emoji: prod.emoji,
        tags: prod.tags || [],
        harmoniza: prod.harmoniza,
        destaque: prod.destaque || false,
        disponivel: prod.disponivel !== false,
        categoria: categoryIdMap[prod.categoria_id] // vinculando com o novo _id do MongoDB
      };
    });

    await Product.insertMany(produtosMongoose);
    console.log('Produtos importados com sucesso!');

    process.exit();
  } catch (error) {
    console.error('Erro na importação: ', error);
    process.exit(1);
  }
};

importData();
