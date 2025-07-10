'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    height: number;
    weight: number;
    age: number;
    gender: string;
    goal: string;
}

export default function MetabolismPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        height: 0,
        weight: 0,
        age: 0,
        gender: '',
        goal: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('http://localhost:3001/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar dados do usuário');
            }

            const userData = await response.json();
            setUser(userData);
            setFormData({
                height: userData.height || 170,
                weight: userData.weight || 70,
                age: userData.age || 25,
                gender: userData.gender || 'male',
                goal: userData.goal || 'maintain'
            });
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            localStorage.removeItem('token');
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const calculateBMR = () => {
        const { height, weight, age, gender } = formData;

        if (gender === 'male') {
            return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
        } else {
            return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
        }
    };

    const calculateTDEE = () => {
        const bmr = calculateBMR();
        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };

        // Usando atividade moderada como padrão
        return Math.round(bmr * activityMultipliers.moderate);
    };

    const getCalorieGoal = () => {
        const tdee = calculateTDEE();
        const goalMultipliers = {
            'lose': 0.8,  // -20%
            'maintain': 1.0,
            'gain': 1.2   // +20%
        };

        const multiplier = goalMultipliers[formData.goal as keyof typeof goalMultipliers] || 1.0;
        return Math.round(tdee * multiplier);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Falha ao atualizar dados');
            }

            await fetchUserData();
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar dados');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    const bmr = calculateBMR();
    const tdee = calculateTDEE();
    const calorieGoal = getCalorieGoal();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Metabolismo</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        {isEditing ? 'Cancelar' : 'Editar Dados'}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Dados Pessoais */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Dados Pessoais</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Altura (cm)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => handleInputChange('height', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-lg">{formData.height} cm</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Peso (kg)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-lg">{formData.weight} kg</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Idade
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => handleInputChange('age', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-lg">{formData.age} anos</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gênero
                                </label>
                                {isEditing ? (
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="male">Masculino</option>
                                        <option value="female">Feminino</option>
                                    </select>
                                ) : (
                                    <p className="text-lg">{formData.gender === 'male' ? 'Masculino' : 'Feminino'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Objetivo
                                </label>
                                {isEditing ? (
                                    <select
                                        value={formData.goal}
                                        onChange={(e) => handleInputChange('goal', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="lose">Perder Peso</option>
                                        <option value="maintain">Manter Peso</option>
                                        <option value="gain">Ganhar Peso</option>
                                    </select>
                                ) : (
                                    <p className="text-lg">
                                        {formData.goal === 'lose' ? 'Perder Peso' :
                                            formData.goal === 'maintain' ? 'Manter Peso' : 'Ganhar Peso'}
                                    </p>
                                )}
                            </div>

                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                                >
                                    Salvar Alterações
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Cálculos Metabólicos */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Cálculos Metabólicos</h2>

                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-800 mb-2">Taxa Metabólica Basal (TMB)</h3>
                                <p className="text-2xl font-bold text-blue-600">{bmr} kcal/dia</p>
                                <p className="text-sm text-blue-600 mt-1">
                                    Energia necessária para funções básicas do corpo
                                </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-800 mb-2">Gasto Energético Total (GET)</h3>
                                <p className="text-2xl font-bold text-green-600">{tdee} kcal/dia</p>
                                <p className="text-sm text-green-600 mt-1">
                                    TMB + atividade física (moderada)
                                </p>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-orange-800 mb-2">Meta Calórica</h3>
                                <p className="text-2xl font-bold text-orange-600">{calorieGoal} kcal/dia</p>
                                <p className="text-sm text-orange-600 mt-1">
                                    Baseado no seu objetivo atual
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">IMC</h3>
                                <p className="text-2xl font-bold text-gray-600">
                                    {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Índice de Massa Corporal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dicas */}
                <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>💡 Dica:</strong> Os cálculos são baseados em fórmulas científicas e consideram atividade física moderada.
                                Para resultados mais precisos, consulte um profissional de saúde.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
