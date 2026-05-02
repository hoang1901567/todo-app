# TODO App - Deployment Guide

## Deploy Frontend (Vercel)

1. **Đẩy code lên GitHub**
   ```bash
   git add .
   git commit -m "Deploy: Setup frontend for production"
   git push origin main
   ```

2. **Login vào [Vercel](https://vercel.com)**
   - Click "New Project"
   - Select GitHub repo này
   - Framework: React (auto-detect)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Không cần (API URL hard-code trong frontend/.env.local)
   - Deploy! ✅

3. **Sau khi deploy, update API URL:**
   - Trong `frontend/.env.local`: 
   ```
   VITE_API_URL=https://your-backend-on-render.onrender.com
   ```

## Deploy Backend (Render)

1. **Update package.json backend**
   - Backend cần có `"start"` script
   - Engine specification cho Node.js

2. **Tạo PostgreSQL database trên Render**
   - New → PostgreSQL
   - Free tier available
   - Copy connection string

3. **Create Web Service trên Render**
   - Connect GitHub repo
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add Environment Variables:
     ```
     DATABASE_URL=<PostgreSQL connection string>
     NODE_ENV=production
     PORT=10000
     ```
   - Deploy! ✅

## Environment Files

**Frontend (.env.local):**
```
VITE_API_URL=https://your-backend-url.onrender.com
```

**Backend (.env):**
```
DATABASE_URL=postgresql://user:password@host:port/dbname
PORT=10000
NODE_ENV=production
```

## Local Testing Before Deploy

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit: http://localhost:5175
