const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de exemplo
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'usuario@exemplo.com' },
    update: {},
    create: {
      name: 'Usuário Exemplo',
      email: 'usuario@exemplo.com',
      password: hashedPassword,
      height: 175, // 1.75m
      weight: 75,  // 75kg
      goal: 'Ganhar massa muscular'
    }
  });

  console.log('✅ Usuário criado:', user.name);

  // Criar alguns registros de peso
  const weightRecords = [
    { weight: 75, date: new Date('2024-01-01') },
    { weight: 74.5, date: new Date('2024-01-15') },
    { weight: 75.2, date: new Date('2024-02-01') },
    { weight: 76, date: new Date('2024-02-15') }
  ];

  for (const record of weightRecords) {
    const imc = record.weight / Math.pow(user.height / 100, 2);
    await prisma.weight.create({
      data: {
        userId: user.id,
        weight: record.weight,
        imc: parseFloat(imc.toFixed(1)),
        date: record.date
      }
    });
  }

  console.log('✅ Registros de peso criados');

  // Criar treino de musculação
  const muscleTraining = await prisma.training.create({
    data: {
      userId: user.id,
      type: 'musculacao',
      date: new Date(),
      notes: 'Treino de peito e tríceps'
    }
  });

  // Adicionar exercícios ao treino
  const exercises = [
    { name: 'Supino reto', sets: 4, reps: 12, weight: 80 },
    { name: 'Supino inclinado', sets: 3, reps: 10, weight: 70 },
    { name: 'Tríceps pulley', sets: 3, reps: 15, weight: 30 }
  ];

  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: {
        trainingId: muscleTraining.id,
        ...exercise
      }
    });
  }

  console.log('✅ Treino de musculação criado');

  // Criar treino de corrida
  const runTraining = await prisma.training.create({
    data: {
      userId: user.id,
      type: 'corrida',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // ontem
      notes: 'Corrida matinal no parque'
    }
  });

  await prisma.run.create({
    data: {
      trainingId: runTraining.id,
      distance: 5.0, // 5km
      duration: 1800, // 30 minutos
      pace: 360 // 6 min/km
    }
  });

  console.log('✅ Treino de corrida criado');

  // Criar refeições do dia
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const breakfast = await prisma.meal.create({
    data: {
      userId: user.id,
      date: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8h da manhã
      type: 'cafe_manha',
      totalCalories: 450,
      totalProteins: 25,
      totalCarbs: 60,
      totalFats: 12
    }
  });

  const breakfastFoods = [
    { name: '2 ovos mexidos', calories: 140, proteins: 12, carbs: 2, fats: 10 },
    { name: '2 fatias de pão integral', calories: 160, proteins: 6, carbs: 30, fats: 2 },
    { name: '1 banana', calories: 105, proteins: 1, carbs: 27, fats: 0 },
    { name: '1 copo de leite desnatado', calories: 45, proteins: 6, carbs: 1, fats: 0 }
  ];

  for (const food of breakfastFoods) {
    await prisma.food.create({
      data: {
        mealId: breakfast.id,
        ...food
      }
    });
  }

  console.log('✅ Refeições criadas');

  // Criar registro de água do dia
  await prisma.waterLog.create({
    data: {
      userId: user.id,
      date: today,
      mlConsumed: 1500 // 1.5L
    }
  });

  console.log('✅ Registro de água criado');

  console.log('🎉 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
