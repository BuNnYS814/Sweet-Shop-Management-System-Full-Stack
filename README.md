# Sweet Shop - Fullstack Application

A fullstack e-commerce application for a sweet shop built with FastAPI (backend) and React + Vite (frontend).

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL/SQLite** - Database (PostgreSQL for production, SQLite for local dev)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── routes.py      # Authentication endpoints
│   │   │   └── utils.py        # Auth utilities (hashing, JWT)
│   │   ├── database.py         # Database configuration
│   │   ├── main.py             # FastAPI app entry point
│   │   └── models.py           # SQLAlchemy models
│   ├── requirements.txt        # Python dependencies
│   ├── Procfile               # Railway deployment config
│   ├── railway.json           # Railway config
│   └── render.yaml            # Render deployment config
├── frontend/
│   ├── src/
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── vercel.json           # Vercel deployment config
│   └── netlify.toml          # Netlify deployment config
└── DEPLOYMENT.md             # Detailed deployment guide

```

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the dev server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy Options:**
- **Backend**: Railway or Render
- **Frontend**: Vercel or Netlify

## Environment Variables

### Backend
- `DATABASE_URL` - Database connection string (auto-set by Railway/Render)
- `SECRET_KEY` - JWT secret key (generate with `openssl rand -hex 32`)

### Frontend
- `VITE_API_URL` - Backend API URL (e.g., `https://your-backend.railway.app`)

## License

MIT

