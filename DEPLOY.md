# 🚀 Deploy do Healthy Life

## 📋 Pré-requisitos
- ✅ Banco PostgreSQL configurado no Render
- ✅ Schema Prisma com UUID configurado
- ✅ Variáveis de ambiente configuradas

## 🗄️ Deploy do Backend (Render)

### 1. Configurar no painel da Render:
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`
- **Environment**: Node.js
- **Region**: Ohio (mesmo do banco)

### 2. Variáveis de ambiente no Render:
```
DATABASE_URL=postgresql://bd_healthy_life_user:xqE0W1xc7nRQR7nqgube2aIorFRM2Ilj@dpg-d1jikcili9vc738a7o30-a.ohio-postgres.render.com/bd_healthy_life
JWT_SECRET=seu_jwt_secret_muito_secreto_aqui_123456
PORT=3001
NODE_ENV=production
```

### 3. Após deploy, executar seed (opcional):
```bash
npm run db:seed
```

## 🌐 Deploy do Frontend (Vercel)

### 1. Conectar repositório no painel da Vercel
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 2. Variáveis de ambiente na Vercel:
```
NEXT_PUBLIC_API_URL=https://seu-backend-render.onrender.com
```

## 🔧 Comandos úteis

### Banco de dados:
```bash
# Gerar cliente Prisma
npm run db:generate

# Push schema para produção
npm run db:push

# Executar seed
npm run db:seed

# Abrir Prisma Studio
npm run db:studio
```

### Desenvolvimento local:
```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Frontend apenas
npm run dev:frontend

# Backend apenas  
npm run dev:backend
```

## 📝 URLs após deploy:
- **Frontend**: https://seu-app.vercel.app
- **Backend API**: https://seu-backend.onrender.com
- **Banco**: PostgreSQL no Render

## 🔍 Checklist de deploy:
- [ ] Backend deployado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Banco conectado e funcionando
- [ ] Frontend deployado na Vercel
- [ ] API_URL configurado no frontend
- [ ] Testes de autenticação funcionando
- [ ] Endpoints principais testados

## 🚨 Troubleshooting:
- Se erro de permissão no banco: usar `npx prisma db push` em vez de migrate
- Se erro de CORS: verificar configuração no backend
- Se erro de conexão: verificar URL do banco e variáveis de ambiente
