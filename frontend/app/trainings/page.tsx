'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function TrainingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Treinos 🏋️
                        </h1>
                        <p className="text-gray-600">
                            Escolha o tipo de treino e acesse dicas, orientações e planos de exercícios.
                        </p>
                    </div>

                    {/* Training Types */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                        {/* Musculação Card */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                                <div className="flex items-center">
                                    <div className="text-4xl mr-4">🏋️‍♂️</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Musculação</h2>
                                        <p className="text-blue-100">Fortalecimento e hipertrofia muscular</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Acesse dicas de musculação, exercícios para diferentes grupos musculares,
                                    técnicas de execução e sugestões de treinos para iniciantes e avançados.
                                </p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Exercícios por grupo muscular
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Técnicas de execução
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Planos para todos os níveis
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Dicas de segurança
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push('/trainings/bodybuilding')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                                >
                                    Acessar Musculação
                                </button>
                            </div>
                        </div>

                        {/* Corrida Card */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                                <div className="flex items-center">
                                    <div className="text-4xl mr-4">🏃‍♀️</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Corrida</h2>
                                        <p className="text-green-100">Condicionamento cardiovascular</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Encontre planos de corrida, técnicas de respiração, dicas para iniciantes
                                    e estratégias para melhorar seu desempenho cardiovascular.
                                </p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Planos para iniciantes
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Técnicas de respiração
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Treinos intervalados
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Prevenção de lesões
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push('/trainings/running')}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                                >
                                    Acessar Corrida
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* General Tips */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            🎯 Dicas Gerais para Treinos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Antes do Treino</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Faça um aquecimento de 5-10 minutos</li>
                                    <li>• Hidrate-se adequadamente</li>
                                    <li>• Use roupas e calçados apropriados</li>
                                    <li>• Defina objetivos claros para a sessão</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Durante o Treino</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Mantenha a forma correta dos exercícios</li>
                                    <li>• Respeite os intervalos de descanso</li>
                                    <li>• Escute seu corpo e evite excessos</li>
                                    <li>• Mantenha-se hidratado</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Após o Treino</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Faça alongamentos ou relaxamento</li>
                                    <li>• Hidrate-se e alimente-se adequadamente</li>
                                    <li>• Registre seu progresso</li>
                                    <li>• Descanse para recuperação muscular</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Segurança</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Procure orientação profissional se necessário</li>
                                    <li>• Progrida gradualmente na intensidade</li>
                                    <li>• Pare se sentir dor anormal</li>
                                    <li>• Mantenha regularidade nos treinos</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-yellow-800 mb-2">
                            🚀 Funcionalidades em Desenvolvimento
                        </h4>
                        <div className="text-yellow-700 space-y-1">
                            <p>• Registro de treinos realizados</p>
                            <p>• Histórico de exercícios e progresso</p>
                            <p>• Calculadora de 1RM (repetição máxima)</p>
                            <p>• Cronômetro para intervalos</p>
                            <p>• Criação de treinos personalizados</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
