const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  getWeights,
  addWeight,
  getWeight,
  updateWeight,
  deleteWeight,
  getWeightStats,
  getLatestWeight
} = require('../controllers/weightController');

// GET /api/weights - Listar registros de peso
router.get('/', authenticateToken, getWeights);

// POST /api/weights - Adicionar novo peso
router.post('/', authenticateToken, addWeight);

// GET /api/weights/latest - Obter último peso registrado
router.get('/latest', authenticateToken, getLatestWeight);

// GET /api/weights/stats - Obter estatísticas de peso
router.get('/stats', authenticateToken, getWeightStats);

// GET /api/weights/:id - Obter peso específico
router.get('/:id', authenticateToken, getWeight);

// PUT /api/weights/:id - Atualizar peso
router.put('/:id', authenticateToken, updateWeight);

// DELETE /api/weights/:id - Deletar peso
router.delete('/:id', authenticateToken, deleteWeight);

module.exports = router;
