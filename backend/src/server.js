const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
