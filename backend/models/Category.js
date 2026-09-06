const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nome: { type: String, required: true },
  slug: { type: String, required: true },
  icone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
