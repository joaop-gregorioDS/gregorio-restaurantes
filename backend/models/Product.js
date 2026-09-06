const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  desc: { type: String, required: true },
  preco: { type: Number, required: true },
  emoji: { type: String },
  tags: [{ type: String }],
  harmoniza: { type: String },
  destaque: { type: Boolean, default: false },
  disponivel: { type: Boolean, default: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
