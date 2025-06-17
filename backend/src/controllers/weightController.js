const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getWeights = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 30 } = req.query;
    
    const skip = (page - 1) * limit;

    const weights = await prisma.weight.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.weight.count({ where: { userId } });

    res.json({
      weights,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar registros de peso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const addWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weight, date } = req.body;

    // Validação básica
    if (!weight || weight <= 0) {
      return res.status(400).json({ message: 'Peso deve ser maior que zero' });
    }

    // Buscar altura do usuário para calcular IMC
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { height: true }
    });

    let imc = null;
    if (user && user.height) {
      imc = parseFloat((weight / Math.pow(user.height / 100, 2)).toFixed(1));
    }

    const weightRecord = await prisma.weight.create({
      data: {
        userId,
        weight: parseFloat(weight),
        imc,
        date: date ? new Date(date) : new Date()
      }
    });

    res.status(201).json(weightRecord);
  } catch (error) {
    console.error('Erro ao adicionar peso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const weight = await prisma.weight.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!weight) {
      return res.status(404).json({ message: 'Registro de peso não encontrado' });
    }

    res.json(weight);
  } catch (error) {
    console.error('Erro ao buscar peso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const updateWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { weight } = req.body;

    // Validação básica
    if (!weight || weight <= 0) {
      return res.status(400).json({ message: 'Peso deve ser maior que zero' });
    }

    // Verificar se o registro existe e pertence ao usuário
    const existingWeight = await prisma.weight.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!existingWeight) {
      return res.status(404).json({ message: 'Registro de peso não encontrado' });
    }

    // Buscar altura do usuário para recalcular IMC
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { height: true }
    });

    let imc = null;
    if (user && user.height) {
      imc = parseFloat((weight / Math.pow(user.height / 100, 2)).toFixed(1));
    }

    const updatedWeight = await prisma.weight.update({
      where: { id: parseInt(id) },
      data: {
        weight: parseFloat(weight),
        imc,
        updatedAt: new Date()
      }
    });

    res.json(updatedWeight);
  } catch (error) {
    console.error('Erro ao atualizar peso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const deleteWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar se o registro existe e pertence ao usuário
    const weight = await prisma.weight.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!weight) {
      return res.status(404).json({ message: 'Registro de peso não encontrado' });
    }

    await prisma.weight.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Registro de peso deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar peso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getWeightStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const weights = await prisma.weight.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    });

    if (weights.length === 0) {
      return res.json({
        period: {
          days: parseInt(days),
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        },
        stats: {
          recordsCount: 0,
          currentWeight: null,
          initialWeight: null,
          weightChange: null,
          averageWeight: null,
          minWeight: null,
          maxWeight: null,
          currentIMC: null,
          initialIMC: null,
          imcChange: null
        },
        weights: []
      });
    }

    const currentWeight = weights[weights.length - 1];
    const initialWeight = weights[0];
    const weightChange = currentWeight.weight - initialWeight.weight;
    const averageWeight = weights.reduce((sum, w) => sum + w.weight, 0) / weights.length;
    const minWeight = Math.min(...weights.map(w => w.weight));
    const maxWeight = Math.max(...weights.map(w => w.weight));

    const imcChange = (currentWeight.imc && initialWeight.imc) 
      ? currentWeight.imc - initialWeight.imc 
      : null;

    res.json({
      period: {
        days: parseInt(days),
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      stats: {
        recordsCount: weights.length,
        currentWeight: currentWeight.weight,
        initialWeight: initialWeight.weight,
        weightChange: parseFloat(weightChange.toFixed(1)),
        averageWeight: parseFloat(averageWeight.toFixed(1)),
        minWeight,
        maxWeight,
        currentIMC: currentWeight.imc,
        initialIMC: initialWeight.imc,
        imcChange: imcChange ? parseFloat(imcChange.toFixed(1)) : null
      },
      weights
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de peso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getLatestWeight = async (req, res) => {
  try {
    const userId = req.user.id;

    const latestWeight = await prisma.weight.findFirst({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    if (!latestWeight) {
      return res.status(404).json({ message: 'Nenhum registro de peso encontrado' });
    }

    res.json(latestWeight);
  } catch (error) {
    console.error('Erro ao buscar último peso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getWeights,
  addWeight,
  getWeight,
  updateWeight,
  deleteWeight,
  getWeightStats,
  getLatestWeight
};
