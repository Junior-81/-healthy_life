# Instruções para corrigir erro no Render

## 🚨 ERRO: Service Root Directory "/opt/render/project/src/backend" is missing

### ✅ SOLUÇÃO FINAL (problema do postinstall corrigido):

**No painel do Render, configure exatamente assim:**

1. **Repository**: Seu repositório GitHub
2. **Root Directory**: (deixar completamente vazio)
3. **Build Command**: `npm install --prefix backend && npx prisma generate --schema=prisma/schema.prisma`
4. **Start Command**: `cd backend && npm start`
5. **Environment**: Node.js

### ALTERNATIVA MAIS SIMPLES (agora que removemos o postinstall):

1. **Root Directory**: `backend` 
2. **Build Command**: `npm install && npx prisma generate --schema=../prisma/schema.prisma`
3. **Start Command**: `npm start`

### Variáveis de Ambiente (OBRIGATÓRIAS):
```
DATABASE_URL=postgresql://bd_healthy_life_user:xqE0W1xc7nRQR7nqgube2aIorFRM2Ilj@dpg-d1jikcili9vc738a7o30-a.ohio-postgres.render.com/bd_healthy_life
JWT_SECRET=seu_jwt_secret_muito_secreto_aqui_123456
PORT=3001
NODE_ENV=production
```

### 🔧 Checklist ATUALIZADO:
- [ ] Root Directory: deixar vazio OU `backend` (testar ambos)
- [ ] Build Command: usar comandos corrigidos acima
- [ ] Start Command: `cd backend && npm start`
- [ ] Todas as variáveis de ambiente adicionadas
- [ ] Repositório atualizado no GitHub

### 🚨 PROBLEMA RESOLVIDO:
O erro `ENOENT: no such file or directory, copyfile` estava acontecendo porque o script `postinstall` no backend/package.json estava executando o Prisma generate duas vezes, causando conflito.

**✅ CORREÇÃO APLICADA:**
- Removido o script `postinstall` do backend/package.json
- Agora o Prisma generate executa apenas uma vez no build command

**CONFIGURAÇÃO RECOMENDADA ATUALIZADA:**
- Root Directory: (vazio)
- Build Command: `npm install --prefix backend && npx prisma generate --schema=prisma/schema.prisma`
- Start Command: `cd backend && npm start`

### Se ainda der erro:
1. Tente deletar o serviço e criar novo
2. Verifique se o commit está no GitHub
3. Teste os comandos localmente primeiro
