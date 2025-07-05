const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Inicialização automática do Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para verificar/inicializar Prisma
async function initializePrisma() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma conectado com sucesso');
  } catch (error) {
    console.log('⚠️ Tentando conectar ao Prisma...');
    // Se falhar, tenta novamente em 2 segundos
    setTimeout(initializePrisma, 2000);
  }
}

// Inicializa Prisma
initializePrisma();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const trainingRoutes = require('./routes/trainings');
const mealRoutes = require('./routes/meals');
const waterRoutes = require('./routes/water');
const weightRoutes = require('./routes/weights');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet());

// Configuração CORS mais permissiva para desenvolvimento
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200
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

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/weights', weightRoutes);
app.use('/api/metabolism', require('./routes/metabolism'));

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
