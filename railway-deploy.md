# 🚂 Railway Deploy Instructions

## 🎯 CONFIGURAÇÃO PARA RAILWAY:

### 1. Deploy Settings:
- **Service Name:** healthy-life-backend
- **Repository:** Junior-81/-healthy_life
- **Root Directory:** backend
- **Start Command:** npm start

### 2. Environment Variables:
```
JWT_SECRET=seu_jwt_secret_muito_secreto_123456
NODE_ENV=production
```

### 3. PostgreSQL:
- Add PostgreSQL service in the same project
- Railway will auto-connect DATABASE_URL

### 4. Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://[your-railway-backend].up.railway.app
```

## ✅ CHECKLIST:
- [ ] Railway account created
- [ ] Backend deployed
- [ ] PostgreSQL added
- [ ] Environment variables set
- [ ] Frontend deployed on Vercel

## 🔗 HELPFUL LINKS:
- Railway: https://railway.app
- Vercel: https://vercel.com
