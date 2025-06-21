const { PrismaClient } = require('../../../node_modules/@prisma/client');

const prisma = new PrismaClient();

const getWaterLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, page = 1, limit = 30 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const where = { userId };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.date = {
        gte: startDate,
        lt: endDate
      };
    }

    const waterLogs = await prisma.waterLog.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.waterLog.count({ where });

    res.json({
      waterLogs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar registros de água:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const addWaterIntake = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, date } = req.body;

    // Validação básica
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Quantidade de água deve ser maior que zero' });
    }

    const waterDate = date ? new Date(date) : new Date();

    // Verificar se já existe um registro para o dia
    const startDate = new Date(waterDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(waterDate);
    endDate.setHours(23, 59, 59, 999);

    const existingLog = await prisma.waterLog.findFirst({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    let waterLog;

    if (existingLog) {
      // Atualizar registro existente
      waterLog = await prisma.waterLog.update({
        where: { id: existingLog.id },
        data: {
          mlConsumed: existingLog.mlConsumed + amount,
          updatedAt: new Date()
        }
      });
    } else {
      // Criar novo registro
      waterLog = await prisma.waterLog.create({
        data: {
          userId,
          date: waterDate,
          mlConsumed: amount
        }
      });
    }

    res.status(201).json(waterLog);
  } catch (error) {
    console.error('Erro ao adicionar consumo de água:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getDailyWaterIntake = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const waterDate = date ? new Date(date) : new Date();
    
    const startDate = new Date(waterDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(waterDate);
    endDate.setHours(23, 59, 59, 999);

    const waterLog = await prisma.waterLog.findFirst({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Meta padrão de 2000ml
    const dailyGoal = 2000;
    const consumed = waterLog ? waterLog.mlConsumed : 0;
    const percentage = Math.min((consumed / dailyGoal) * 100, 100);

    res.json({
      date: waterDate.toISOString().split('T')[0],
      consumed,
      goal: dailyGoal,
      percentage: Math.round(percentage),
      remaining: Math.max(dailyGoal - consumed, 0)
    });
  } catch (error) {
    console.error('Erro ao buscar consumo diário de água:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const updateWaterIntake = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount } = req.body;

    // Validação básica
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Quantidade de água deve ser maior que zero' });
    }

    // Verificar se o log existe e pertence ao usuário
    const existingLog = await prisma.waterLog.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!existingLog) {
      return res.status(404).json({ message: 'Registro de água não encontrado' });
    }

    const waterLog = await prisma.waterLog.update({
      where: { id: parseInt(id) },
      data: {
        mlConsumed: amount,
        updatedAt: new Date()
      }
    });

    res.json(waterLog);
  } catch (error) {
    console.error('Erro ao atualizar consumo de água:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const deleteWaterLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar se o log existe e pertence ao usuário
    const waterLog = await prisma.waterLog.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!waterLog) {
      return res.status(404).json({ message: 'Registro de água não encontrado' });
    }

    await prisma.waterLog.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Registro de água deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar registro de água:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getWaterStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const waterLogs = await prisma.waterLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    });

    // Calcular estatísticas
    const totalConsumed = waterLogs.reduce((sum, log) => sum + log.mlConsumed, 0);
    const averageDaily = waterLogs.length > 0 ? Math.round(totalConsumed / waterLogs.length) : 0;
    const maxDaily = waterLogs.length > 0 ? Math.max(...waterLogs.map(log => log.mlConsumed)) : 0;

    // Meta padrão
    const dailyGoal = 2000;
    const daysWithGoal = waterLogs.filter(log => log.mlConsumed >= dailyGoal).length;
    const goalPercentage = waterLogs.length > 0 ? Math.round((daysWithGoal / waterLogs.length) * 100) : 0;

    res.json({
      period: {
        days: parseInt(days),
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      stats: {
        totalConsumed,
        averageDaily,
        maxDaily,
        daysTracked: waterLogs.length,
        daysWithGoal,
        goalPercentage
      },
      logs: waterLogs
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de água:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getWaterLogs,
  addWaterIntake,
  getDailyWaterIntake,
  updateWaterIntake,
  deleteWaterLog,
  getWaterStats
};
