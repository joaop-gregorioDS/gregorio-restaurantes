const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');

// Criar um novo pedido
router.post('/', auth, async (req, res) => {
  try {
    const { itens, total, tipo_entrega, endereco_entrega, forma_pagamento } = req.body;
    const count = await Order.countDocuments();
    
    const newOrder = new Order({
      usuario: req.user.userId,
      numero: 1001 + count,
      itens,
      total,
      tipo_entrega,
      endereco_entrega,
      forma_pagamento,
      status: 'pendente'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
});

// Obter pedidos do usuário logado
router.get('/meus-pedidos', auth, async (req, res) => {
  try {
    const orders = await Order.find({ usuario: req.user.userId }).sort({ createdAt: -1 }).populate('itens.produto');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
  }
});

// Obter pedido por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('itens.produto');
    
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
    
    // Verificar se o pedido pertence ao usuário
    if (order.usuario.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
  }
});

module.exports = router;
