# STEM October Forum - Deployment Guide

## 🚀 Vercel Deployment

This project consists of two parts that need to be deployed separately:
1. **Backend API** (Express.js + MongoDB)
2. **Frontend** (React.js)

### Prerequisites

1. [Vercel CLI](https://vercel.com/cli) installed globally:
   ```bash
   npm install -g vercel
   ```

2. MongoDB database (local or MongoDB Atlas)

3. Two separate Vercel projects (one for backend, one for frontend)

### Backend Deployment

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Set up environment variables in Vercel:**
   ```bash
   vercel env add MONGODB_URI
   ```
   Enter your MongoDB connection string (e.g., MongoDB Atlas URI)

   ```bash
   vercel env add NODE_ENV
   ```
   Enter: `production`

3. **Deploy backend:**
   ```bash
   vercel --prod
   ```

4. **Note the deployed backend URL** (e.g., `https://your-backend-url.vercel.app`)

### Frontend Deployment

1. **Navigate back to root directory:**
   ```bash
   cd ..
   ```

2. **Update vercel.json with your backend URL:**
   Replace `https://your-backend-url.vercel.app` in `vercel.json` with your actual backend URL

3. **Set up environment variables:**
   ```bash
   vercel env add REACT_APP_API_URL
   ```
   Enter your backend URL: `https://your-backend-url.vercel.app`

4. **Deploy frontend:**
   ```bash
   npm run build
   vercel --prod
   ```

### Environment Variables Setup

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stem-forum
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

### Quick Deployment Commands

After initial setup, you can use these commands:

```bash
# Deploy both frontend and backend
npm run deploy

# Deploy only backend
npm run deploy:backend

# Deploy only frontend  
npm run deploy:frontend
```

### Troubleshooting

1. **CORS Issues:** Make sure your frontend URL is added to the backend's CORS configuration
2. **Database Connection:** Ensure your MongoDB URI is correct and the database is accessible
3. **API Routes:** Verify that API calls in the frontend point to the correct backend URL
4. **Build Errors:** Check that all dependencies are installed and versions are compatible

### MongoDB Atlas Setup (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Set up database access (username/password)
4. Configure network access (allow all IPs: 0.0.0.0/0 for Vercel)
5. Get your connection string and use it as MONGODB_URI

### Local Development

For local development:

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Start both frontend and backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
