'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface WaterRecord {
    id: string;
    amount: number;
    timestamp: string;
    date: string;
}

export default function WaterPage() {
    const [waterRecords, setWaterRecords] = useState<WaterRecord[]>([]);
    const [dailyGoal, setDailyGoal] = useState(2000); // ml
    const [currentAmount, setCurrentAmount] = useState(250); // ml
    const [loading, setLoading] = useState(false);
    const [totalToday, setTotalToday] = useState(0);
    const router = useRouter();

    // Verificar se está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchWaterRecords();
    }, []);

    const fetchWaterRecords = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/water', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // O backend retorna { waterLogs: [], pagination: {} }
                const records = Array.isArray(data.waterLogs) ? data.waterLogs : Array.isArray(data) ? data : [];
                setWaterRecords(records);

                // Calcular total de hoje
                const today = new Date().toISOString().split('T')[0];
                const todayRecords = records.filter((record: WaterRecord) =>
                    record.date === today
                );
                const total = todayRecords.reduce((sum: number, record: WaterRecord) =>
                    sum + record.amount, 0
                );
                setTotalToday(total);
            } else {
                // Se a resposta não for ok, definir como array vazio
                setWaterRecords([]);
                setTotalToday(0);
            }
        } catch (error) {
            console.error('Erro ao buscar registros de água:', error);
            // Em caso de erro, definir como array vazio
            setWaterRecords([]);
            setTotalToday(0);
        }
    };

    const addWater = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/water', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: currentAmount,
                }),
            });

            if (response.ok) {
                await fetchWaterRecords();
                setCurrentAmount(250); // Reset para valor padrão
            }
        } catch (error) {
            console.error('Erro ao adicionar água:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteWaterRecord = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/water/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await fetchWaterRecords();
            }
        } catch (error) {
            console.error('Erro ao remover registro:', error);
        }
    };

    const progressPercentage = Math.min((totalToday / dailyGoal) * 100, 100);

    // Valores rápidos para adicionar
    const quickAmounts = [250, 500, 750, 1000];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">💧 Controle de Hidratação</h1>
                    <p className="text-gray-600">Acompanhe seu consumo diário de água</p>
                </div>

                {/* Meta diária e progresso */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Meta Diária</h2>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Meta:</label>
                            <input
                                type="number"
                                value={dailyGoal}
                                onChange={(e) => setDailyGoal(Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                            <span className="text-sm text-gray-600">ml</span>
                        </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>{totalToday} ml</span>
                            <span>{dailyGoal} ml</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-lg font-semibold text-blue-600">
                                {progressPercentage.toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Adicionar água */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Consumo</h2>

                    {/* Valores rápidos */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valores rápidos:
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {quickAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setCurrentAmount(amount)}
                                    className={`px-4 py-2 rounded-md border ${currentAmount === amount
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {amount}ml
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input customizado */}
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantidade (ml):
                            </label>
                            <input
                                type="number"
                                value={currentAmount}
                                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                                max="2000"
                            />
                        </div>
                        <button
                            onClick={addWater}
                            disabled={loading || currentAmount <= 0}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </button>
                    </div>
                </div>

                {/* Histórico de hoje */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Hoje</h2>

                    {waterRecords.filter(record =>
                        record.date === new Date().toISOString().split('T')[0]
                    ).length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Nenhum registro de água hoje. Comece a se hidratar! 💧
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {waterRecords
                                .filter(record => record.date === new Date().toISOString().split('T')[0])
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                .map((record) => (
                                    <div
                                        key={record.id}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold">💧</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{record.amount} ml</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(record.timestamp).toLocaleTimeString('pt-BR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteWaterRecord(record.id)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                            title="Remover registro"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
