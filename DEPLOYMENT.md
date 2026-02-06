# Deployment Guide

## 1. Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas.
2. Create a database user and allow network access (0.0.0.0/0).
3. Copy the connection string.

## 2. Backend (Render.com)
1. Connect your GitHub repository to Render.
2. Create a new **Web Service**.
3. Set Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI`: Your Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: production

## 3. Frontend (Vercel)
1. Connect your GitHub repository to Vercel.
2. Set Root Directory to `frontend`.
3. Vercel automatically detects React/CRA.
4. **Important:** Setup Proxy for API.
   Since Vercel serves static files, you need to point API requests to your Render backend.
   Create a `vercel.json` in `frontend/` root:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://your-render-backend-url.onrender.com/api/$1" }
     ]
   }
   ```
5. Deploy.
