const { PrismaClient } = require('../../../node_modules/@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        height: true,
        weight: true,
        goal: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, height, weight, goal } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        height: height || undefined,
        weight: weight || undefined,
        goal: goal || undefined,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        height: true,
        weight: true,
        goal: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar estatísticas do usuário
    const [trainingsCount, mealsCount, lastWeight] = await Promise.all([
      prisma.training.count({ where: { userId } }),
      prisma.meal.count({ where: { userId } }),
      prisma.weight.findFirst({
        where: { userId },
        orderBy: { date: 'desc' }
      })
    ]);

    // Calcular IMC se houver peso e altura
    let imc = null;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { height: true }
    });

    if (lastWeight && user.height) {
      imc = (lastWeight.weight / Math.pow(user.height / 100, 2)).toFixed(1);
    }

    res.json({
      trainingsCount,
      mealsCount,
      currentWeight: lastWeight?.weight || null,
      imc: imc ? parseFloat(imc) : null,
      lastWeightDate: lastWeight?.date || null
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats
};
