const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  getWaterLogs,
  addWaterIntake,
  getDailyWaterIntake,
  updateWaterIntake,
  deleteWaterLog,
  getWaterStats
} = require('../controllers/waterController');

// GET /api/water - Listar registros de água
router.get('/', authenticateToken, getWaterLogs);

// POST /api/water - Adicionar consumo de água
router.post('/', authenticateToken, addWaterIntake);

// GET /api/water/daily - Obter consumo diário
router.get('/daily', authenticateToken, getDailyWaterIntake);

// GET /api/water/stats - Obter estatísticas de água
router.get('/stats', authenticateToken, getWaterStats);

// PUT /api/water/:id - Atualizar registro de água
router.put('/:id', authenticateToken, updateWaterIntake);

// DELETE /api/water/:id - Deletar registro de água
router.delete('/:id', authenticateToken, deleteWaterLog);

module.exports = router;
