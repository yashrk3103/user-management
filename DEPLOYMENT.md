# Deployment Guide

This guide covers deploying both frontend and backend to production environments.

## Prerequisites

- Git repository set up (GitHub, GitLab, etc.)
- Backend deployment platform account (Render, Railway, Heroku alternative)
- Frontend hosting account (Vercel, Netlify)
- MongoDB Atlas account with cluster created
- Domain name (optional)

## Backend Deployment

### Option 1: Render.com

1. **Create Account & Connect Repository**
   - Sign up at https://render.com
   - Connect your GitHub repository

2. **Create Web Service**
   - New → Web Service
   - Select your repository
   - Name: `user-management-api`
   - Environment: Node
   - Build command: `npm install`
   - Start command: `npm start`

3. **Environment Variables**
   Set in dashboard under Environment:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<strong-random-secret>
   JWT_EXPIRE=7d
   ```

   Generate strong JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**
   - Push to main branch
   - Render will auto-deploy on push

5. **Get Backend URL**
   - Example: `https://user-management-api.onrender.com`

### Option 2: Railway.app

1. **Create Account**
   - Sign up at https://railway.app

2. **Connect Repository**
   - New Project → GitHub Repo
   - Select your repository

3. **Configure Service**
   - Add variables manually or link to your repo environment

4. **Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<strong-secret>
   ```

5. **Deploy**
   - Push to main branch
   - Railway auto-deploys

### Option 3: Heroku Alternative (deprecated, use Render/Railway)

**Note:** Heroku free tier is no longer available. Use Render or Railway instead.

## Frontend Deployment

### Option 1: Vercel

1. **Create Account**
   - Sign up at https://vercel.com
   - Import/connect GitHub

2. **Import Project**
   - New Project → Import Git Repository
   - Select your repository

3. **Configure**
   - Framework Preset: Vite
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

5. **Deploy**
   - Push to main branch
   - Vercel auto-deploys

6. **Get Frontend URL**
   - Example: `https://user-management.vercel.app`

### Option 2: Netlify

1. **Create Account**
   - Sign up at https://netlify.com

2. **Connect Repository**
   - New site from Git → Select repository

3. **Configure**
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: (leave empty)

4. **Environment Variables**
   Set in Site settings → Build & deploy → Environment:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

5. **Deploy**
   - Push to main branch
   - Netlify auto-deploys

### Option 3: GitHub Pages

Limited due to static hosting, but possible:

1. **Required Setup**
   - Free GitHub Pages domain or custom domain
   - Update vite.config.js for base path

2. **Deploy**
   ```bash
   npm run build
   git add dist
   git commit -m "build: production deployment"
   git push
   ```

3. **Configure**
   - Add dist to git (normally ignored)
   - Set GitHub Pages source to dist/ folder

## MongoDB Atlas Setup

### Create Cluster

1. **Sign up at MongoDB Atlas**
2. **Create Free Cluster**
3. **Configure**
   - Cloud Provider: AWS or GCP
   - Region: Closest to your users
   - Cluster Name: `user-management`

### Create Database User

1. **Database Access**
   - Add Database User
   - Username: `user_management_app`
   - Generate secure password
   - Built-in Role: readWriteAnyDatabase

### Allow Network Access

1. **Network Access**
   - Add IP Address
   - For development: 0.0.0.0/0 (allows all)
   - For production: Add specific IPs

### Get Connection String

1. **Clusters → Connect**
2. **Choose: Drivers (Node.js)**
3. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/user-management?retryWrites=true&w=majority
   ```

## DNS & Custom Domain (Optional)

### For Frontend (Vercel)

1. **Add Custom Domain** in Vercel
2. **Update DNS Records**
   - CNAME or Alias to vercel domain
   - Follow Vercel's DNS instructions

### For Backend (Render)

1. **Custom Domain** in Render dashboard
2. **Update DNS Records**
   - Add CNAME records as shown in Render

## Post-Deployment Checklist

- [ ] Backend health check: `GET /health`
- [ ] Frontend loads without errors
- [ ] Login works with demo credentials
- [ ] JWT tokens are being generated
- [ ] API calls reach backend successfully
- [ ] Token expiration and refresh logic works
- [ ] Role-based access control is enforced
- [ ] Database connectivity verified
- [ ] Environment variables securely set
- [ ] CORS allows frontend domain
- [ ] HTTPS enabled on all endpoints
- [ ] Error handling works (try invalid credentials)
- [ ] Create, read, update, delete operations work
- [ ] Pagination works on user list
- [ ] Filters and search work
- [ ] Audit information displays correctly

## Monitoring & Logs

### Backend Logs
- Render: Logs in dashboard
- Railway: View logs in dashboard
- Check for connection errors, auth failures

### Frontend Errors
- Browser console (F12)
- Vercel Analytics
- Netlify Analytics

## Updating Production

After making code changes:

1. **Commit and Push**
   ```bash
   git add .
   git commit -m "feature: description"
   git push origin main
   ```

2. **Verify Deployment**
   - Check deployment status in dashboard
   - Run smoke tests manually
   - Check logs for errors

3. **Rollback if Needed**
   - Revert commit
   - Push again (auto-deploy)

## Performance Optimization

### Frontend
- Minimize bundle size
- Enable compression
- Cache static assets
- Use CDN (automatic with Vercel/Netlify)

### Backend
- Enable database connection pooling
- Add request caching headers
- Monitor slow queries
- Optimize database indexes

## Security in Production

1. **Secrets Management**
   - Use platform's environment variables
   - Never commit .env files
   - Rotate JWT_SECRET periodically

2. **HTTPS**
   - Enabled by default on modern platforms
   - Redirect HTTP to HTTPS

3. **CORS Configuration**
   - Update CORS origin from localhost to production domain
   - Example: `http://localhost:3000` → `https://yourdomain.com`

4. **Rate Limiting**
   - Consider adding rate limiting middleware
   - Protect against brute force attacks

5. **Database Security**
   - Create separate DB users for different apps
   - Enable authentication
   - Regular backups enabled

## Troubleshooting Deployment

### Backend won't start
- Check environment variables
- Verify MongoDB connection string
- Check Node.js version compatibility
- Review logs for errors

### Frontend won't connect to API
- Verify API base URL in .env
- Check CORS settings on backend
- Verify backend is running and accessible
- Check network tab for failed requests

### Database connection issues
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions
- Test connection locally first

### Slow performance
- Check database query performance
- Enable caching where possible
- Optimize frontend bundle size
- Consider database indexing

## Maintenance

- Monthly: Review logs for errors
- Quarterly: Update dependencies
- Quarterly: Security audits
- Monthly: Database backups verification
- Continuously: Monitor error rates

## Scaling Considerations

As traffic grows:
- Add database indexes for slow queries
- Implement caching (Redis)
- Use CDN for static assets
- Consider load balancing
- Implement database replication
