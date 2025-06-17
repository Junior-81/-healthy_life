const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getTrainings,
  createTraining,
  getTraining,
  updateTraining,
  deleteTraining
} = require('../controllers/trainingController');

// GET /api/trainings - Listar treinos do usuário
router.get('/', auth, getTrainings);

// POST /api/trainings - Criar novo treino
router.post('/', auth, createTraining);

// GET /api/trainings/:id - Obter treino específico
router.get('/:id', auth, getTraining);

// PUT /api/trainings/:id - Atualizar treino
router.put('/:id', auth, updateTraining);

// DELETE /api/trainings/:id - Deletar treino
router.delete('/:id', auth, deleteTraining);

module.exports = router;
