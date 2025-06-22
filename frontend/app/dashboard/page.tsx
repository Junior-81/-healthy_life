'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  height?: number;
  weight?: number;
  goal?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está logado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      router.push('/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Healthy Life</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bem-vindo ao seu Dashboard!
              </h2>
              <p className="text-gray-600">
                Aqui você pode acompanhar seu progresso e gerenciar sua jornada de saúde.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Perfil Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Perfil
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {user.name}
                        </dd>
                        <dd className="text-sm text-gray-500">
                          {user.email}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Físicos Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">📏</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Dados Físicos
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {user.height ? `${user.height} cm` : 'Não informado'}
                        </dd>
                        <dd className="text-sm text-gray-500">
                          {user.weight ? `${user.weight} kg` : 'Peso não informado'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* IMC Card */}
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
                          {bmi || 'Não calculado'}
                        </dd>
                        {bmiStatus && (
                          <dd className={`text-sm font-medium ${bmiStatus.color}`}>
                            {bmiStatus.text}
                          </dd>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Objetivo */}
            {user.goal && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Seu Objetivo
                </h3>
                <p className="text-gray-600 capitalize">
                  {user.goal.replace('_', ' ')}
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">🏋️</div>
                  <div className="text-sm font-medium">Treinos</div>
                </button>
                
                <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">🍎</div>
                  <div className="text-sm font-medium">Refeições</div>
                </button>
                
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="text-sm font-medium">Água</div>
                </button>
                
                <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition-colors">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="text-sm font-medium">Peso</div>
                </button>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="mt-8 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-yellow-800 mb-2">
                  🚀 Em desenvolvimento
                </h4>
                <p className="text-yellow-700">
                  Novas funcionalidades estarão disponíveis em breve: gráficos de progresso, 
                  registros detalhados e muito mais!
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
