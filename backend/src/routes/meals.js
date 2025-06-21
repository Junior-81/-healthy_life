const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  getMeals,
  createMeal,
  getMeal,
  updateMeal,
  deleteMeal,
  getDailyNutrition
} = require('../controllers/mealController');

// GET /api/meals - Listar refeições do usuário
router.get('/', authenticateToken, getMeals);

// POST /api/meals - Criar nova refeição
router.post('/', authenticateToken, createMeal);

// GET /api/meals/daily-nutrition - Obter totais nutricionais do dia
router.get('/daily-nutrition', authenticateToken, getDailyNutrition);

// GET /api/meals/:id - Obter refeição específica
router.get('/:id', authenticateToken, getMeal);

// PUT /api/meals/:id - Atualizar refeição
router.put('/:id', authenticateToken, updateMeal);

// DELETE /api/meals/:id - Deletar refeição
router.delete('/:id', authenticateToken, deleteMeal);

module.exports = router;
