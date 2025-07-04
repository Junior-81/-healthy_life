'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function RunningPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('beginner');
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

    const runningTypes = [
        {
            name: 'Corrida Leve',
            icon: '🚶‍♀️',
            description: 'Ritmo confortável para recuperação e base aeróbica',
            pace: '6:00-7:00 min/km',
            benefits: ['Melhora base aeróbica', 'Facilita recuperação', 'Queima gordura']
        },
        {
            name: 'Corrida Moderada',
            icon: '🏃‍♀️',
            description: 'Ritmo intermediário para resistência',
            pace: '5:00-6:00 min/km',
            benefits: ['Aumenta resistência', 'Melhora VO2 máx', 'Fortalece músculos']
        },
        {
            name: 'Corrida Intensa',
            icon: '💨',
            description: 'Ritmo forte para desenvolvimento de velocidade',
            pace: '4:00-5:00 min/km',
            benefits: ['Desenvolve velocidade', 'Melhora potência', 'Aumenta capacidade anaeróbica']
        },
        {
            name: 'Treino Intervalado',
            icon: '⚡',
            description: 'Alternância entre alta e baixa intensidade',
            pace: 'Variável',
            benefits: ['Máximo VO2', 'Queima calórica alta', 'Melhora eficiência']
        }
    ];

    const runningPlans = {
        beginner: {
            title: 'Plano Iniciante (8 semanas)',
            description: 'Para quem está começando a correr ou voltando após pausa longa',
            weeks: [
                {
                    week: 'Semana 1-2',
                    schedule: [
                        { day: 'Segunda', workout: 'Caminhada 20 min + corrida 5 min + caminhada 10 min' },
                        { day: 'Quarta', workout: 'Caminhada 15 min + corrida 8 min + caminhada 10 min' },
                        { day: 'Sexta', workout: 'Caminhada 20 min + corrida 5 min + caminhada 10 min' }
                    ]
                },
                {
                    week: 'Semana 3-4',
                    schedule: [
                        { day: 'Segunda', workout: 'Corrida leve 15 min + caminhada 5 min' },
                        { day: 'Quarta', workout: 'Corrida leve 20 min' },
                        { day: 'Sexta', workout: 'Corrida leve 15 min + caminhada 5 min' }
                    ]
                },
                {
                    week: 'Semana 5-6',
                    schedule: [
                        { day: 'Segunda', workout: 'Corrida leve 25 min' },
                        { day: 'Quarta', workout: 'Corrida leve 30 min' },
                        { day: 'Sexta', workout: 'Corrida leve 25 min' }
                    ]
                },
                {
                    week: 'Semana 7-8',
                    schedule: [
                        { day: 'Segunda', workout: 'Corrida leve 30 min' },
                        { day: 'Quarta', workout: 'Corrida leve 35 min' },
                        { day: 'Sexta', workout: 'Corrida leve 30 min' }
                    ]
                }
            ]
        },
        intermediate: {
            title: 'Plano Intermediário (10km)',
            description: 'Para quem já corre regularmente e quer melhorar performance',
            weeks: [
                {
                    week: 'Segunda-feira',
                    schedule: [
                        { day: 'Aquecimento', workout: '10 min corrida leve' },
                        { day: 'Principal', workout: '5x1000m (ritmo 10km) com 2 min descanso' },
                        { day: 'Volta à calma', workout: '10 min corrida leve + alongamento' }
                    ]
                },
                {
                    week: 'Quarta-feira',
                    schedule: [
                        { day: 'Treino', workout: 'Corrida leve 45-60 min (ritmo confortável)' },
                        { day: 'Foco', workout: 'Manter frequência cardíaca aeróbica' },
                        { day: 'Objetivo', workout: 'Desenvolver base aeróbica' }
                    ]
                },
                {
                    week: 'Sexta-feira',
                    schedule: [
                        { day: 'Aquecimento', workout: '15 min corrida leve' },
                        { day: 'Principal', workout: '3x2000m (ritmo meio-maratona) com 3 min descanso' },
                        { day: 'Volta à calma', workout: '15 min corrida leve + alongamento' }
                    ]
                },
                {
                    week: 'Domingo',
                    schedule: [
                        { day: 'Long Run', workout: 'Corrida longa 60-90 min' },
                        { day: 'Ritmo', workout: 'Mais lento que o ritmo de prova' },
                        { day: 'Hidratação', workout: 'Levar água e repor eletrólitos' }
                    ]
                }
            ]
        },
        advanced: {
            title: 'Plano Avançado (Maratona)',
            description: 'Para corredores experientes visando maratona ou meia-maratona',
            weeks: [
                {
                    week: 'Segunda-feira',
                    schedule: [
                        { day: 'Descanso ativo', workout: 'Corrida regenerativa 30-40 min (muito leve)' },
                        { day: 'Alternativa', workout: 'Cross-training (bike, natação, elíptico)' },
                        { day: 'Foco', workout: 'Recuperação ativa e mobilidade' }
                    ]
                },
                {
                    week: 'Terça-feira',
                    schedule: [
                        { day: 'Aquecimento', workout: '20 min corrida leve + educativos' },
                        { day: 'Principal', workout: '6x1000m (ritmo 5km) com 400m trote recuperação' },
                        { day: 'Volta à calma', workout: '15 min corrida leve + alongamento' }
                    ]
                },
                {
                    week: 'Quinta-feira',
                    schedule: [
                        { day: 'Aquecimento', workout: '15 min corrida leve' },
                        { day: 'Principal', workout: '2x5000m (ritmo 10km) com 5 min descanso' },
                        { day: 'Volta à calma', workout: '15 min corrida leve + core' }
                    ]
                },
                {
                    week: 'Sábado',
                    schedule: [
                        { day: 'Aquecimento', workout: '20 min corrida leve' },
                        { day: 'Principal', workout: '15km no ritmo de maratona' },
                        { day: 'Volta à calma', workout: '10 min caminhada + hidratação' }
                    ]
                },
                {
                    week: 'Domingo',
                    schedule: [
                        { day: 'Long Run', workout: 'Corrida longa 25-35km' },
                        { day: 'Estratégia', workout: 'Praticar hidratação e nutrição de prova' },
                        { day: 'Ritmo', workout: '30-60s mais lento que ritmo maratona' }
                    ]
                }
            ]
        }
    };

    const currentPlan = runningPlans[activeTab as keyof typeof runningPlans];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                            ← Voltar para Treinos
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Corrida 🏃‍♀️
                        </h1>
                        <p className="text-gray-600">
                            Planos de treino, técnicas e dicas para melhorar seu desempenho na corrida.
                        </p>
                    </div>

                    {/* Types of Running */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tipos de Corrida</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {runningTypes.map((type, index) => (
                                <div key={index} className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center mb-4">
                                        <span className="text-2xl mr-3">{type.icon}</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                                            <p className="text-sm text-green-600 font-medium">{type.pace}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{type.description}</p>
                                    <div className="space-y-1">
                                        {type.benefits.map((benefit, idx) => (
                                            <div key={idx} className="text-sm text-gray-700 flex items-center">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Training Plans */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Planos de Treino</h2>

                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => setActiveTab('beginner')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'beginner'
                                        ? 'bg-white text-gray-900 shadow'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Iniciante
                            </button>
                            <button
                                onClick={() => setActiveTab('intermediate')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'intermediate'
                                        ? 'bg-white text-gray-900 shadow'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Intermediário
                            </button>
                            <button
                                onClick={() => setActiveTab('advanced')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'advanced'
                                        ? 'bg-white text-gray-900 shadow'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Avançado
                            </button>
                        </div>

                        {/* Plan Content */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentPlan.title}</h3>
                                <p className="text-gray-600">{currentPlan.description}</p>
                            </div>

                            <div className="space-y-6">
                                {currentPlan.weeks.map((week, index) => (
                                    <div key={index} className="border-l-4 border-green-500 pl-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">{week.week}</h4>
                                        <div className="space-y-3">
                                            {week.schedule.map((session, idx) => (
                                                <div key={idx} className="bg-gray-50 p-3 rounded">
                                                    <div className="font-medium text-gray-800">{session.day}</div>
                                                    <div className="text-sm text-gray-600 mt-1">{session.workout}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Running Techniques */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            🎯 Técnicas de Corrida
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Postura Corporal</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Mantenha o tronco ereto e ligeiramente inclinado</li>
                                    <li>• Relaxe os ombros, evite tensão</li>
                                    <li>• Olhe para frente, não para o chão</li>
                                    <li>• Mantenha os cotovelos próximos ao corpo</li>
                                    <li>• Balance os braços naturalmente</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Técnica de Passada</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Aterrisse com o pé sob o centro de gravidade</li>
                                    <li>• Use o médio-pé para aterrissar</li>
                                    <li>• Mantenha cadência de 170-180 passos/min</li>
                                    <li>• Evite passadas muito longas</li>
                                    <li>• Impulsione-se para frente, não para cima</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Respiração</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Respire pelo nariz e boca</li>
                                    <li>• Use respiração ritmada (3:2 ou 2:1)</li>
                                    <li>• Inspire profundamente, use o diafragma</li>
                                    <li>• Expire completamente para renovar o ar</li>
                                    <li>• Pratique respiração durante treinos leves</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Aquecimento e Educativos</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Comece sempre com corrida leve 10-15 min</li>
                                    <li>• Faça elevação de joelhos</li>
                                    <li>• Pratique calcanhar ao glúteo</li>
                                    <li>• Execute passadas largas</li>
                                    <li>• Finalize com acelerações progressivas</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Nutrition and Hydration */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            🥤 Hidratação e Nutrição
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Antes da Corrida</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Hidrate-se 2-3h antes (400-500ml)</li>
                                    <li>• Faça refeição leve 2-3h antes</li>
                                    <li>• Evite alimentos ricos em fibras</li>
                                    <li>• Prefira carboidratos de fácil digestão</li>
                                    <li>• Evite cafeína em excesso</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Durante a Corrida</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Beba pequenos goles a cada 15-20 min</li>
                                    <li>• Para corridas acima de 60 min, use bebida esportiva</li>
                                    <li>• Não espere sentir sede</li>
                                    <li>• Em clima quente, aumente a hidratação</li>
                                    <li>• Pratique estratégia em treinos</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Após a Corrida</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Reponha fluidos perdidos</li>
                                    <li>• Consuma proteína + carboidrato em 30-60 min</li>
                                    <li>• Inclua eletrólitos se treino durar mais de 1h</li>
                                    <li>• Monitore cor da urina</li>
                                    <li>• Continue hidratando nas próximas horas</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-green-800 mb-2">
                            🚀 Próximas Funcionalidades
                        </h4>
                        <div className="text-green-700 space-y-1">
                            <p>• Calculadora de pace e tempos de prova</p>
                            <p>• Cronômetro para treinos intervalados</p>
                            <p>• Registro de corridas e distâncias</p>
                            <p>• Gráficos de evolução de performance</p>
                            <p>• Planos personalizados por objetivo</p>
                            <p>• Alertas de hidratação durante treinos</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
