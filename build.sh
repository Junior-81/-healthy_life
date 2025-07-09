#!/bin/bash

# Build script para Render e desenvolvimento local
echo "🚀 Iniciando build do Healthy Life Backend..."

# Instalar dependências do projeto raiz
echo "📦 Instalando dependências do projeto raiz..."
npm install

# Navegar para backend e instalar dependências
echo "📦 Instalando dependências do backend..."
cd backend
npm install

# Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate --schema=../prisma/schema.prisma

echo "✅ Build concluído com sucesso!"
echo ""
echo "Para desenvolvimento local:"
echo "  Backend: cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Para Windows, use: dev.bat"
