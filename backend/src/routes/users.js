const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
    getUserProfile,
    updateUserProfile,
    getUserStats,
    deleteUserAccount,
    addBodyMeasurement,
    getBodyMeasurements
} = require('../controllers/userController');

// GET /api/users/profile - Obter perfil do usuário
router.get('/profile', authenticateToken, getUserProfile);

// PUT /api/users/profile - Atualizar perfil do usuário
router.put('/profile', authenticateToken, updateUserProfile);

// DELETE /api/users/profile - Excluir conta do usuário
router.delete('/profile', authenticateToken, deleteUserAccount);

// GET /api/users/stats - Obter estatísticas do usuário
router.get('/stats', authenticateToken, getUserStats);

// POST /api/users/measurements - Adicionar medição corporal
router.post('/measurements', authenticateToken, addBodyMeasurement);

// GET /api/users/measurements - Obter medições corporais
router.get('/measurements', authenticateToken, getBodyMeasurements);

module.exports = router;
