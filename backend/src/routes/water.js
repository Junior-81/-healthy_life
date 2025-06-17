const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getWaterLogs,
  addWaterIntake,
  getDailyWaterIntake,
  updateWaterIntake,
  deleteWaterLog,
  getWaterStats
} = require('../controllers/waterController');

// GET /api/water - Listar registros de água
router.get('/', auth, getWaterLogs);

// POST /api/water - Adicionar consumo de água
router.post('/', auth, addWaterIntake);

// GET /api/water/daily - Obter consumo diário
router.get('/daily', auth, getDailyWaterIntake);

// GET /api/water/stats - Obter estatísticas de água
router.get('/stats', auth, getWaterStats);

// PUT /api/water/:id - Atualizar registro de água
router.put('/:id', auth, updateWaterIntake);

// DELETE /api/water/:id - Deletar registro de água
router.delete('/:id', auth, deleteWaterLog);

module.exports = router;
