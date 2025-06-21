const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  getTrainings,
  createTraining,
  getTraining,
  updateTraining,
  deleteTraining
} = require('../controllers/trainingController');

// GET /api/trainings - Listar treinos do usuário
router.get('/', authenticateToken, getTrainings);

// POST /api/trainings - Criar novo treino
router.post('/', authenticateToken, createTraining);

// GET /api/trainings/:id - Obter treino específico
router.get('/:id', authenticateToken, getTraining);

// PUT /api/trainings/:id - Atualizar treino
router.put('/:id', authenticateToken, updateTraining);

// DELETE /api/trainings/:id - Deletar treino
router.delete('/:id', authenticateToken, deleteTraining);

module.exports = router;
