const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getMeals,
  createMeal,
  getMeal,
  updateMeal,
  deleteMeal,
  getDailyNutrition
} = require('../controllers/mealController');

// GET /api/meals - Listar refeições do usuário
router.get('/', auth, getMeals);

// POST /api/meals - Criar nova refeição
router.post('/', auth, createMeal);

// GET /api/meals/daily-nutrition - Obter totais nutricionais do dia
router.get('/daily-nutrition', auth, getDailyNutrition);

// GET /api/meals/:id - Obter refeição específica
router.get('/:id', auth, getMeal);

// PUT /api/meals/:id - Atualizar refeição
router.put('/:id', auth, updateMeal);

// DELETE /api/meals/:id - Deletar refeição
router.delete('/:id', auth, deleteMeal);

module.exports = router;
