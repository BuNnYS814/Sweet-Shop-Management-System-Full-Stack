# Deployment Guide

This guide will help you deploy the Sweet Shop fullstack application.

## Architecture

- **Backend**: FastAPI (Python) - Deploy to Railway or Render
- **Frontend**: React + Vite - Deploy to Vercel or Netlify

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the Python project
   - Set the root directory to `backend`

3. **Configure Environment Variables**
   - Go to your service → Variables
   - Add:
     - `SECRET_KEY`: Generate a random secret key (e.g., use `openssl rand -hex 32`)
     - `DATABASE_URL`: Railway will auto-create a PostgreSQL database and provide this

4. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

5. **Deploy**
   - Railway will automatically deploy on push to main branch
   - Your API will be available at: `https://your-app-name.railway.app`

### Option 2: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `sweet-shop-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Render will automatically set `DATABASE_URL` in your web service

4. **Configure Environment Variables**
   - Go to Environment tab
   - Add:
     - `SECRET_KEY`: Generate a random secret key

5. **Deploy**
   - Render will automatically deploy on push to main branch
   - Your API will be available at: `https://your-app-name.onrender.com`

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Configure Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)

4. **Update vercel.json**
   - Edit `frontend/vercel.json`
   - Replace `https://your-backend-url.railway.app` with your actual backend URL

5. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Your frontend will be available at: `https://your-app-name.vercel.app`

### Option 2: Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_API_URL`: Your backend URL

4. **Update netlify.toml**
   - Edit `frontend/netlify.toml`
   - Replace `https://your-backend-url.railway.app` with your actual backend URL

5. **Deploy**
   - Netlify will automatically deploy on push to main branch
   - Your frontend will be available at: `https://your-app-name.netlify.app`

## Important Notes

### CORS Configuration

After deploying, update the CORS settings in `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.vercel.app"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Migration

The app will automatically create tables on first run. For production, consider using Alembic for proper migrations.

### Security

- **Never commit** `.env` files or secrets
- Use strong `SECRET_KEY` values in production
- Consider restricting CORS origins to your frontend domain only

## Quick Start Commands

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Backend Issues
- Ensure `DATABASE_URL` is set correctly
- Check that `SECRET_KEY` is set
- Verify port is set to `$PORT` (for cloud platforms)

### Frontend Issues
- Ensure `VITE_API_URL` points to your deployed backend
- Check that CORS is configured correctly on backend
- Verify build completes successfully

## Support

For issues, check:
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)

