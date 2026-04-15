# Frontend Setup & Testing Checklist

## 🚀 Environment Setup

### Initial Configuration
- [ ] Verify `.env` file exists in `frontend/` directory
- [ ] Check `.env` contains:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```
- [ ] This points to your backend server
- [ ] No changes needed if backend runs on localhost:5000

### When Backend Deployed to Production
- [ ] Update `.env` with production API URL:
  ```env
  VITE_API_BASE_URL=https://your-backend-url.com/api
  ```

---

## 📦 Installation Commands

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```
✓ Verify: Check for any error messages. Should complete successfully.

### Step 2: Verify Node Modules
```bash
npm list react react-router-dom axios
```
✓ Should show: react, react-router-dom, axios installed

---

## 🏃 Development Server Commands

### Start Dev Server (Option 1 - Recommended for Development)
```bash
npm run dev
```

**Expected Output:**
```
VITE v8.0.4  ready in 234 ms

➜  Local:   http://localhost:5173/
```

✓ App runs on `http://localhost:5173`
✓ Opens with hot-reload (auto-refresh on file changes)

### Build for Production
```bash
npm run build
```

**Expected Output:**
```
vite v8.0.4 building for production...
✓ 42 modules transformed.
dist/index.html                    0.49 kB
dist/assets/index-xxx.js           xx.xx kB │ gzip: xx.xx kB
```

✓ Creates optimized `dist/` folder

### Preview Production Build
```bash
npm run preview
```

**Expected:**
- Shows production build locally
- Useful to test before deploying

### Run Linter
```bash
npm run lint
```

✓ Checks for code style issues

---

## ✅ Manual Testing Checklist

### Prerequisites
- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Backend health check works: `curl http://localhost:5000/health`
- [ ] Demo users seeded in database (`npm run seed` in backend)
- [ ] Frontend running on `http://localhost:5173`

---

## 🔐 Login Page Testing

### Test 1: Login as Admin
**Steps:**
1. Navigate to `http://localhost:5173`
2. Should see login form
3. Enter:
   - Email: `admin@example.com`
   - Password: `admin123`
4. Click Login

**Expected:**
- [ ] No errors in browser console
- [ ] Redirects to dashboard
- [ ] See "Welcome, Admin User!" message
- [ ] Token saved in localStorage

**Verify in Browser:**
```javascript
// Open DevTools (F12) → Console and run:
console.log(localStorage.getItem('token')); // Should show JWT
console.log(localStorage.getItem('user'));  // Should show user object
```

### Test 2: Admin User Info Displayed
**Expected:**
- [ ] Navigation bar shows "Admin User"
- [ ] Role badge shows "admin" in red
- [ ] Menu shows "Users" link

### Test 3: Invalid Credentials
**Steps:**
1. Go back to login (click Logout)
2. Enter email: `admin@example.com`
3. Enter password: `wrongpassword`
4. Click Login

**Expected:**
- [ ] Error message displays
- [ ] NOT redirected to dashboard
- [ ] Stays on login page

### Test 4: Inactive User Cannot Login
**Steps:**
1. Go back to login
2. Enter email: `inactive@example.com`
3. Enter password: `inactive123`
4. Click Login

**Expected:**
- [ ] Error: "Your account has been deactivated"
- [ ] Access denied

---

## 📊 Dashboard Page Testing

### Test 1: Dashboard Loads
**Steps:**
1. After login as admin, should see dashboard
2. Should show "Welcome, Admin User!"
3. Should show role: "admin" badge

**Expected:**
- [ ] Personalized greeting
- [ ] 4 cards (User Management, My Profile, Create User, System Info)
- [ ] Permission overview section

### Test 2: Role-Based Permissions Display
**Expected:**
- [ ] Admin sees all permissions (Create users, Edit, Delete, etc.)
- [ ] Click "Create User" button

### Test 3: Quick Actions Work
**Steps:**
- [ ] Click "View Users" → Should go to user list
- [ ] Click "Edit Profile" → Should go to profile page
- [ ] Verify navigation works

---

## 👥 User List Page Testing

### Test 1: User List Loads
**Steps:**
1. Click "Users" in navigation
2. Should see table of users

**Expected:**
- [ ] Table displays with columns: Name, Email, Role, Status, Created, Actions
- [ ] Shows at least 3 demo users (admin, manager, user)
- [ ] Each row has "View", "Edit", "Deactivate" buttons

### Test 2: Pagination Works
**Expected:**
- [ ] Shows "Page 1 of 1" (or more if many users)
- [ ] Previous/Next buttons disabled when appropriate
- [ ] Pagination updates after creating new users

### Test 3: Search Functionality
**Steps:**
1. Type in search box: `manager`
2. Click search or wait for auto-filter

**Expected:**
- [ ] Filters to show only matching users
- [ ] Shows "manager@example.com"
- [ ] Other users hidden

### Test 4: Role Filter
**Steps:**
1. Select "manager" from role dropdown
2. Click/apply filter

**Expected:**
- [ ] Shows only users with manager role
- [ ] Table updates immediately

### Test 5: Status Filter
**Steps:**
1. Select "inactive" from status dropdown

**Expected:**
- [ ] Shows only inactive users
- [ ] Shows "Inactive User"

### Test 6: Combined Filters
**Steps:**
1. Search: `user`
2. Role: `user`
3. Status: `active`

**Expected:**
- [ ] Filters work together correctly
- [ ] Only shows matching results

---

## 📝 User Detail Page Testing

### Test 1: View User Details
**Steps:**
1. Go to Users list
2. Click "View" on any user
3. Should see user detail page

**Expected:**
- [ ] Shows: Name, Email, Role, Status (in badges)
- [ ] Shows created by: `System` or username
- [ ] Shows updated by: `System` or username
- [ ] Shows created and updated timestamps
- [ ] Has "Back to Users" link

### Test 2: Audit Information Displays
**Expected:**
- [ ] "Created At" shows timestamp
- [ ] "Created By" shows who created user
- [ ] "Updated At" shows timestamp
- [ ] "Updated By" shows who last updated user

### Test 3: Edit Button (Admin Only)
**Expected:**
- [ ] If logged in as admin, see "Edit User" button
- [ ] Can click to edit (except own account or admins)

---

## ✏️ Create User Page Testing (Admin Only)

### Test 1: Access Create User
**Steps:**
1. From dashboard, click "Create User"
2. Or go to Users → "Create User" button

**Expected:**
- [ ] See form with fields: Name, Email, Password, Role, Status
- [ ] All fields have labels
- [ ] Role dropdown shows: User, Manager, Admin
- [ ] Status dropdown shows: Active, Inactive

### Test 2: Create Valid User
**Steps:**
1. Fill form:
   - Name: `Test User 1`
   - Email: `test1@example.com`
   - Password: `test123456`
   - Role: `user`
   - Status: `active`
2. Click "Create User"

**Expected:**
- [ ] Success message or redirect to user list
- [ ] New user appears in list
- [ ] User is searchable

### Test 3: Create Manager User
**Steps:**
1. Create another user with Role: `manager`
2. Save successfully

**Expected:**
- [ ] New manager created
- [ ] Can login later to verify permissions

### Test 4: Validation Works
**Steps:**
1. Try to create user with invalid email: `notanemail`
2. Try empty name field
3. Try short password (< 6 chars)

**Expected:**
- [ ] Shows error messages
- [ ] Doesn't submit if validation fails

### Test 5: Duplicate Email Prevention
**Steps:**
1. Try to create user with existing email: `admin@example.com`

**Expected:**
- [ ] Error: "Email already in use"
- [ ] User not created

---

## ✏️ Edit User Page Testing (Admin Only)

### Test 1: Access Edit User
**Steps:**
1. Go to Users list
2. Click "Edit" on a non-admin user
3. Should see edit form pre-filled

**Expected:**
- [ ] Form shows current: Name, Email, Password, Role, Status
- [ ] All fields can be edited
- [ ] Cancel button returns to user detail

### Test 2: Edit User Name
**Steps:**
1. Change name to: `Updated Name`
2. Click "Save Changes"

**Expected:**
- [ ] User detail page shows updated name
- [ ] Timestamp updated
- [ ] Updated By shows current user

### Test 3: Edit User Role
**Steps:**
1. Change role from `user` to `manager`
2. Save

**Expected:**
- [ ] Role updates in list
- [ ] User detail shows new role
- [ ] Updated timestamp changes

### Test 4: Change Password
**Steps:**
1. In edit form, enter new password: `newpass123`
2. Save

**Expected:**
- [ ] Password updated (not returned in response for security)
- [ ] User can login with new password later

### Test 5: Cannot Edit Admin User
**Steps:**
1. Go to Users list
2. Find admin user
3. Try to click Edit

**Expected:**
- [ ] Edit button not visible for admin user
- [ ] Cannot modify admin accounts (protection)

---

## 🚫 Deactivate User Testing (Admin Only)

### Test 1: Deactivate User
**Steps:**
1. Go to Users list
2. Find an active user with "Deactivate" button (non-admin)
3. Click "Deactivate"
4. Confirm action

**Expected:**
- [ ] User list updates
- [ ] Status changes to "inactive"
- [ ] User badge shows gray "inactive" badge

### Test 2: Deactivated User Cannot Login
**Steps:**
1. Logout
2. Try to login with deactivated user email
3. Try password (correct password)

**Expected:**
- [ ] Login fails
- [ ] Error: "Your account has been deactivated"

---

## 👤 User Profile Page Testing

### Test 1: Access Own Profile
**Steps:**
1. Click "Profile" in navigation menu
2. Or click user name → Profile

**Expected:**
- [ ] Shows current user info
- [ ] Shows Email (read-only display)
- [ ] Shows Role badge
- [ ] Shows Status badge

### Test 2: Update Name
**Steps:**
1. Change name field
2. Click "Update Profile"

**Expected:**
- [ ] Success message displayed
- [ ] Name updates immediately
- [ ] Form remains on profile page

### Test 3: Change Password
**Steps:**
1. Enter new password: `newpass123`
2. Click "Update Profile"

**Expected:**
- [ ] Success message
- [ ] Password updated (logout and re-login to test)

### Test 4: Test New Password
**Steps:**
1. Logout
2. Try to login with new password

**Expected:**
- [ ] Login succeeds with new password
- [ ] Old password doesn't work

### Test 5: Cannot Change User Info
**Expected:**
- [ ] Cannot change own email (not in form)
- [ ] Cannot change own role (not in form)
- [ ] Can only change name and password

---

## 🔐 Role-Based Access Testing

### Test 1: Manager User Restrictions
**Steps:**
1. Logout and login as `manager@example.com` / `manager123`

**Expected:**
- [ ] See dashboard
- [ ] See "Users" link
- [ ] Can create users? NO - button shouldn't exist
- [ ] Can view users? YES

**Steps 2: Try to edit admin user**
1. Go to Users
2. Try to find admin user
3. Click "View" on admin

**Expected:**
- [ ] Can see details
- [ ] No "Edit User" button
- [ ] Cannot modify admin users

### Test 2: Regular User Restrictions
**Steps:**
1. Logout and login as `user@example.com` / `user123`

**Expected:**
- [ ] See dashboard with only "My Profile"
- [ ] NO "Users" link in navigation
- [ ] NO "Create User" link
- [ ] Can only access profile page

**Steps 2: Try to access /users directly**
1. Type in URL: `http://localhost:5173/users`

**Expected:**
- [ ] Access denied or redirected to dashboard
- [ ] Cannot view user list

---

## 🎨 Responsive Design Testing

### Test 1: Mobile View (375px width)
**Steps:**
1. Open DevTools (F12)
2. Set viewport to mobile (375px mobile)
3. Navigate through pages

**Expected:**
- [ ] All text readable
- [ ] Buttons clickable (not too small)
- [ ] Tables scroll horizontally if needed
- [ ] Navigation visible (not hidden)
- [ ] Forms stack vertically
- [ ] No horizontal scroll needed

### Test 2: Tablet View (768px width)
**Expected:**
- [ ] Layout adapts properly
- [ ] Good use of space
- [ ] Readable and usable

### Test 3: Desktop View (1920px width)
**Expected:**
- [ ] Tables display well
- [ ] No wasted space
- [ ] Professional appearance

---

## 🧪 Error Handling Testing

### Test 1: Network Error
**Steps:**
1. Stop backend server
2. Try to create a user or logout

**Expected:**
- [ ] Error message displays
- [ ] Not a browser error, but app-handled error
- [ ] Friendly message (not crash)

### Test 2: Invalid API Response
**Steps:**
1. Check browser console for errors
2. Network tab for failed requests

**Expected:**
- [ ] No unexpected errors
- [ ] Proper error messages shown

### Test 3: Session Timeout
**Steps:**
1. Logout (simulates token expiration)
2. Try to access protected page directly

**Expected:**
- [ ] Redirects to login
- [ ] Cannot access protected content

---

## 🌐 Browser Storage Testing

### Test 1: localStorage Persistence
**Steps:**
1. Login as admin
2. Close the browser tab (NOT quit browser)
3. Reopen same URL

**Expected:**
- [ ] Logged in automatically
- [ ] No need to re-login
- [ ] Token and user data retrieved from storage

### Test 2: Logout Clears Storage
**Steps:**
1. Click Logout
2. Check DevTools → Application → localStorage

**Expected:**
- [ ] `token` key is gone
- [ ] `user` key is gone
- [ ] Redirected to login

### Test 3: Manual localStorage Check
```javascript
// In DevTools Console:
console.log(JSON.parse(localStorage.getItem('user')));
// Should show: {name, email, role, status, _id, ...}

console.log(localStorage.getItem('token'));
// Should show: JWT token string (starts with eyJ...)
```

✓ User data and token properly stored

---

## 🚀 Final Frontend Verification

- [ ] Login page works for all roles
- [ ] Dashboard displays correctly for each role
- [ ] User list shows all users and pagination
- [ ] Search and filters work
- [ ] User detail with audit info displays
- [ ] Create user form works
- [ ] Edit user form works
- [ ] Profile page updates work
- [ ] Deactivate user works
- [ ] Role-based access control enforced
- [ ] Navigation shows/hides based on role
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] localStorage persists login
- [ ] Logout clears data
- [ ] Error messages are clear
- [ ] All buttons and links work

---

## 📝 Notes

- Frontend runs on `http://localhost:5173`
- Make sure backend is running on `http://localhost:5000`
- Check .env has correct API URL
- Don't commit `.env` (it's in .gitignore)
- Clear browser cache if seeing old pages (Ctrl+Shift+Delete)
- Check DevTools Console for errors (F12)

---

## Quick Reference URLs

```
Login: http://localhost:5173/login
Dashboard: http://localhost:5173/
Users: http://localhost:5173/users
User Detail: http://localhost:5173/users/:id
Edit User: http://localhost:5173/users/:id/edit
Create User: http://localhost:5173/users/create
Profile: http://localhost:5173/profile
```

