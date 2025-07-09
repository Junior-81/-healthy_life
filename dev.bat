@echo off
REM Script de desenvolvimento - Healthy Life

echo 🚀 Iniciando Healthy Life em modo desenvolvimento...
echo.

REM Verificar se o Prisma Client foi gerado
if not exist "node_modules\@prisma\client" (
    echo ⚠️  Prisma Client não encontrado. Executando build...
    call build.bat
)

echo 🔧 Configurando ambiente...

REM Criar novos terminais para backend e frontend
echo 📡 Iniciando Backend na porta 3001...
start "Healthy Life Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 🌐 Iniciando Frontend na porta 3000...
start "Healthy Life Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Serviços iniciados!
echo.
echo 📊 URLs disponíveis:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:3001/api/health
echo.
echo Pressione qualquer tecla para sair...
pause >nul
