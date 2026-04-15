# Backend Setup & Testing Checklist

## 🚀 Environment Setup

### Initial Configuration
- [ ] Copy `.env.example` to `.env` (already exists)
- [ ] Update `.env` with your MongoDB Atlas connection string
  ```bash
  # Get your MongoDB URI from https://cloud.mongodb.com/
  # Format: mongodb+srv://username:password@cluster.mongodb.net/database-name...
  ```
- [ ] Generate secure JWT_SECRET:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Update JWT_SECRET in `.env` with generated value
- [ ] Verify NODE_ENV is set to `development` for local testing

### When Ready for Production
- [ ] Change NODE_ENV to `production`
- [ ] Use strong, unique JWT_SECRET
- [ ] Update MONGODB_URI to production database

---

## 📦 Installation Commands

### Step 1: Install Dependencies
```bash
cd backend
npm install
```
✓ Verify: Check for any error messages. Should complete successfully.

---

## 🌱 Database Setup

### Step 1: Seed Demo Users
```bash
npm run seed
```

**Expected Output:**
```
Created ADMIN: admin@example.com (Password: admin123)
Created MANAGER: manager@example.com (Password: manager123)
Created USER: user@example.com (Password: user123)
Created INACTIVE: inactive@example.com (Password: inactive123)

Seed data inserted successfully!
```

✓ If you see errors, check:
- MongoDB connection string is correct
- MongoDB Atlas network access includes your IP
- Database user has correct permissions

---

## ✅ Server Testing Checklist

### Step 1: Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:5000
MongoDB Connected: cluster-name.mongodb.net
```

✓ Verify server is running on port 5000

### Step 2: Test Health Check
Open browser or use curl:
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{"success":true,"message":"Server is running"}
```

✓ Health check passes

---

## 🔐 API Testing Checklist (Use Postman, Insomnia, or curl)

### Test 1: Login with Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Expected:**
- Status: 200 OK
- Response includes: `token`, `user` object with role: "admin"
- Store token for next tests

✓ Login successful

### Test 2: Login with Invalid Password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"wrong"}'
```

**Expected:**
- Status: 401 Unauthorized
- Message: "Invalid email or password"

✓ Properly rejects invalid credentials

### Test 3: Get Own Profile (Auth Required)
Replace `YOUR_TOKEN` with token from Test 1:
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:**
- Status: 200 OK
- Returns user details without passwordHash

✓ Protected route works with token

### Test 4: Get Users List (Admin)
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:**
- Status: 200 OK
- Returns paginated list of users
- Includes pagination info

✓ User list accessible

### Test 5: Create User (Admin Only)
Replace `YOUR_TOKEN`:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"test123",
    "role":"user",
    "status":"active"
  }'
```

**Expected:**
- Status: 201 Created
- Returns created user object

✓ User creation works

### Test 6: Manager Login & Restrictions
1. Login as manager:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@example.com","password":"manager123"}'
```

2. Try to create user (should fail):
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MANAGER_TOKEN" \
  -d '{"name":"Should Fail","email":"fail@example.com","password":"pass123","role":"user"}'
```

**Expected:**
- Status: 403 Forbidden
- Message: "Insufficient permissions"

✓ Manager cannot create users (RBAC works)

### Test 7: Inactive User Cannot Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"inactive@example.com","password":"inactive123"}'
```

**Expected:**
- Status: 401 Unauthorized
- Message: "Your account has been deactivated"

✓ Inactive users blocked

### Test 8: Invalid Token Rejection
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected:**
- Status: 401 Unauthorized
- Message: "Invalid or expired token"

✓ Token validation works

### Test 9: Missing Token Rejection
```bash
curl -X GET http://localhost:5000/api/users/profile
```

**Expected:**
- Status: 401 Unauthorized
- Message: "No token provided"

✓ Authentication required

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# If port is taken, either:
# 1. Kill the process
taskkill /PID <PID> /F

# 2. Change port in .env
# PORT=5001
```

### MongoDB connection fails
```bash
# Check connection string format
# mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority

# Verify in MongoDB Atlas:
# 1. Check username and password
# 2. Check IP whitelist (add 0.0.0.0/0 for development)
# 3. Click "Connect" and copy full connection string
```

### Seeding fails
```bash
# Clear existing data and reseed
npm run seed
# If still fails, check MongoDB permissions
```

---

## ✨ Final Backend Verification

- [ ] Server starts without errors
- [ ] Health check returns success
- [ ] Admin can login
- [ ] Manager can login
- [ ] User can login
- [ ] Inactive user cannot login
- [ ] Invalid credentials rejected
- [ ] Protected routes require token
- [ ] RBAC enforced (manager can't create users)
- [ ] Users list returns paginated data
- [ ] New users can be created
- [ ] Token validation works

---

## 📝 Notes

- Backend runs on `http://localhost:5000`
- API base: `http://localhost:5000/api`
- Keep this server running while testing frontend
- Don't commit `.env` file (it's in .gitignore)
- For production, use strong JWT_SECRET and production MongoDB

