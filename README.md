# 🏃‍♂️ Healthy Life

Sistema completo para acompanhar treinos, nutrição e saúde pessoal.

## 🚀 Tecnologias

- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: Next.js 15 + React + TypeScript + Tailwind CSS
- **Banco de Dados**: PostgreSQL (Render)
- **Deploy**: Render (Backend) + Vercel/Netlify (Frontend)

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm

### 🏃‍♂️ Como rodar

#### Windows (Recomendado)
```bash
.\dev.bat
```

#### Manual
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 🌐 URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📁 Estrutura

```
healthy-life/
├── backend/           # API Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── routes/         # Rotas da API
│   │   ├── middlewares/    # Middlewares (auth, errors)
│   │   └── server.js       # Servidor principal
│   └── package.json
├── frontend/          # Next.js App
│   ├── app/               # App Router (Next.js 13+)
│   │   ├── components/    # Componentes React
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de cadastro
│   └── package.json
├── prisma/            # Schema e migrations
│   ├── schema.prisma      # Modelo do banco
│   └── seed.js           # Dados iniciais
└── package.json       # Workspace principal
```

## 🔐 Funcionalidades

### ✅ Implementadas
- 🔑 **Autenticação**: Login/Register com JWT
- 👤 **Usuários**: Cadastro e perfil
- 🏋️ **Treinos**: Musculação e corrida
- 🍽️ **Alimentação**: Controle de refeições
- 💧 **Hidratação**: Controle de água
- ⚖️ **Peso**: Acompanhamento de peso
- 📊 **Metabolismo**: Cálculo de TMB

### 🚧 Em desenvolvimento
- 📈 **Relatórios**: Gráficos de progresso
- 🏆 **Metas**: Sistema de objetivos
- 📱 **PWA**: App móvel

## 🗄️ Banco de Dados

O projeto usa PostgreSQL com Prisma ORM:

```bash
# Sincronizar schema
npx prisma db push --schema=prisma/schema.prisma

# Visualizar dados
npx prisma studio --schema=prisma/schema.prisma

# Popular banco (dados iniciais)
npm run db:seed
```

## 🚀 Deploy

### Backend (Render)
1. Fork/clone este repositório
2. Crie um Web Service no Render
3. Configure as variáveis de ambiente
4. Deploy automático

[📋 Instruções detalhadas](./render-deploy.md)

### Frontend (Vercel/Netlify)
1. Conecte o repositório
2. Configure `frontend/` como diretório raiz
3. Deploy automático

## 🔧 Scripts Úteis

```bash
# Desenvolvimento (Windows)
.\dev.bat

# Build completo
.\build.bat           # Windows
./build.sh            # Linux/macOS

# Apenas backend
cd backend && npm run dev

# Apenas frontend
cd frontend && npm run dev

# Database
npm run db:migrate    # Migrar schema
npm run db:seed       # Popular dados
npm run db:studio     # Interface visual
```

## 🐛 Solução de Problemas

### Erro "Prisma Client did not initialize"
```bash
cd backend
npx prisma generate --schema=../prisma/schema.prisma
```

### CORS Error
Verifique se backend está na porta 3001 e frontend na 3000.

### Database Connection Error
Verifique a `DATABASE_URL` no arquivo `.env`.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">
  <sub>Desenvolvido com ❤️ para uma vida mais saudável</sub>
</div>
