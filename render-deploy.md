# Instruções para corrigir erro no Render

## 🚨 ERRO: Script postinstall na raiz tentando executar Prisma

### ✅ NOVA CORREÇÃO APLICADA:

**PROBLEMA ENCONTRADO:** O `package.json` da raiz tinha um script `postinstall` tentando executar `npx prisma generate`, mas o Prisma só está instalado na pasta `backend`.

**CORREÇÃO:** Removido o script `postinstall` do `package.json` da raiz.

### CONFIGURAÇÃO FINAL CORRIGIDA:

1. **Repository**: Seu repositório GitHub
2. **Root Directory**: `backend` (⚠️ SEM ESPAÇO NO FINAL!)
3. **Build Command**: `npm install && npx prisma generate --schema=../prisma/schema.prisma`
4. **Start Command**: `npm start`
5. **Environment**: Node.js

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

### 🚨 PROBLEMA ATUAL RESOLVIDO:
O erro `sh: 1: prisma: not found` no script `postinstall` acontecia porque o `package.json` da raiz tentava executar `npx prisma generate`, mas o Prisma só está instalado na pasta `backend`.

**✅ CORREÇÃO APLICADA:**
- Removido o script `postinstall` do `package.json` da raiz
- Agora o Prisma generate só executa uma vez, no lugar correto
- Commit enviado para o GitHub

**CONFIGURAÇÃO TESTADA E CORRIGIDA:**
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate --schema=../prisma/schema.prisma`
- Start Command: `npm start`

**🚀 AGORA DEVE FUNCIONAR! Faça o redeploy no Render.**

### Se ainda der erro:
1. Tente deletar o serviço e criar novo
2. Verifique se o commit está no GitHub
3. Teste os comandos localmente primeiro
