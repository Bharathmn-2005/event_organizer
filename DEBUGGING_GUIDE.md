# Debugging Guide - Event Organizer

## ✅ Server Status
- **Backend**: http://localhost:5000 (Running ✅)
- **Frontend**: http://localhost:5173 (Running ✅)
- **Database**: MongoDB Atlas Connected ✅

---

## 🔍 How to Debug Issues

### Step 1: Open Browser Developer Tools
1. Open http://localhost:5173 in your browser
2. Press **F12** or **Right-click → Inspect**
3. Go to the **Console** tab

### Step 2: Check Console Logs
You should see these logs when the page loads:
```
Loading events...
Events loaded: { success: true, events: [...] }
```

If you see **errors**, they will tell us what's wrong:
- ❌ `Network Error` → Backend is not running
- ❌ `401 Unauthorized` → Token issue
- ❌ `CORS error` → Cross-origin issue
- ❌ `Failed to fetch` → Connection problem

---

## 🧪 Test Authentication

### Test 1: Register New User
1. Click **"Sign In"** button (top right)
2. Click **"Sign up"** tab
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Sign up"**

**Expected Console Logs:**
```
Authenticating... {email: "test@example.com", mode: "signup"}
Registration response: {success: true, token: "...", user: {...}}
```

### Test 2: Login
1. Click **"Sign In"** button
2. Use the same email/password from registration
3. Click **"Login"**

**Expected Console Logs:**
```
Authenticating... {email: "test@example.com", mode: "login"}
Login response: {success: true, token: "...", user: {...}}
Loading user data...
User data loaded: {success: true, events: [...]}
```

---

## 🎯 Test Event Loading

### Check Events Are Loading
1. Open http://localhost:5173
2. Look at the **Console** tab
3. You should see:
```
Loading events...
Events loaded: {success: true, count: X, events: [...]}
```

### If Events Don't Load:
Check if you see an error like:
```
Error loading events: Error: Network Error
```

This means the frontend cannot connect to the backend.

**Solutions:**
1. Make sure backend is running: http://localhost:5000
2. Test backend directly in browser: http://localhost:5000/api/health
3. Check if you see: `{"status":"OK","message":"Server is running perfectly!"}`

---

## 🔧 Manual API Testing

### Test 1: Health Check
Open in browser: http://localhost:5000/api/health

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running perfectly!",
  "timestamp": "2025-11-11T..."
}
```

### Test 2: Get Events
Open in browser: http://localhost:5000/api/events

**Expected Response:**
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "page": 1,
  "pages": 0,
  "events": []
}
```

(Empty array is OK - no events created yet)

### Test 3: Register User (Using PowerShell)
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

## 📋 Common Error Messages & Solutions

### Error: "Failed to load events"
**Cause:** Backend is not running
**Solution:**
```bash
cd "backend"
node server.js
```

### Error: "Authentication failed"
**Cause:** Wrong email/password or user doesn't exist
**Solution:**
1. Register a new account first
2. Use correct credentials
3. Check console for specific error message

### Error: "CORS policy blocked"
**Cause:** CORS not configured properly
**Solution:** Already fixed in the code! Just restart backend:
```bash
cd "backend"
node server.js
```

### Error: "Cannot read property '_id'"
**Cause:** Event data format mismatch
**Solution:** Already fixed! The API now handles both `id` and `_id` fields.

---

## 🎬 Complete Testing Workflow

### Step-by-Step Test:
1. ✅ **Check Backend**: Open http://localhost:5000/api/health
2. ✅ **Check Frontend**: Open http://localhost:5173
3. ✅ **Check Console**: Press F12, go to Console tab
4. ✅ **Register User**: Click "Sign In" → "Sign up" → Fill form → Submit
5. ✅ **Create Event**: Click "Create Event" → Fill form → Submit
6. ✅ **View Event**: Should see your event on homepage
7. ✅ **Join Event**: Click on event → Click "Join This Event"
8. ✅ **Check Dashboard**: Click user icon → "Dashboard" → See joined/created events

---

## 📸 What You Should See

### On Homepage:
- Loading spinner → then events appear (or "No events found")
- Search bar working
- Category filters working

### After Login:
- User name in top right
- "Create Event" button visible
- Dashboard accessible from user menu

### Console Logs (No Errors):
```
Loading events...
Events loaded: {...}
```

### Console Logs (With Login):
```
Authenticating... 
Login response: {...}
Loading user data...
User data loaded: {...}
```

---

## 🚨 Current Issues & Fixes Applied

### ✅ Fixed Issues:
1. **CORS Configuration** - Added specific origins
2. **User ID Mapping** - Handle both `id` and `_id` fields
3. **Error Messages** - Better error handling with console logs
4. **Loading States** - Show loading spinner while fetching
5. **Token Storage** - Properly store and retrieve JWT tokens

### 📝 Debug Logs Added:
- Event loading logs
- Authentication logs
- User data loading logs
- Error details in console

---

## 🎉 Testing Checklist

- [ ] Backend running at http://localhost:5000
- [ ] Frontend running at http://localhost:5173
- [ ] No errors in browser console
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Events page loads (empty or with events)
- [ ] Can create event (when logged in)
- [ ] Can view event details
- [ ] Can join event (when logged in)
- [ ] Dashboard shows joined/created events

---

## 📞 Next Steps

1. Open http://localhost:5173 in your browser
2. Open Developer Tools (F12) → Console tab
3. Try to register/login
4. **Copy any error messages from the console and share them**

The console logs will tell us exactly what's failing! 🔍
