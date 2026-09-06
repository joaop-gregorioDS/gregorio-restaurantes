const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Obter favoritos
router.get('/favoritos', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favoritos');
    res.json(user.favoritos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar favoritos', error: error.message });
  }
});

// Adicionar/Remover favorito
router.post('/favoritos/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const productId = req.params.productId;

    const index = user.favoritos.indexOf(productId);
    if (index > -1) {
      user.favoritos.splice(index, 1); // Remover se já existe
    } else {
      user.favoritos.push(productId); // Adicionar se não existe
    }

    await user.save();
    res.json(user.favoritos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar favoritos', error: error.message });
  }
});

// Atualizar perfil
router.put('/perfil', auth, async (req, res) => {
  try {
    const { nome, telefone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { nome, telefone },
      { new: true }
    ).select('-senha');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
  }
});

// Adicionar endereço
router.post('/enderecos', auth, async (req, res) => {
  try {
    const endereco = req.body;
    const user = await User.findById(req.user.userId);
    
    user.enderecos.push(endereco);
    await user.save();
    
    res.status(201).json(user.enderecos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar endereço', error: error.message });
  }
});

module.exports = router;
