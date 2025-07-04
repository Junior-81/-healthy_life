const { PrismaClient } = require('../../../node_modules/@prisma/client');
const prisma = new PrismaClient();

// Fórmula de Harris-Benedict revisada para cálculo do TMB
const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'masculino') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
};

// Fator de atividade física
const getActivityFactor = (activityLevel) => {
    const factors = {
        'sedentario': 1.2,        // Pouco ou nenhum exercício
        'leve': 1.375,            // Exercício leve 1-3 dias/semana
        'moderado': 1.55,         // Exercício moderado 3-5 dias/semana
        'intenso': 1.725,         // Exercício intenso 6-7 dias/semana
        'muito_intenso': 1.9      // Exercício muito intenso, trabalho físico
    };
    return factors[activityLevel] || 1.2;
};

// Calcular necessidades calóricas baseadas no objetivo
const calculateCaloriesForGoal = (tdee, goal) => {
    switch (goal) {
        case 'perder_peso':
            return Math.round(tdee - 500); // Déficit de 500 calorias
        case 'ganhar_peso':
        case 'ganhar_massa':
            return Math.round(tdee + 300); // Superávit de 300 calorias
        case 'manter_peso':
        default:
            return Math.round(tdee);
    }
};

// Calcular macronutrientes
const calculateMacros = (totalCalories, goal, weight) => {
    let proteinRatio, carbRatio, fatRatio;

    switch (goal) {
        case 'perder_peso':
            proteinRatio = 0.35;  // 35% proteína (preservar massa muscular)
            carbRatio = 0.35;     // 35% carboidratos
            fatRatio = 0.30;      // 30% gorduras
            break;
        case 'ganhar_massa':
            proteinRatio = 0.30;  // 30% proteína
            carbRatio = 0.45;     // 45% carboidratos
            fatRatio = 0.25;      // 25% gorduras
            break;
        case 'ganhar_peso':
            proteinRatio = 0.25;  // 25% proteína
            carbRatio = 0.50;     // 50% carboidratos
            fatRatio = 0.25;      // 25% gorduras
            break;
        default: // manter_peso
            proteinRatio = 0.30;  // 30% proteína
            carbRatio = 0.40;     // 40% carboidratos
            fatRatio = 0.30;      // 30% gorduras
    }

    const proteinCalories = totalCalories * proteinRatio;
    const carbCalories = totalCalories * carbRatio;
    const fatCalories = totalCalories * fatRatio;

    return {
        protein: {
            grams: Math.round(proteinCalories / 4), // 4 cal/g
            calories: Math.round(proteinCalories),
            percentage: Math.round(proteinRatio * 100)
        },
        carbs: {
            grams: Math.round(carbCalories / 4), // 4 cal/g
            calories: Math.round(carbCalories),
            percentage: Math.round(carbRatio * 100)
        },
        fat: {
            grams: Math.round(fatCalories / 9), // 9 cal/g
            calories: Math.round(fatCalories),
            percentage: Math.round(fatRatio * 100)
        }
    };
};

// Calcular necessidade de água
const calculateWaterNeeds = (weight, activityLevel, goal) => {
    let baseWater = weight * 35; // 35ml por kg base

    // Ajustar por atividade
    const activityBonus = {
        'sedentario': 0,
        'leve': 500,
        'moderado': 750,
        'intenso': 1000,
        'muito_intenso': 1250
    };

    baseWater += activityBonus[activityLevel] || 0;

    // Ajustar por objetivo
    if (goal === 'perder_peso') {
        baseWater += 500; // Mais água para queima de gordura
    }

    return Math.round(baseWater);
};

// Endpoint principal para cálculos metabólicos
const getMetabolicCalculations = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { age, gender, activityLevel } = req.body;

        // Buscar dados do usuário
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                weight: true,
                height: true,
                goal: true
            }
        });

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        if (!user.weight || !user.height) {
            return res.status(400).json({
                error: 'Peso e altura são obrigatórios para cálculos metabólicos',
                message: 'Por favor, atualize seu perfil com peso e altura'
            });
        }

        if (!age || !gender || !activityLevel) {
            return res.status(400).json({
                error: 'Dados incompletos',
                message: 'Idade, gênero e nível de atividade são obrigatórios'
            });
        }

        // Calcular IMC
        const heightInMeters = user.height / 100;
        const bmi = user.weight / (heightInMeters * heightInMeters);

        // Calcular TMB (Taxa Metabólica Basal)
        const bmr = calculateBMR(user.weight, user.height, age, gender);

        // Calcular TDEE (Gasto Energético Total Diário)
        const activityFactor = getActivityFactor(activityLevel);
        const tdee = bmr * activityFactor;

        // Calcular calorias para o objetivo
        const targetCalories = calculateCaloriesForGoal(tdee, user.goal);

        // Calcular macronutrientes
        const macros = calculateMacros(targetCalories, user.goal, user.weight);

        // Calcular necessidade de água
        const waterNeeds = calculateWaterNeeds(user.weight, activityLevel, user.goal);

        // Recomendações personalizadas
        const getRecommendations = () => {
            const recommendations = [];

            if (user.goal === 'perder_peso') {
                recommendations.push('Mantenha um déficit calórico consistente');
                recommendations.push('Priorize proteínas para preservar massa muscular');
                recommendations.push('Inclua exercícios de resistência na sua rotina');
                recommendations.push('Beba mais água para acelerar o metabolismo');
            } else if (user.goal === 'ganhar_massa') {
                recommendations.push('Consuma proteína a cada 3-4 horas');
                recommendations.push('Não pule refeições, especialmente pós-treino');
                recommendations.push('Inclua carboidratos complexos nas suas refeições');
                recommendations.push('Durma pelo menos 7-8 horas por noite');
            } else if (user.goal === 'ganhar_peso') {
                recommendations.push('Faça refeições frequentes (5-6 por dia)');
                recommendations.push('Inclua gorduras saudáveis (castanhas, azeite, abacate)');
                recommendations.push('Adicione shakes hipercalóricos entre as refeições');
                recommendations.push('Monitore o ganho de peso gradualmente');
            } else {
                recommendations.push('Mantenha uma alimentação equilibrada');
                recommendations.push('Pratique atividade física regularmente');
                recommendations.push('Monitore seu peso semanalmente');
                recommendations.push('Ajuste as calorias conforme necessário');
            }

            return recommendations;
        };

        const result = {
            user: {
                weight: user.weight,
                height: user.height,
                goal: user.goal,
                bmi: Math.round(bmi * 10) / 10
            },
            metabolic: {
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                targetCalories,
                waterNeeds
            },
            macros,
            recommendations: getRecommendations()
        };

        res.json({
            message: 'Cálculos metabólicos realizados com sucesso',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

// Atualizar dados metabólicos do usuário
const updateMetabolicData = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { age, gender, activityLevel } = req.body;

        // Aqui você pode salvar esses dados extras se quiser criar uma tabela específica
        // Por enquanto, vamos retornar os cálculos atualizados

        req.body = { age, gender, activityLevel };
        await getMetabolicCalculations(req, res, next);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMetabolicCalculations,
    updateMetabolicData
};
