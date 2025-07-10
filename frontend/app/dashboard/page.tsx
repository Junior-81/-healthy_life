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

import Navbar from '../components/Navbar';

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
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bem-vindo ao Healthy Life! 👋
            </h2>
            <p className="text-xl text-gray-600">
              Sua plataforma completa para acompanhar saúde, treinos e nutrição.
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

          {/* O que você pode fazer no Healthy Life */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              O que você pode fazer no Healthy Life
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Card Metabolismo */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">🧬</div>
                  <h4 className="text-xl font-semibold text-gray-900">Cálculo Metabólico</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Calcule sua Taxa Metabólica Basal (TMB), gasto energético total e receba
                  recomendações personalizadas de macronutrientes e água baseadas no seu objetivo.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  ✓ TMB e TDEE personalizados ✓ Recomendações de macros ✓ Meta de hidratação
                </div>
              </div>

              {/* Card Treinos */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">🏋️</div>
                  <h4 className="text-xl font-semibold text-gray-900">Treinos</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Acesse dicas e orientações para treinos de musculação e corrida.
                  Organize sua rotina de exercícios e acompanhe seu progresso físico.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  ✓ Dicas de musculação ✓ Planos de corrida ✓ Técnicas básicas
                </div>
              </div>

              {/* Card Perfil */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">👤</div>
                  <h4 className="text-xl font-semibold text-gray-900">Perfil</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Gerencie seus dados pessoais, atualize informações físicas e
                  registre medições corporais para acompanhar sua evolução.
                </p>
                <div className="text-sm text-indigo-600 font-medium">
                  ✓ Dados pessoais ✓ Medições corporais ✓ Histórico de progresso
                </div>
              </div>

              {/* Card Refeições */}
              <div
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/meals')}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">�️</div>
                  <h4 className="text-xl font-semibold text-gray-900">Refeições</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Registre suas refeições diárias, acompanhe o consumo de calorias e
                  monitore se está seguindo as recomendações nutricionais.
                </p>
                <div className="text-sm text-green-600 font-medium">
                  ✓ Registro de refeições ✓ Contagem de calorias ✓ Histórico nutricional
                </div>
              </div>

              {/* Card Água */}
              <div
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/water')}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">💧</div>
                  <h4 className="text-xl font-semibold text-gray-900">Hidratação</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Monitore seu consumo diário de água, receba lembretes de hidratação e
                  acompanhe se está atingindo sua meta personalizada.
                </p>
                <div className="text-sm text-cyan-600 font-medium">
                  ✓ Meta de hidratação ✓ Registro diário ✓ Controle inteligente
                </div>
              </div>

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
      </main>
    </div>
  );
}
