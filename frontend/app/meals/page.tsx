'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Meal {
    id: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    description: string;
    calories: number;
    timestamp: string;
    date: string;
}

export default function MealsPage() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
    const [description, setDescription] = useState('');
    const [calories, setCalories] = useState(0);
    const [loading, setLoading] = useState(false);
    const [calorieGoal, setCalorieGoal] = useState(2000);
    const [totalCaloriesToday, setTotalCaloriesToday] = useState(0);
    const router = useRouter();

    // Verificar se está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/meals', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // O backend retorna { meals: [], pagination: {} }
                const mealsData = Array.isArray(data.meals) ? data.meals : Array.isArray(data) ? data : [];
                setMeals(mealsData);

                // Calcular total de calorias de hoje
                const today = new Date().toISOString().split('T')[0];
                const todayMeals = mealsData.filter((meal: Meal) => meal.date === today);
                const total = todayMeals.reduce((sum: number, meal: Meal) => sum + meal.calories, 0);
                setTotalCaloriesToday(total);
            } else {
                // Se a resposta não for ok, definir como array vazio
                setMeals([]);
                setTotalCaloriesToday(0);
            }
        } catch (error) {
            console.error('Erro ao buscar refeições:', error);
            // Em caso de erro, definir como array vazio
            setMeals([]);
            setTotalCaloriesToday(0);
        }
    };

    const addMeal = async () => {
        if (!description.trim() || calories <= 0) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/meals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: mealType,
                    description: description.trim(),
                    calories,
                }),
            });

            if (response.ok) {
                await fetchMeals();
                setDescription('');
                setCalories(0);
            }
        } catch (error) {
            console.error('Erro ao adicionar refeição:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMeal = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/meals/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await fetchMeals();
            }
        } catch (error) {
            console.error('Erro ao remover refeição:', error);
        }
    };

    const getMealTypeEmoji = (type: string) => {
        switch (type) {
            case 'breakfast': return '🌅';
            case 'lunch': return '🌞';
            case 'dinner': return '🌙';
            case 'snack': return '🍎';
            default: return '🍽️';
        }
    };

    const getMealTypeName = (type: string) => {
        switch (type) {
            case 'breakfast': return 'Café da Manhã';
            case 'lunch': return 'Almoço';
            case 'dinner': return 'Jantar';
            case 'snack': return 'Lanche';
            default: return 'Refeição';
        }
    };

    const progressPercentage = Math.min((totalCaloriesToday / calorieGoal) * 100, 100);

    // Sugestões de refeições comuns
    const mealSuggestions = {
        breakfast: [
            { description: 'Pão integral com ovos mexidos', calories: 300 },
            { description: 'Aveia com frutas e mel', calories: 250 },
            { description: 'Iogurte com granola', calories: 200 },
        ],
        lunch: [
            { description: 'Arroz, feijão, frango grelhado e salada', calories: 600 },
            { description: 'Macarrão integral com molho de tomate', calories: 400 },
            { description: 'Peixe grelhado com legumes', calories: 350 },
        ],
        dinner: [
            { description: 'Sopa de legumes', calories: 200 },
            { description: 'Salada com frango', calories: 300 },
            { description: 'Omelete com verduras', calories: 250 },
        ],
        snack: [
            { description: 'Banana com amendoim', calories: 150 },
            { description: 'Mix de castanhas', calories: 100 },
            { description: 'Iogurte natural', calories: 80 },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">🍽️ Controle de Alimentação</h1>
                    <p className="text-gray-600">Registre suas refeições e acompanhe as calorias</p>
                </div>

                {/* Meta calórica e progresso */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Meta Calórica Diária</h2>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Meta:</label>
                            <input
                                type="number"
                                value={calorieGoal}
                                onChange={(e) => setCalorieGoal(Number(e.target.value))}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                            <span className="text-sm text-gray-600">kcal</span>
                        </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>{totalCaloriesToday} kcal</span>
                            <span>{calorieGoal} kcal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-lg font-semibold text-green-600">
                                {progressPercentage.toFixed(0)}%
                            </span>
                            <p className="text-sm text-gray-600">
                                Restam: {Math.max(0, calorieGoal - totalCaloriesToday)} kcal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Adicionar refeição */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Refeição</h2>

                    {/* Tipo de refeição */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de refeição:
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setMealType(type)}
                                    className={`px-4 py-2 rounded-md border flex items-center gap-2 ${mealType === type
                                        ? 'bg-green-500 text-white border-green-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>{getMealTypeEmoji(type)}</span>
                                    {getMealTypeName(type)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sugestões */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sugestões rápidas:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {mealSuggestions[mealType].map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDescription(suggestion.description);
                                        setCalories(suggestion.calories);
                                    }}
                                    className="text-left p-2 border border-gray-200 rounded hover:bg-gray-50 text-sm"
                                >
                                    <div className="font-medium">{suggestion.description}</div>
                                    <div className="text-gray-500">{suggestion.calories} kcal</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição da refeição:
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ex: Arroz, feijão, frango grelhado..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Calorias (kcal):
                            </label>
                            <input
                                type="number"
                                value={calories || ''}
                                onChange={(e) => setCalories(Number(e.target.value))}
                                placeholder="Ex: 350"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                min="1"
                                max="3000"
                            />
                            <div className="mt-2">
                                <button
                                    onClick={addMeal}
                                    disabled={loading || !description.trim() || calories <= 0}
                                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Adicionando...' : 'Adicionar Refeição'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refeições de hoje */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Refeições de Hoje</h2>

                    {meals.filter(meal =>
                        meal.date === new Date().toISOString().split('T')[0]
                    ).length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Nenhuma refeição registrada hoje. Adicione sua primeira refeição! 🍽️
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
                                const typeMeals = meals.filter(meal =>
                                    meal.type === type &&
                                    meal.date === new Date().toISOString().split('T')[0]
                                );

                                if (typeMeals.length === 0) return null;

                                return (
                                    <div key={type} className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <span>{getMealTypeEmoji(type)}</span>
                                            {getMealTypeName(type)}
                                            <span className="text-sm text-gray-500">
                                                ({typeMeals.reduce((sum, meal) => sum + meal.calories, 0)} kcal)
                                            </span>
                                        </h3>
                                        <div className="space-y-2">
                                            {typeMeals
                                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                .map((meal) => (
                                                    <div
                                                        key={meal.id}
                                                        className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{meal.description}</p>
                                                            <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                                                <span>{meal.calories} kcal</span>
                                                                <span>
                                                                    {new Date(meal.timestamp).toLocaleTimeString('pt-BR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteMeal(meal.id)}
                                                            className="text-red-500 hover:text-red-700 p-2"
                                                            title="Remover refeição"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
