const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getMeals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, page = 1, limit = 10 } = req.query;
    
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

    const meals = await prisma.meal.findMany({
      where,
      include: {
        foods: true
      },
      orderBy: { date: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.meal.count({ where });

    res.json({
      meals,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar refeições:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const createMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, type, foods } = req.body;

    // Validação básica
    if (!date || !type) {
      return res.status(400).json({ message: 'Data e tipo da refeição são obrigatórios' });
    }

    if (!['cafe_manha', 'almoco', 'lanche', 'jantar', 'ceia'].includes(type)) {
      return res.status(400).json({ message: 'Tipo de refeição inválido' });
    }

    // Calcular totais de calorias e macros
    let totalCalories = 0;
    let totalProteins = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    if (foods && foods.length > 0) {
      foods.forEach(food => {
        totalCalories += food.calories || 0;
        totalProteins += food.proteins || 0;
        totalCarbs += food.carbs || 0;
        totalFats += food.fats || 0;
      });
    }

    const meal = await prisma.meal.create({
      data: {
        userId,
        date: new Date(date),
        type,
        totalCalories,
        totalProteins,
        totalCarbs,
        totalFats
      }
    });

    // Adicionar alimentos se fornecidos
    if (foods && foods.length > 0) {
      await prisma.food.createMany({
        data: foods.map(food => ({
          mealId: meal.id,
          name: food.name,
          quantity: food.quantity || null,
          unit: food.unit || null,
          calories: food.calories || 0,
          proteins: food.proteins || 0,
          carbs: food.carbs || 0,
          fats: food.fats || 0
        }))
      });
    }

    // Buscar a refeição completa criada
    const completeMeal = await prisma.meal.findUnique({
      where: { id: meal.id },
      include: {
        foods: true
      }
    });

    res.status(201).json(completeMeal);
  } catch (error) {
    console.error('Erro ao criar refeição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const meal = await prisma.meal.findFirst({
      where: {
        id: parseInt(id),
        userId
      },
      include: {
        foods: true
      }
    });

    if (!meal) {
      return res.status(404).json({ message: 'Refeição não encontrada' });
    }

    res.json(meal);
  } catch (error) {
    console.error('Erro ao buscar refeição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const updateMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { foods } = req.body;

    // Verificar se a refeição existe e pertence ao usuário
    const existingMeal = await prisma.meal.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!existingMeal) {
      return res.status(404).json({ message: 'Refeição não encontrada' });
    }

    // Recalcular totais se alimentos fornecidos
    let updateData = { updatedAt: new Date() };
    
    if (foods) {
      let totalCalories = 0;
      let totalProteins = 0;
      let totalCarbs = 0;
      let totalFats = 0;

      foods.forEach(food => {
        totalCalories += food.calories || 0;
        totalProteins += food.proteins || 0;
        totalCarbs += food.carbs || 0;
        totalFats += food.fats || 0;
      });

      updateData = {
        ...updateData,
        totalCalories,
        totalProteins,
        totalCarbs,
        totalFats
      };

      // Deletar alimentos existentes
      await prisma.food.deleteMany({
        where: { mealId: parseInt(id) }
      });

      // Criar novos alimentos
      if (foods.length > 0) {
        await prisma.food.createMany({
          data: foods.map(food => ({
            mealId: parseInt(id),
            name: food.name,
            quantity: food.quantity || null,
            unit: food.unit || null,
            calories: food.calories || 0,
            proteins: food.proteins || 0,
            carbs: food.carbs || 0,
            fats: food.fats || 0
          }))
        });
      }
    }

    // Atualizar a refeição
    await prisma.meal.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Buscar refeição atualizada
    const completeMeal = await prisma.meal.findUnique({
      where: { id: parseInt(id) },
      include: {
        foods: true
      }
    });

    res.json(completeMeal);
  } catch (error) {
    console.error('Erro ao atualizar refeição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const deleteMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar se a refeição existe e pertence ao usuário
    const meal = await prisma.meal.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!meal) {
      return res.status(404).json({ message: 'Refeição não encontrada' });
    }

    // Deletar refeição (cascata deleta alimentos)
    await prisma.meal.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Refeição deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar refeição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getDailyNutrition = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Data é obrigatória' });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    const dailyTotals = meals.reduce((totals, meal) => ({
      calories: totals.calories + meal.totalCalories,
      proteins: totals.proteins + meal.totalProteins,
      carbs: totals.carbs + meal.totalCarbs,
      fats: totals.fats + meal.totalFats
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });

    res.json({
      date,
      meals: meals.length,
      totals: dailyTotals
    });
  } catch (error) {
    console.error('Erro ao buscar nutrição diária:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getMeals,
  createMeal,
  getMeal,
  updateMeal,
  deleteMeal,
  getDailyNutrition
};
