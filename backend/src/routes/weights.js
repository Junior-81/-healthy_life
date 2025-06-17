const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
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
router.get('/', auth, getWeights);

// POST /api/weights - Adicionar novo peso
router.post('/', auth, addWeight);

// GET /api/weights/latest - Obter último peso registrado
router.get('/latest', auth, getLatestWeight);

// GET /api/weights/stats - Obter estatísticas de peso
router.get('/stats', auth, getWeightStats);

// GET /api/weights/:id - Obter peso específico
router.get('/:id', auth, getWeight);

// PUT /api/weights/:id - Atualizar peso
router.put('/:id', auth, updateWeight);

// DELETE /api/weights/:id - Deletar peso
router.delete('/:id', auth, deleteWeight);

module.exports = router;
