const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantidade: { type: Number, required: true },
  preco_unitario: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  numero: { type: Number },
  itens: [orderItemSchema],
  total: { type: Number, required: true },
  tipo_entrega: { type: String, enum: ['delivery', 'retirada'], required: true },
  endereco_entrega: { type: Object }, // Copia do endereço no momento do pedido
  forma_pagamento: { type: String, required: true },
  status: { type: String, enum: ['pendente', 'preparando', 'saiu_entrega', 'entregue', 'cancelado'], default: 'pendente' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

