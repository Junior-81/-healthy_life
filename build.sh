#!/bin/bash

# Build script para Render
echo "🚀 Iniciando build do Healthy Life Backend..."

# Instalar dependências do projeto raiz
npm install

# Navegar para backend e instalar dependências
cd backend
npm install

# Gerar Prisma Client
npx prisma generate --schema=../prisma/schema.prisma

echo "✅ Build concluído com sucesso!"
