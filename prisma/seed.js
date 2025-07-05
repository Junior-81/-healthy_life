const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar usuário de exemplo
    const hashedPassword = await bcrypt.hash('123456', 10);

    const user = await prisma.user.upsert({
        where: { email: 'demo@healthylife.com' },
        update: {},
        create: {
            name: 'Usuário Demo',
            email: 'demo@healthylife.com',
            password: hashedPassword,
            height: 175,
            weight: 70,
            goal: 'manter_peso'
        },
    });

    console.log('✅ Usuário criado:', user.name);

    // Criar alguns dados de exemplo
    const training = await prisma.training.create({
        data: {
            userId: user.id,
            type: 'MUSCULACAO',
            date: new Date(),
            notes: 'Treino de peito e tríceps',
            exercises: {
                create: [
                    {
                        name: 'Supino reto',
                        sets: 3,
                        reps: 12,
                        weight: 60,
                        notes: 'Forma correta'
                    },
                    {
                        name: 'Flexão de braços',
                        sets: 3,
                        reps: 15,
                        notes: 'Até a falha'
                    }
                ]
            }
        }
    });

    console.log('✅ Treino criado:', training.type);

    const meal = await prisma.meal.create({
        data: {
            userId: user.id,
            date: new Date(),
            type: 'ALMOCO',
            calories: 650,
            carbs: 80,
            protein: 45,
            fat: 15,
            notes: 'Almoço balanceado',
            foods: {
                create: [
                    {
                        name: 'Arroz integral',
                        quantity: 100,
                        unit: 'g',
                        calories: 350,
                        carbs: 70,
                        protein: 8,
                        fat: 2
                    },
                    {
                        name: 'Frango grelhado',
                        quantity: 150,
                        unit: 'g',
                        calories: 300,
                        carbs: 0,
                        protein: 35,
                        fat: 12
                    }
                ]
            }
        }
    });

    console.log('✅ Refeição criada:', meal.type);

    const waterLog = await prisma.waterLog.create({
        data: {
            userId: user.id,
            date: new Date(),
            amount: 2000,
            goal: 2500
        }
    });

    console.log('✅ Registro de água criado:', waterLog.amount, 'ml');

    console.log('🎉 Seed concluído com sucesso!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Erro no seed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
