'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { name: 'Perfil', href: '/profile', icon: '👤' },
        { name: 'Metabolismo', href: '/metabolism', icon: '🧬' },
        { name: 'Treinos', href: '/trainings', icon: '🏋️' },
        { name: 'Refeições', href: '/meals', icon: '�️' },
        { name: 'Água', href: '/water', icon: '💧' }
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo e Nome */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-indigo-600">Healthy Life</h1>
                        </div>
                    </div>

                    {/* Menu de Navegação */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${isActive(item.href)
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Menu do Usuário */}
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 hidden sm:block">
                            Olá, {user?.name?.split(' ')[0] || 'Usuário'}!
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className={`flex px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left items-center space-x-2 ${isActive(item.href)
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
