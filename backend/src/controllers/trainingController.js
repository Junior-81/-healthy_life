const { PrismaClient } = require('../../../node_modules/@prisma/client');

const prisma = new PrismaClient();

const getTrainings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type } = req.query;
    
    const skip = (page - 1) * limit;
    
    const where = { userId };
    if (type) {
      where.type = type;
    }

    const trainings = await prisma.training.findMany({
      where,
      include: {
        exercises: true,
        runs: true
      },
      orderBy: { date: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.training.count({ where });

    res.json({
      trainings,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const createTraining = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, date, notes, exercises, run } = req.body;

    // Validação básica
    if (!type || !date) {
      return res.status(400).json({ message: 'Tipo e data do treino são obrigatórios' });
    }

    if (!['musculacao', 'corrida'].includes(type)) {
      return res.status(400).json({ message: 'Tipo de treino inválido' });
    }

    const training = await prisma.training.create({
      data: {
        userId,
        type,
        date: new Date(date),
        notes: notes || null
      }
    });

    // Se for treino de musculação, adicionar exercícios
    if (type === 'musculacao' && exercises && exercises.length > 0) {
      await prisma.exercise.createMany({
        data: exercises.map(exercise => ({
          trainingId: training.id,
          name: exercise.name,
          sets: exercise.sets || null,
          reps: exercise.reps || null,
          weight: exercise.weight || null,
          notes: exercise.notes || null
        }))
      });
    }

    // Se for corrida, adicionar dados da corrida
    if (type === 'corrida' && run) {
      await prisma.run.create({
        data: {
          trainingId: training.id,
          distance: run.distance || null,
          duration: run.duration || null,
          pace: run.pace || null
        }
      });
    }

    // Buscar o treino completo criado
    const completeTraining = await prisma.training.findUnique({
      where: { id: training.id },
      include: {
        exercises: true,
        runs: true
      }
    });

    res.status(201).json(completeTraining);
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getTraining = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const training = await prisma.training.findFirst({
      where: {
        id: parseInt(id),
        userId
      },
      include: {
        exercises: true,
        runs: true
      }
    });

    if (!training) {
      return res.status(404).json({ message: 'Treino não encontrado' });
    }

    res.json(training);
  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const updateTraining = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { notes, exercises, run } = req.body;

    // Verificar se o treino existe e pertence ao usuário
    const existingTraining = await prisma.training.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!existingTraining) {
      return res.status(404).json({ message: 'Treino não encontrado' });
    }

    // Atualizar o treino
    const updatedTraining = await prisma.training.update({
      where: { id: parseInt(id) },
      data: {
        notes: notes || existingTraining.notes,
        updatedAt: new Date()
      }
    });

    // Atualizar exercícios se fornecidos
    if (exercises && existingTraining.type === 'musculacao') {
      // Deletar exercícios existentes
      await prisma.exercise.deleteMany({
        where: { trainingId: parseInt(id) }
      });

      // Criar novos exercícios
      if (exercises.length > 0) {
        await prisma.exercise.createMany({
          data: exercises.map(exercise => ({
            trainingId: parseInt(id),
            name: exercise.name,
            sets: exercise.sets || null,
            reps: exercise.reps || null,
            weight: exercise.weight || null,
            notes: exercise.notes || null
          }))
        });
      }
    }

    // Atualizar dados da corrida se fornecidos
    if (run && existingTraining.type === 'corrida') {
      await prisma.run.upsert({
        where: { trainingId: parseInt(id) },
        update: {
          distance: run.distance || null,
          duration: run.duration || null,
          pace: run.pace || null
        },
        create: {
          trainingId: parseInt(id),
          distance: run.distance || null,
          duration: run.duration || null,
          pace: run.pace || null
        }
      });
    }

    // Buscar treino atualizado
    const completeTraining = await prisma.training.findUnique({
      where: { id: parseInt(id) },
      include: {
        exercises: true,
        runs: true
      }
    });

    res.json(completeTraining);
  } catch (error) {
    console.error('Erro ao atualizar treino:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar se o treino existe e pertence ao usuário
    const training = await prisma.training.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!training) {
      return res.status(404).json({ message: 'Treino não encontrado' });
    }

    // Deletar treino (cascata deleta exercícios e corridas)
    await prisma.training.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Treino deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getTrainings,
  createTraining,
  getTraining,
  updateTraining,
  deleteTraining
};
