const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { getUserProfile, updateUserProfile, getUserStats } = require('../controllers/userController');

// GET /api/users/profile - Obter perfil do usuário
router.get('/profile', authenticateToken, getUserProfile);

// PUT /api/users/profile - Atualizar perfil do usuário
router.put('/profile', authenticateToken, updateUserProfile);

// GET /api/users/stats - Obter estatísticas do usuário
router.get('/stats', authenticateToken, getUserStats);

module.exports = router;
