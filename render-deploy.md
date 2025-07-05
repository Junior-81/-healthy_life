# Instruções para corrigir erro no Render

## 🚨 ERRO: Prisma copyfile error no ambiente Render

### ✅ SOLUÇÃO PARA O ERRO DE COPYFILE:

**PROBLEMA:** O Prisma está tendo problemas para copiar o query engine no ambiente do Render.

**SOLUÇÃO:** Usar uma abordagem mais robusta com cache clearing e retry.

### CONFIGURAÇÃO CORRIGIDA PARA O RENDER:

1. **Repository**: Seu repositório GitHub
2. **Root Directory**: `backend` 
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Environment**: Node.js

### Variáveis de Ambiente (OBRIGATÓRIAS + NOVAS):
```
DATABASE_URL=postgresql://bd_healthy_life_user:xqE0W1xc7nRQR7nqgube2aIorFRM2Ilj@dpg-d1jikcili9vc738a7o30-a.ohio-postgres.render.com/bd_healthy_life
JWT_SECRET=seu_jwt_secret_muito_secreto_aqui_123456
PORT=3001
NODE_ENV=production
PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

### 🔧 Checklist ATUALIZADO:
- [ ] Root Directory: deixar vazio OU `backend` (testar ambos)
- [ ] Build Command: usar comandos corrigidos acima
- [ ] Start Command: `cd backend && npm start`
- [ ] Todas as variáveis de ambiente adicionadas
- [ ] Repositório atualizado no GitHub

### 🚨 PROBLEMA ATUAL: Prisma copyfile error

O erro `ENOENT: no such file or directory, copyfile` é um problema conhecido do Prisma em ambientes de deploy específicos.

**✅ SOLUÇÕES APLICADAS:**
1. Atualizado script de build para ser mais robusto (com retry e limpeza de cache)
2. Adicionadas variáveis de ambiente específicas do Prisma
3. Mudança para usar `npm run build` em vez de comando direto

**CONFIGURAÇÃO FINAL MAIS ROBUSTA:**
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Novas variáveis de ambiente: `PRISMA_CLI_BINARY_TARGETS` e `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING`

**🚀 TESTE ESTA NOVA CONFIGURAÇÃO NO RENDER!**

### Se ainda der erro:
1. Tente deletar o serviço e criar novo
2. Verifique se o commit está no GitHub
3. Teste os comandos localmente primeiro
