'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

interface User {
    id: string;
    name: string;
    email: string;
    height?: number;
    weight?: number;
    goal?: string;
}

interface BodyMeasurement {
    id: string;
    weight?: number;
    chest?: number;
    waist?: number;
    hip?: number;
    arm?: number;
    thigh?: number;
    date: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showMeasurementForm, setShowMeasurementForm] = useState(false);
    const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        height: '',
        weight: '',
        goal: ''
    });

    const [measurementData, setMeasurementData] = useState({
        weight: '',
        chest: '',
        waist: '',
        hip: '',
        arm: '',
        thigh: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormData({
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                height: parsedUser.height?.toString() || '',
                weight: parsedUser.weight?.toString() || '',
                goal: parsedUser.goal || ''
            });
        } catch (error) {
            router.push('/login');
            return;
        }

        setIsLoading(false);
    }, [router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    height: formData.height ? parseInt(formData.height) : null,
                    weight: formData.weight ? parseFloat(formData.weight) : null,
                    goal: formData.goal
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);
                alert('Perfil atualizado com sucesso!');
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message}`);
            }
        } catch (error) {
            alert('Erro ao atualizar perfil. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/users/profile', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                alert('Conta excluída com sucesso.');
                router.push('/register');
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message}`);
            }
        } catch (error) {
            alert('Erro ao excluir conta. Tente novamente.');
        }
    };

    const handleAddMeasurement = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/users/measurements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    weight: measurementData.weight ? parseFloat(measurementData.weight) : null,
                    chest: measurementData.chest ? parseFloat(measurementData.chest) : null,
                    waist: measurementData.waist ? parseFloat(measurementData.waist) : null,
                    hip: measurementData.hip ? parseFloat(measurementData.hip) : null,
                    arm: measurementData.arm ? parseFloat(measurementData.arm) : null,
                    thigh: measurementData.thigh ? parseFloat(measurementData.thigh) : null,
                })
            });

            if (response.ok) {
                setMeasurementData({
                    weight: '',
                    chest: '',
                    waist: '',
                    hip: '',
                    arm: '',
                    thigh: ''
                });
                setShowMeasurementForm(false);
                alert('Medição registrada com sucesso!');
                // Aqui você poderia recarregar as medições
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message}`);
            }
        } catch (error) {
            alert('Erro ao registrar medição. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateBMI = () => {
        if (user?.height && user?.weight) {
            const heightInMeters = user.height / 100;
            return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
        return null;
    };

    const getBMIStatus = (bmi: number) => {
        if (bmi < 18.5) return { text: 'Abaixo do peso', color: 'text-blue-600' };
        if (bmi < 25) return { text: 'Peso normal', color: 'text-green-600' };
        if (bmi < 30) return { text: 'Sobrepeso', color: 'text-yellow-600' };
        return { text: 'Obesidade', color: 'text-red-600' };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const bmi = calculateBMI();
    const bmiStatus = bmi ? getBMIStatus(parseFloat(bmi)) : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Meu Perfil 👤
                        </h1>
                        <p className="text-gray-600">
                            Gerencie seus dados pessoais e acompanhe suas medições corporais.
                        </p>
                    </div>

                    {/* Current Data Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Profile Info Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Nome:</span> {user.name}</p>
                                <p><span className="font-medium">Email:</span> {user.email}</p>
                                <p><span className="font-medium">Objetivo:</span> {user.goal ? user.goal.replace('_', ' ') : 'Não definido'}</p>
                            </div>
                        </div>

                        {/* Physical Data Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Físicos</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Altura:</span> {user.height ? `${user.height} cm` : 'Não informado'}</p>
                                <p><span className="font-medium">Peso:</span> {user.weight ? `${user.weight} kg` : 'Não informado'}</p>
                                {bmi && (
                                    <p>
                                        <span className="font-medium">IMC:</span>
                                        <span className={`ml-1 ${bmiStatus?.color}`}>
                                            {bmi} ({bmiStatus?.text})
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Editar Perfil
                                </button>
                                <button
                                    onClick={() => setShowMeasurementForm(true)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Adicionar Medição
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Excluir Conta
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Modal */}
                    {isEditing && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Editar Perfil</h3>
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                                            <input
                                                type="number"
                                                value={formData.height}
                                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={formData.weight}
                                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Objetivo</label>
                                            <select
                                                value={formData.goal}
                                                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                <option value="">Selecione um objetivo</option>
                                                <option value="perder_peso">Perder peso</option>
                                                <option value="ganhar_peso">Ganhar peso</option>
                                                <option value="manter_peso">Manter peso</option>
                                                <option value="ganhar_massa">Ganhar massa muscular</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Add Measurement Modal */}
                    {showMeasurementForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Adicionar Medição Corporal</h3>
                                <form onSubmit={handleAddMeasurement}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={measurementData.weight}
                                                onChange={(e) => setMeasurementData({ ...measurementData, weight: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Peito/Busto (cm)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={measurementData.chest}
                                                onChange={(e) => setMeasurementData({ ...measurementData, chest: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cintura (cm)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={measurementData.waist}
                                                onChange={(e) => setMeasurementData({ ...measurementData, waist: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Quadril (cm)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={measurementData.hip}
                                                onChange={(e) => setMeasurementData({ ...measurementData, hip: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Braço (cm)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={measurementData.arm}
                                                onChange={(e) => setMeasurementData({ ...measurementData, arm: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Coxa (cm)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={measurementData.thigh}
                                                onChange={(e) => setMeasurementData({ ...measurementData, thigh: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowMeasurementForm(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Salvando...' : 'Registrar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <h3 className="text-lg font-bold text-red-600 mb-4">⚠️ Confirmar Exclusão</h3>
                                <p className="text-gray-700 mb-6">
                                    Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos seus dados serão perdidos permanentemente.
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Sim, Excluir Conta
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Measurements */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Medições Recentes</h3>
                        <div className="text-gray-600">
                            <p>Em breve você poderá visualizar o histórico das suas medições corporais aqui.</p>
                            <p className="mt-2 text-sm">
                                📈 Funcionalidade em desenvolvimento: gráficos de evolução, histórico detalhado e análise de progresso.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
