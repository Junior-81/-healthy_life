const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Carregar variáveis de ambiente (backend + raiz)
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Inicialização do Prisma com tratamento de erro
let prisma;
async function initPrisma() {
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Prisma conectado com sucesso');
    return true;
  } catch (error) {
    console.log('⚠️ Prisma não inicializado ainda, tentando novamente...');
    return false;
  }
}

// Middleware para inicializar Prisma sob demanda
async function ensurePrisma(req, res, next) {
  if (!prisma) {
    const success = await initPrisma();
    if (!success) {
      return res.status(503).json({ error: 'Serviço temporariamente indisponível' });
    }
  }
  req.prisma = prisma;
  next();
}

// Exportar função para usar nas rotas
global.getPrisma = () => prisma;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const trainingRoutes = require('./routes/trainings');
const mealRoutes = require('./routes/meals');
const waterRoutes = require('./routes/water');
const weightRoutes = require('./routes/weights');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 10000; // Render usa porta dinâmica

console.log(`🔧 Configurando servidor na porta: ${PORT}`);
console.log(`📍 Variáveis de ambiente carregadas:`, {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ? '✅ Definida' : '❌ Não definida'
});

// Middlewares de segurança
app.use(helmet());

// Configuração CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sem origin (ex: mobile apps)
    if (!origin) return callback(null, true);

    // Em produção, permitir todas as origens
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }

    // Em desenvolvimento, permitir localhost em várias portas
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    console.log('CORS bloqueado para origem:', origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with', 'Origin', 'Accept'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP por janela de tempo
});
app.use(limiter);

// Parsing do body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas com middleware de Prisma
app.use('/api/auth', ensurePrisma, authRoutes);
app.use('/api/users', ensurePrisma, userRoutes);
app.use('/api/trainings', ensurePrisma, trainingRoutes);
app.use('/api/meals', ensurePrisma, mealRoutes);
app.use('/api/water', ensurePrisma, waterRoutes);
app.use('/api/weights', ensurePrisma, weightRoutes);
app.use('/api/metabolism', ensurePrisma, require('./routes/metabolism'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Host: 0.0.0.0:${PORT}`);
  console.log(`✅ Servidor pronto para receber conexões`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Erro no servidor:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
  });
});
