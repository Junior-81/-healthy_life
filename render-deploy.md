# Instruções para corrigir erro no Render

## 🚨 ERRO: Service Root Directory "/opt/render/project/src/backend" is missing

### SOLUÇÃO MAIS SIMPLES:

**No painel do Render, configure exatamente assim:**

1. **Repository**: Seu repositório GitHub
2. **Root Directory**: `backend` 
3. **Build Command**: `npm install && npx prisma generate --schema=../prisma/schema.prisma`
4. **Start Command**: `npm start`
5. **Environment**: Node.js

### ALTERNATIVA se a primeira não funcionar:

1. **Root Directory**: (deixar completamente vazio)
2. **Build Command**: `npm install && cd backend && npm install && npx prisma generate --schema=../prisma/schema.prisma`
3. **Start Command**: `cd backend && npm start`

### Variáveis de Ambiente (OBRIGATÓRIAS):
```
DATABASE_URL=postgresql://bd_healthy_life_user:xqE0W1xc7nRQR7nqgube2aIorFRM2Ilj@dpg-d1jikcili9vc738a7o30-a.ohio-postgres.render.com/bd_healthy_life
JWT_SECRET=seu_jwt_secret_muito_secreto_aqui_123456
PORT=3001
NODE_ENV=production
```

### 🔧 Checklist:
- [ ] Root Directory configurado como `backend`
- [ ] Build Command correto
- [ ] Start Command correto  
- [ ] Todas as variáveis de ambiente adicionadas
- [ ] Repositório atualizado no GitHub

### Se ainda der erro:
1. Tente deletar o serviço e criar novo
2. Verifique se o commit está no GitHub
3. Teste os comandos localmente primeiro
