# Mini User Management System

A full-stack web application for managing user accounts with role-based access control, built with **Node.js/Express**, **React**, and **MongoDB**.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Project Overview

This application provides comprehensive user management capabilities including:
- **User Authentication** - Secure signup/login with JWT tokens
- **Role-Based Access Control** - Admin and User roles with different permissions
- **User Lifecycle Management** - Activate/deactivate user accounts
- **Profile Management** - Update profile information and change passwords

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Signup** | Email validation, password strength check, full name |
| **Login** | JWT token generation, last login tracking |
| **Admin Dashboard** | User table with pagination (10/page) |
| **User Management** | Activate/deactivate with confirmation modals |
| **Profile Page** | Edit name, email, change password |
| **Role-Based Routing** | Admin-only and user-only pages |
| **Responsive Design** | Works on desktop and mobile |
| **Premium UI** | Dark glassmorphism theme with animations |

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **Frontend** | React (Vite) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcrypt.js |
| **Styling** | CSS3 with Glassmorphism |

---

## 📁 Project Structure

```
User_Management/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── userController.js  # User management logic
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── roleCheck.js       # Role-based access
│   ├── models/
│   │   └── User.js            # User schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── users.js           # User routes
│   ├── validators/
│   │   └── authValidator.js   # Input validation
│   ├── tests/
│   │   └── auth.test.js       # Unit tests
│   ├── .env                   # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth context
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── App.jsx
│   │   └── index.css          # Global styles
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/user-management.git
cd user-management
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret
```

**Environment Variables (.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/user_management
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

```bash
# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### User Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users (paginated) | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PATCH | `/api/users/:id/activate` | Activate user | Admin |
| PATCH | `/api/users/:id/deactivate` | Deactivate user | Admin |
| GET | `/api/users/profile` | Get own profile | Private |
| PUT | `/api/users/profile` | Update profile | Private |
| PUT | `/api/users/password` | Change password | Private |

### Example API Requests

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Get All Users (Admin):**
```bash
curl http://localhost:5000/api/users?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

The test suite includes:
1. Signup validation (email format, password strength)
2. Login credentials verification
3. JWT token generation and verification
4. Protected route access without token
5. Admin role-based access control

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT authentication with configurable expiration
- ✅ Protected routes with middleware
- ✅ Role-based access control (RBAC)
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ Environment variables for secrets

---

## 🎁 Bonus Features

### 🧪 Unit & Integration Tests
```bash
cd backend
npm test
```
- 15 test cases covering authentication, authorization, and validation
- Jest with coverage reporting

### 🐳 Docker Setup
Run the entire application with Docker Compose:
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down
```

**Services included:**
- `backend` - Node.js API on port 5000
- `frontend` - Nginx serving React on port 3000
- `redis` - Optional caching on port 6379

### 🔄 CI/CD Pipeline (GitHub Actions)
Automated pipeline triggers on push/PR to main branch:

| Job | Description |
|-----|-------------|
| `backend-test` | Runs Jest tests with coverage |
| `frontend-test` | Builds React app |
| `docker-build` | Validates Docker images |
| `security-scan` | npm audit for vulnerabilities |

### 💾 Redis Caching (Optional)
To enable API response caching:
```bash
# Add to backend/.env
REDIS_URL=redis://localhost:6379
```
The app works without Redis - caching is gracefully disabled if unavailable.

---

## 👤 Creating an Admin User

### Option 1: Using the Script (Recommended)
```bash
cd backend
node scripts/createAdmin.js
```

This creates an admin user with:
- **Email**: `admin@userhub.com`
- **Password**: `Admin@123!`

### Option 2: Manual Database Update
Connect to your MongoDB database and run:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 🌐 Live Deployment Links

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | [user-management-system-sigma-jade.vercel.app](https://user-management-system-sigma-jade.vercel.app) | ✅ Live |
| **Backend API** | [user-management-backend-y2h0.onrender.com](https://user-management-backend-y2h0.onrender.com) | ✅ Live |
| **Database** | MongoDB Atlas (Cloud) | ✅ Connected |

### 🔐 Test Credentials

**Admin Account:**
- Email: `admin@userhub.com`
- Password: `Admin@123!`

> **Note**: Create your own admin account using the script: `node backend/scripts/createAdmin.js`

---

## 🚢 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set `VITE_API_URL` environment variable
4. Deploy

### Database (MongoDB Atlas)
- Already cloud-hosted with MongoDB Atlas
- Ensure IP whitelist includes deployment IPs

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 👨‍💻 Author

Built as part of a Backend Developer Intern Assessment.

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Vite](https://vitejs.dev/)
