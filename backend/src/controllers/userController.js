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
    const { name, email, height, weight, goal } = req.body;

    // Validar se o email não está sendo usado por outro usuário
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Este email já está sendo usado por outro usuário' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        email: email || undefined,
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

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Excluir todos os dados relacionados ao usuário em ordem
    await prisma.$transaction(async (prisma) => {
      // Excluir medições corporais
      await prisma.bodyMeasurement.deleteMany({ where: { userId } });

      // Excluir registros de peso
      await prisma.weight.deleteMany({ where: { userId } });

      // Excluir registros de água
      await prisma.water.deleteMany({ where: { userId } });

      // Excluir refeições
      await prisma.meal.deleteMany({ where: { userId } });

      // Excluir treinos
      await prisma.training.deleteMany({ where: { userId } });

      // Finalmente, excluir o usuário
      await prisma.user.delete({ where: { id: userId } });
    });

    res.json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir conta do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const addBodyMeasurement = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weight, chest, waist, hip, arm, thigh } = req.body;

    const measurement = await prisma.bodyMeasurement.create({
      data: {
        userId,
        weight: weight || null,
        chest: chest || null,
        waist: waist || null,
        hip: hip || null,
        arm: arm || null,
        thigh: thigh || null,
        date: new Date()
      }
    });

    res.status(201).json(measurement);
  } catch (error) {
    console.error('Erro ao adicionar medição corporal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getBodyMeasurements = async (req, res) => {
  try {
    const userId = req.user.id;

    const measurements = await prisma.bodyMeasurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10 // Últimas 10 medições
    });

    res.json(measurements);
  } catch (error) {
    console.error('Erro ao buscar medições corporais:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  deleteUserAccount,
  addBodyMeasurement,
  getBodyMeasurements
};
