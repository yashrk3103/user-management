# Quick Commands Reference

## ⚡ Start Everything (Quick Setup)

### Terminal 1: Start Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

### Terminal 2: Start Frontend (after backend is running)
```bash
cd frontend
npm install
npm run dev
```

Then open: **http://localhost:5173**

---

## 🎯 Backend Commands (Run in `backend/` folder)

### Setup
```bash
# Install dependencies
npm install

# Generate strong JWT secret (copy the output)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env with the generated secret
# Then seed demo users
npm run seed
```

### Running
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Database
```bash
# Seed demo users (admin, manager, user, inactive)
npm run seed

# Clear and reseed (if needed)
# Delete from MongoDB Atlas directly, then: npm run seed
```

### Testing API

**Login (Admin)**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Health Check**
```bash
curl http://localhost:5000/health
```

**Get Users (use token from login)**
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create User (admin only)**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name":"New User",
    "email":"new@example.com",
    "password":"pass123",
    "role":"user",
    "status":"active"
  }'
```

---

## 🎯 Frontend Commands (Run in `frontend/` folder)

### Setup
```bash
# Install dependencies
npm install

# Verify environment (should show packages)
npm list react react-router-dom axios
```

### Running
```bash
# Development mode (best for testing)
# Opens http://localhost:5173 in browser
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Browser Console Testing
```javascript
// Check if logged in
console.log(localStorage.getItem('token')); // Should show JWT

// Check user data
console.log(JSON.parse(localStorage.getItem('user')));

// Clear all storage (for testing)
localStorage.clear();
```

---

## 📋 Quick Test Scenarios

### Scenario 1: Full Admin Flow
**Backend:**
```bash
cd backend && npm run dev
```

**Frontend (new terminal):**
```bash
cd frontend && npm run dev
```

**Test:**
1. Open http://localhost:5173
2. Login: `admin@example.com` / `admin123`
3. Click "Users"
4. Click "Create User"
5. Create: name=Test, email=test@test.com, pass=test123
6. View users list
7. Click user details
8. Edit user
9. Go to profile and update name

---

### Scenario 2: Manager Restrictions
**Login as:**
```
Email: manager@example.com
Password: manager123
```

**Expected:**
- Can view users
- Cannot create users
- Can edit non-admin users
- Cannot edit admin users

---

### Scenario 3: User Self-Access Only
**Login as:**
```
Email: user@example.com
Password: user123
```

**Expected:**
- Only sees dashboard
- No users link
- Can only edit own profile
- Cannot view other users

---

### Scenario 4: Inactive User Lockout
**Try to login as:**
```
Email: inactive@example.com
Password: inactive123
```

**Expected:**
- Login fails
- Message: "Your account has been deactivated"

---

## 🐛 Troubleshooting Commands

### Port Already in Use
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Check what's using port 5173
netstat -ano | findstr :5173

# Kill process by PID (on Windows)
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
# Remove node_modules and package-lock.json
rm -r node_modules package-lock.json
# or Windows:
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install
```

### MongoDB Connection Issue
```bash
# Test MongoDB connection by checking logs
# If using MongoDB Atlas, verify:
# 1. Connection string has correct username:password
# 2. IP whitelist includes your IP
# 3. Database user has readWriteAnyDatabase role
```

### Clear Browser Storage
```javascript
// In browser console (F12):
localStorage.clear();
sessionStorage.clear();
// Then refresh page (Ctrl+R or F5)
```

---

## 📊 Demo Credentials

After running `npm run seed`:

```
Admin:
  Email: admin@example.com
  Password: admin123
  Role: admin

Manager:
  Email: manager@example.com
  Password: manager123
  Role: manager

User:
  Email: user@example.com
  Password: user123
  Role: user

Inactive (cannot login):
  Email: inactive@example.com
  Password: inactive123
  Status: inactive
```

---

## 🔗 Important URLs

```
Login:          http://localhost:5173/login
Dashboard:      http://localhost:5173/
Users:          http://localhost:5173/users
Create User:    http://localhost:5173/users/create
User Detail:    http://localhost:5173/users/[id]
Edit User:      http://localhost:5173/users/[id]/edit
Profile:        http://localhost:5173/profile

Backend API:    http://localhost:5000
API Base:       http://localhost:5000/api
Health:         http://localhost:5000/health
```

---

## 📦 Dependencies Check

### Backend (should be installed after `npm install`)
```bash
npm list express mongoose jsonwebtoken bcrypt dotenv cors express-validator
```

### Frontend (should be installed after `npm install`)
```bash
npm list react react-router-dom axios
```

---

## 🚀 Push to GitHub
```bash
git add .
git commit -m "your message here"
git push origin main
```

---

## 📝 Environment Files

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-random-secret-here
JWT_EXPIRE=7d
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ✅ Final Checklist Before Demo Recording

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can login with all 3 demo users
- [ ] Admin can view/create/edit users
- [ ] Manager cannot create users
- [ ] User cannot access /users
- [ ] Inactive user cannot login
- [ ] User detail shows audit info
- [ ] Profile update works
- [ ] Logout works
- [ ] Mobile responsive works
- [ ] No console errors (F12)

---

## 🎥 Recording Demo Video Tips

1. Open 2 windows: Frontend and Backend logs
2. Show login with different roles
3. Show user list with filters
4. Create a new user
5. View user details (highlight audit info)
6. Edit user and show update
7. Show manager's limited view
8. Show user profile
9. Show responsive design on mobile
10. Show logout

Total: 2-3 minutes
File format: MP4 or WebM
Upload to: Google Drive or YouTube (unlisted)

