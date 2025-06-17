const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getUserProfile, updateUserProfile, getUserStats } = require('../controllers/userController');

// GET /api/users/profile - Obter perfil do usuário
router.get('/profile', auth, getUserProfile);

// PUT /api/users/profile - Atualizar perfil do usuário
router.put('/profile', auth, updateUserProfile);

// GET /api/users/stats - Obter estatísticas do usuário
router.get('/stats', auth, getUserStats);

module.exports = router;
