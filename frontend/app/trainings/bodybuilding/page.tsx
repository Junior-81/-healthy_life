'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function BodybuildingPage() {
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

    const muscleGroups = [
        {
            name: 'Peito',
            icon: '💪',
            exercises: [
                'Supino reto com barra',
                'Supino inclinado com halteres',
                'Flexão de braços',
                'Crucifixo com halteres',
                'Pullover'
            ]
        },
        {
            name: 'Costas',
            icon: '🔄',
            exercises: [
                'Puxada na frente',
                'Remada curvada',
                'Pulldown',
                'Remada sentada',
                'Barra fixa'
            ]
        },
        {
            name: 'Pernas',
            icon: '🦵',
            exercises: [
                'Agachamento livre',
                'Leg press',
                'Cadeira extensora',
                'Mesa flexora',
                'Panturrilha no leg press'
            ]
        },
        {
            name: 'Ombros',
            icon: '🤷',
            exercises: [
                'Desenvolvimento com barra',
                'Elevação lateral',
                'Elevação frontal',
                'Crucifixo invertido',
                'Encolhimento'
            ]
        },
        {
            name: 'Braços',
            icon: '💪',
            exercises: [
                'Rosca direta',
                'Tríceps pulley',
                'Rosca martelo',
                'Tríceps testa',
                'Rosca concentrada'
            ]
        },
        {
            name: 'Abdômen',
            icon: '⚡',
            exercises: [
                'Abdominal supra',
                'Prancha',
                'Elevação de pernas',
                'Abdominal bicicleta',
                'Prancha lateral'
            ]
        }
    ];

    const workoutPlans = {
        beginner: {
            title: 'Plano Iniciante (3x por semana)',
            description: 'Ideal para quem está começando na musculação',
            schedule: [
                {
                    day: 'Segunda-feira - Corpo Todo A',
                    exercises: [
                        'Agachamento livre - 3x12',
                        'Supino reto - 3x12',
                        'Puxada na frente - 3x12',
                        'Desenvolvimento ombros - 3x12',
                        'Rosca direta - 3x12',
                        'Tríceps pulley - 3x12',
                        'Prancha - 3x30s'
                    ]
                },
                {
                    day: 'Quarta-feira - Corpo Todo B',
                    exercises: [
                        'Leg press - 3x12',
                        'Supino inclinado - 3x12',
                        'Remada sentada - 3x12',
                        'Elevação lateral - 3x12',
                        'Rosca martelo - 3x12',
                        'Tríceps testa - 3x12',
                        'Abdominal supra - 3x15'
                    ]
                },
                {
                    day: 'Sexta-feira - Corpo Todo C',
                    exercises: [
                        'Agachamento sumô - 3x12',
                        'Flexão de braços - 3x10',
                        'Pulldown - 3x12',
                        'Elevação frontal - 3x12',
                        'Rosca concentrada - 3x12',
                        'Mergulho no banco - 3x10',
                        'Elevação de pernas - 3x12'
                    ]
                }
            ]
        },
        intermediate: {
            title: 'Plano Intermediário (4x por semana)',
            description: 'Para quem já tem experiência básica',
            schedule: [
                {
                    day: 'Segunda-feira - Peito e Tríceps',
                    exercises: [
                        'Supino reto - 4x10',
                        'Supino inclinado - 4x10',
                        'Crucifixo - 3x12',
                        'Tríceps pulley - 4x10',
                        'Tríceps testa - 3x12',
                        'Mergulho paralelas - 3x10'
                    ]
                },
                {
                    day: 'Terça-feira - Costas e Bíceps',
                    exercises: [
                        'Puxada na frente - 4x10',
                        'Remada curvada - 4x10',
                        'Remada sentada - 3x12',
                        'Rosca direta - 4x10',
                        'Rosca martelo - 3x12',
                        'Rosca concentrada - 3x12'
                    ]
                },
                {
                    day: 'Quinta-feira - Pernas',
                    exercises: [
                        'Agachamento livre - 4x10',
                        'Leg press - 4x12',
                        'Cadeira extensora - 3x15',
                        'Mesa flexora - 3x15',
                        'Panturrilha leg press - 4x15',
                        'Panturrilha em pé - 3x15'
                    ]
                },
                {
                    day: 'Sexta-feira - Ombros e Abdômen',
                    exercises: [
                        'Desenvolvimento barra - 4x10',
                        'Elevação lateral - 4x12',
                        'Elevação frontal - 3x12',
                        'Crucifixo invertido - 3x12',
                        'Prancha - 3x45s',
                        'Abdominal bicicleta - 3x20'
                    ]
                }
            ]
        },
        advanced: {
            title: 'Plano Avançado (5-6x por semana)',
            description: 'Para praticantes experientes',
            schedule: [
                {
                    day: 'Segunda-feira - Peito',
                    exercises: [
                        'Supino reto - 5x8',
                        'Supino inclinado - 4x10',
                        'Supino declinado - 3x12',
                        'Crucifixo inclinado - 4x10',
                        'Pullover - 3x12',
                        'Flexão diamante - 3x máx'
                    ]
                },
                {
                    day: 'Terça-feira - Costas',
                    exercises: [
                        'Barra fixa - 5x8',
                        'Remada curvada - 5x8',
                        'Puxada na frente - 4x10',
                        'Remada sentada - 4x10',
                        'Pulldown - 3x12',
                        'Encolhimento - 4x12'
                    ]
                },
                {
                    day: 'Quarta-feira - Pernas (Quadríceps)',
                    exercises: [
                        'Agachamento livre - 5x8',
                        'Leg press - 4x12',
                        'Hack squat - 4x10',
                        'Cadeira extensora - 4x15',
                        'Agachamento búlgaro - 3x12',
                        'Panturrilha leg press - 5x15'
                    ]
                },
                {
                    day: 'Quinta-feira - Ombros',
                    exercises: [
                        'Desenvolvimento barra - 5x8',
                        'Desenvolvimento halteres - 4x10',
                        'Elevação lateral - 5x12',
                        'Elevação frontal - 4x12',
                        'Crucifixo invertido - 4x12',
                        'Elevação lateral cabo - 3x15'
                    ]
                },
                {
                    day: 'Sexta-feira - Braços',
                    exercises: [
                        'Rosca direta - 5x10',
                        'Tríceps pulley - 5x10',
                        'Rosca martelo - 4x12',
                        'Tríceps testa - 4x10',
                        'Rosca concentrada - 3x12',
                        'Mergulho paralelas - 3x máx'
                    ]
                },
                {
                    day: 'Sábado - Pernas (Posterior)',
                    exercises: [
                        'Stiff - 5x10',
                        'Mesa flexora - 4x12',
                        'Agachamento sumô - 4x10',
                        'Cadeira adutora - 3x15',
                        'Cadeira abdutora - 3x15',
                        'Panturrilha sentado - 4x15'
                    ]
                }
            ]
        }
    };

    const currentPlan = workoutPlans[activeTab as keyof typeof workoutPlans];

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
                            Musculação 🏋️‍♂️
                        </h1>
                        <p className="text-gray-600">
                            Dicas, exercícios e planos de treino para fortalecimento e hipertrofia muscular.
                        </p>
                    </div>

                    {/* Muscle Groups */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Grupos Musculares</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {muscleGroups.map((group, index) => (
                                <div key={index} className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center mb-4">
                                        <span className="text-2xl mr-3">{group.icon}</span>
                                        <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {group.exercises.map((exercise, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                {exercise}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Workout Plans */}
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
                                {currentPlan.schedule.map((day, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">{day.day}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {day.exercises.map((exercise, idx) => (
                                                <div key={idx} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                    {exercise}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            💡 Dicas Importantes para Musculação
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Execução dos Exercícios</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Mantenha sempre a forma correta</li>
                                    <li>• Execute movimentos controlados</li>
                                    <li>• Respire corretamente durante o exercício</li>
                                    <li>• Use amplitude completa de movimento</li>
                                    <li>• Concentre-se no músculo trabalhado</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Progressão</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Aumente a carga gradualmente</li>
                                    <li>• Registre seus treinos e pesos</li>
                                    <li>• Varie os exercícios periodicamente</li>
                                    <li>• Respeite o tempo de descanso</li>
                                    <li>• Seja consistente com os treinos</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Segurança</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Sempre faça aquecimento antes</li>
                                    <li>• Use equipamentos de proteção</li>
                                    <li>• Peça ajuda para exercícios novos</li>
                                    <li>• Pare se sentir dor anormal</li>
                                    <li>• Mantenha a academia organizada</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Recuperação</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Descanse entre as séries</li>
                                    <li>• Alimente-se adequadamente</li>
                                    <li>• Durma pelo menos 7-8 horas</li>
                                    <li>• Hidrate-se durante o treino</li>
                                    <li>• Faça alongamentos após o treino</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-blue-800 mb-2">
                            🚀 Próximas Funcionalidades
                        </h4>
                        <div className="text-blue-700 space-y-1">
                            <p>• Vídeos demonstrativos dos exercícios</p>
                            <p>• Calculadora de 1RM (repetição máxima)</p>
                            <p>• Cronômetro para intervalos de descanso</p>
                            <p>• Registro personalizado de treinos</p>
                            <p>• Gráficos de evolução de cargas</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
