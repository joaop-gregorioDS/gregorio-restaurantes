const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Obter todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('categoria');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

// Obter categorias
router.get('/categorias', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categorias', error: error.message });
  }
});

// Obter produtos em destaque
router.get('/destaques', async (req, res) => {
  try {
    const products = await Product.find({ destaque: true }).populate('categoria');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar destaques', error: error.message });
  }
});

// Obter produto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoria');
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
});

module.exports = router;
