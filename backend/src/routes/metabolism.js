const express = require('express');
const { body } = require('express-validator');
const { getMetabolicCalculations, updateMetabolicData } = require('../controllers/metabolismController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Validações
const metabolicValidation = [
    body('age')
        .isInt({ min: 16, max: 100 })
        .withMessage('Idade deve ser entre 16 e 100 anos'),
    body('gender')
        .isIn(['masculino', 'feminino'])
        .withMessage('Gênero deve ser masculino ou feminino'),
    body('activityLevel')
        .isIn(['sedentario', 'leve', 'moderado', 'intenso', 'muito_intenso'])
        .withMessage('Nível de atividade inválido')
];

// Rotas protegidas
router.post('/calculate', authenticateToken, metabolicValidation, getMetabolicCalculations);
router.put('/update', authenticateToken, metabolicValidation, updateMetabolicData);

module.exports = router;
