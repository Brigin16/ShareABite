# Cypress Testing Checklist

## Before Running Tests:

### ☐ Step 1: Start Backend
- [ ] Open Terminal 1
- [ ] Run: `cd anna-setu/backend`
- [ ] Run: `node server.js`
- [ ] See: "Server is running on port 4000"
- [ ] **KEEP THIS TERMINAL OPEN!**

### ☐ Step 2: Start Frontend
- [ ] Open Terminal 2
- [ ] Run: `cd anna-setu/frontend`
- [ ] Run: `npm start`
- [ ] See: "Available on: http://127.0.0.1:8080"
- [ ] **KEEP THIS TERMINAL OPEN!**

### ☐ Step 3: Verify Servers
- [ ] Open browser: http://localhost:4000
- [ ] Should see: API welcome message
- [ ] Open browser: http://localhost:8080
- [ ] Should see: Your website

### ☐ Step 4: Run Cypress
- [ ] Open Terminal 3
- [ ] Run: `cd anna-setu/frontend`
- [ ] Run: `npm test`
- [ ] Cypress window opens
- [ ] Click on test files

---

## While Testing:

### ✅ Keep Running:
- Terminal 1 (Backend) - **DON'T CLOSE**
- Terminal 2 (Frontend) - **DON'T CLOSE**

### ✅ Can Close/Restart:
- Terminal 3 (Cypress) - Can restart anytime
- Cypress window - Can close and reopen

---

## If Tests Fail:

### Check This Order:

1. **Is Terminal 1 still running?**
   - Should show: "Server is running on port 4000"
   - If not: Restart backend

2. **Is Terminal 2 still running?**
   - Should show: "Available on: http://127.0.0.1:8080"
   - If not: Restart frontend

3. **Is Cypress having issues?**
   - Close Cypress window
   - Press Ctrl+C in Terminal 3
   - Run `npm test` again

---

## Easy Way (Using Batch Files):

### Windows Users:
1. Double-click `start-backend.bat` (keep window open)
2. Double-click `start-frontend.bat` (keep window open)
3. Double-click `start-cypress.bat`

---

## Remember:

**Cypress tests = Robot visiting your website**

If your website isn't running, the robot can't visit it!

**Always keep backend and frontend running while testing!**
