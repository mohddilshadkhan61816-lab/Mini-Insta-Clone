# Quick Setup Guide

## Step 1: Backend Setup

1. Open a terminal and navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` folder (copy from `env.example`):
```
Or manually create `.env` with:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000` and the database will be automatically created.

## Step 2: Frontend Setup

1. Open a **new terminal** (keep the backend running) and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

## Step 3: Use the Application

ENJOY!!!