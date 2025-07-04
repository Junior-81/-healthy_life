'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MetabolicData {
    user: {
        weight: number;
        height: number;
        goal: string;
        bmi: number;
    };
    metabolic: {
        bmr: number;
        tdee: number;
        targetCalories: number;
        waterNeeds: number;
    };
    macros: {
        protein: { grams: number; calories: number; percentage: number };
        carbs: { grams: number; calories: number; percentage: number };
        fat: { grams: number; calories: number; percentage: number };
    };
    recommendations: string[];
}

export default function MetabolismPage() {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'masculino',
        activityLevel: 'moderado'
    });
    const [metabolicData, setMetabolicData] = useState<MetabolicData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Verificar se usuário está logado
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3001/api/metabolism/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    age: parseInt(formData.age),
                    gender: formData.gender,
                    activityLevel: formData.activityLevel
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMetabolicData(data.data);
            } else {
                setError(data.error || 'Erro ao calcular dados metabólicos');
            }
        } catch (err) {
            setError('Erro de conexão. Verifique se o servidor está rodando.');
        } finally {
            setIsLoading(false);
        }
    };

    const getBMIStatus = (bmi: number) => {
        if (bmi < 18.5) return { text: 'Abaixo do peso', color: 'text-blue-600' };
        if (bmi < 25) return { text: 'Peso normal', color: 'text-green-600' };
        if (bmi < 30) return { text: 'Sobrepeso', color: 'text-yellow-600' };
        return { text: 'Obesidade', color: 'text-red-600' };
    };

    const getGoalText = (goal: string) => {
        const goals: { [key: string]: string } = {
            'perder_peso': 'Perder peso',
            'ganhar_peso': 'Ganhar peso',
            'manter_peso': 'Manter peso',
            'ganhar_massa': 'Ganhar massa muscular',
            'melhorar_condicionamento': 'Melhorar condicionamento'
        };
        return goals[goal] || goal;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-indigo-600 hover:text-indigo-500 mr-4"
                            >
                                ← Voltar
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Metabolismo e Nutrição</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    {/* Formulário */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Calcular Necessidades Metabólicas
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                        Idade
                                    </label>
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="16"
                                        max="100"
                                        required
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="25"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                        Sexo
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                                        Nível de Atividade
                                    </label>
                                    <select
                                        id="activityLevel"
                                        name="activityLevel"
                                        value={formData.activityLevel}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="sedentario">Sedentário (pouco/nenhum exercício)</option>
                                        <option value="leve">Leve (1-3 dias/semana)</option>
                                        <option value="moderado">Moderado (3-5 dias/semana)</option>
                                        <option value="intenso">Intenso (6-7 dias/semana)</option>
                                        <option value="muito_intenso">Muito intenso (2x/dia, treino pesado)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Calculando...' : 'Calcular Metabolismo'}
                            </button>
                        </form>
                    </div>

                    {/* Resultados */}
                    {metabolicData && (
                        <div className="space-y-6">

                            {/* Cards de Resumo */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">📊</span>
                                                </div>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        IMC
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {metabolicData.user.bmi}
                                                    </dd>
                                                    <dd className={`text-sm ${getBMIStatus(metabolicData.user.bmi).color}`}>
                                                        {getBMIStatus(metabolicData.user.bmi).text}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">🔥</span>
                                                </div>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Metabolismo Basal
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {metabolicData.metabolic.bmr} cal
                                                    </dd>
                                                    <dd className="text-sm text-gray-500">
                                                        TMB/dia
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">🎯</span>
                                                </div>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Calorias Alvo
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {metabolicData.metabolic.targetCalories} cal
                                                    </dd>
                                                    <dd className="text-sm text-gray-500">
                                                        Para {getGoalText(metabolicData.user.goal).toLowerCase()}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">💧</span>
                                                </div>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Água Recomendada
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {(metabolicData.metabolic.waterNeeds / 1000).toFixed(1)}L
                                                    </dd>
                                                    <dd className="text-sm text-gray-500">
                                                        {metabolicData.metabolic.waterNeeds}ml/dia
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Macronutrientes */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Distribuição de Macronutrientes
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <div className="text-3xl font-bold text-red-600">
                                            {metabolicData.macros.protein.grams}g
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Proteína ({metabolicData.macros.protein.percentage}%)
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {metabolicData.macros.protein.calories} calorias
                                        </div>
                                    </div>

                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {metabolicData.macros.carbs.grams}g
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Carboidratos ({metabolicData.macros.carbs.percentage}%)
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {metabolicData.macros.carbs.calories} calorias
                                        </div>
                                    </div>

                                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                        <div className="text-3xl font-bold text-yellow-600">
                                            {metabolicData.macros.fat.grams}g
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Gorduras ({metabolicData.macros.fat.percentage}%)
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {metabolicData.macros.fat.calories} calorias
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recomendações */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Recomendações Personalizadas
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {metabolicData.recommendations.map((recommendation, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                {recommendation}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
