@echo off
REM Build script para Windows - Healthy Life Backend

echo 🚀 Iniciando build do Healthy Life Backend...

REM Instalar dependências do projeto raiz
echo 📦 Instalando dependências do projeto raiz...
npm install

REM Navegar para backend e instalar dependências
echo 📦 Instalando dependências do backend...
cd backend
npm install

REM Gerar Prisma Client
echo 🔧 Gerando Prisma Client...
npx prisma generate --schema=../prisma/schema.prisma

REM Voltar para raiz
cd..

echo ✅ Build concluído com sucesso!
echo.
echo Para iniciar o projeto:
echo   Backend: cd backend && npm run dev
echo   Frontend: cd frontend && npm run dev
echo.
pause
