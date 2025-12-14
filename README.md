# Sweet Shop - Fullstack Application

A modern, production-ready fullstack e-commerce application for a sweet shop built with FastAPI (backend) and React + Vite (frontend).

## 🌐 Live Demo

- **Frontend (Netlify)**: [https://sweet-shop-managementsystem.netlify.app/](https://sweet-shop-managementsystem.netlify.app/)
- **Backend API (Render)**: [https://sweet-shop-management-system-full-stack.onrender.com](https://sweet-shop-management-system-full-stack.onrender.com)
- **API Documentation**: [https://sweet-shop-management-system-full-stack.onrender.com/docs](https://sweet-shop-management-system-full-stack.onrender.com/docs)

### Demo Credentials

- **Admin Account**: 
  - Email: `admin@sweetshop.com`
  - Password: `admin123`
- **Regular User**: Register a new account to test customer features

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based login/registration
- 🛒 **Shopping Dashboard** - Browse and purchase sweets
- 👨‍💼 **Admin Panel** - Full CRUD operations for inventory management
- 📦 **Real-time Inventory** - Quantity updates on purchase
- 💾 **Token Persistence** - Stay logged in across sessions
- 🎨 **Modern UI** - Professional, responsive design with smooth animations
- 🔒 **Secure** - Password hashing, JWT tokens, and secure API endpoints

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Production database (SQLite for local dev)
- **JWT** - Authentication tokens
- **Bcrypt** - Secure password hashing
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **Modern CSS** - Professional styling with gradients and animations

## 📁 Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── routes.py      # Authentication endpoints
│   │   │   └── utils.py        # Auth utilities (hashing, JWT)
│   │   ├── sweets/
│   │   │   └── routes.py       # Sweets CRUD endpoints
│   │   ├── database.py         # Database configuration
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── models.py           # SQLAlchemy models
│   │   └── init_db.py          # Database initialization
│   ├── requirements.txt        # Python dependencies
│   ├── Procfile               # Railway deployment config
│   ├── railway.json           # Railway config
│   └── runtime.txt            # Python version
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── Dashboard.jsx       # Customer dashboard
│   │   ├── AdminPanel.jsx      # Admin management panel
│   │   ├── api.js              # API client
│   │   ├── ErrorBoundary.jsx   # Error handling
│   │   └── main.jsx            # React entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── vercel.json            # Vercel deployment config
│   └── netlify.toml           # Netlify deployment config
├── render.yaml                # Render deployment config
├── DEPLOYMENT.md              # Detailed deployment guide
└── README.md                  # This file
```

## 🚀 Local Development

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

3. Create `.env` file (optional, for local development):
```env
VITE_API_URL=http://localhost:8000
```

4. Run the dev server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token

### Sweets (Public)
- `GET /api/sweets` - Get all available sweets

### Sweets (Authenticated)
- `POST /api/sweets/{id}/purchase` - Purchase a sweet (decreases quantity)

### Sweets (Admin Only)
- `POST /api/sweets` - Create a new sweet
- `PUT /api/sweets/{id}` - Update a sweet
- `DELETE /api/sweets/{id}` - Delete a sweet

### Utility
- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation (Swagger UI)
- `POST /init-db` - Manually initialize database (for troubleshooting)

## 🌍 Deployment

### Production URLs
- **Frontend**: [https://sweet-shop-managementsystem.netlify.app/](https://sweet-shop-managementsystem.netlify.app/)
- **Backend**: [https://sweet-shop-management-system-full-stack.onrender.com](https://sweet-shop-management-system-full-stack.onrender.com)

### Deployment Platforms
- **Backend**: Deployed on [Render](https://render.com)
- **Frontend**: Deployed on [Netlify](https://netlify.com)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Environment Variables

### Backend
- `DATABASE_URL` - Database connection string (auto-set by Render)
- `SECRET_KEY` - JWT secret key (auto-generated by Render)

### Frontend
- `VITE_API_URL` - Backend API URL
  - Production: `https://sweet-shop-management-system-full-stack.onrender.com`
  - Local: `http://localhost:8000`

## 🎯 Features Overview

### Customer Features
- ✅ User registration and login
- ✅ Browse available sweets
- ✅ View product details (name, category, price, stock)
- ✅ Purchase sweets (decreases inventory)
- ✅ Persistent login session

### Admin Features
- ✅ Full inventory management
- ✅ Create new sweets
- ✅ Edit existing sweets
- ✅ Delete sweets
- ✅ View all products and stock levels

## 🔒 Security Features

- Password hashing with Bcrypt
- JWT token-based authentication
- Secure API endpoints with role-based access
- CORS configuration for frontend communication
- Input validation and error handling

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details

## 👨‍💻 Author

VENKATA SHIVA PRASAD PUNNA

## 🙏 Acknowledgments

- Built with FastAPI and React
- Deployed on Render and Netlify
- Uses PostgreSQL for production database

---

**Status**: ✅ Production Ready | **Last Updated**: December 2024
