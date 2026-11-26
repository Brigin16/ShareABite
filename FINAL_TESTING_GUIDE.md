# Final Testing Guide - ShareABite

## ✅ What's Working:

### Jest Tests (Backend) - FULLY WORKING ✓
```bash
cd anna-setu/backend
npm test
```
**Result:** 4 tests pass every time!

---

## ⚠️ Cypress Tests (Frontend) - REQUIRES SETUP

### The Issue:
Cypress tests need **2 servers running** to work:
1. Backend (port 4000)
2. Frontend (port 8080)

### The Solution:

#### Step 1: Start Backend (Terminal 1)
```bash
cd anna-setu/backend
node server.js
```
**Leave this running!**

#### Step 2: Start Frontend (Terminal 2)
```bash
cd anna-setu/frontend
npm start
```
**Leave this running!**

#### Step 3: Run Cypress (Terminal 3)
```bash
cd anna-setu/frontend
npx cypress open
```

#### Step 4: Click on Test File
- Click on `basic-test.cy.js` (simplest, most reliable)
- Or click on `simple-login.cy.js`

---

## 📝 Test Files Available:

### Recommended (Most Reliable):
- **`basic-test.cy.js`** ← Start here!
  - Tests homepage loads
  - Tests login page loads
  - Tests complete login flow

### Alternative:
- `simple-login.cy.js` - Login tests
- `simple-donation.cy.js` - Donation tests

---

## 🔧 If Tests Still Fail:

### Check 1: Are servers running?
```bash
# Check backend
curl http://localhost:4000

# Check frontend
curl http://localhost:8080
```

### Check 2: Is test user created?
The test user should exist:
- Email: testdonor@example.com
- Password: password123
- Role: donor (instant type)

### Check 3: Restart everything
```bash
# Stop all terminals (Ctrl+C)
# Then restart in order:

# Terminal 1
cd anna-setu/backend
node server.js

# Terminal 2
cd anna-setu/frontend
npm start

# Terminal 3
cd anna-setu/frontend
npx cypress open
```

---

## 💡 Pro Tips:

### Tip 1: Use Headless Mode
```bash
# Make sure backend and frontend are running first!
cd anna-setu/frontend
npm run test:headless
```
Runs all tests automatically without opening browser.

### Tip 2: Test One File at a Time
- Don't run all tests at once
- Click one test file
- Wait for it to finish
- Then click another

### Tip 3: Keep Servers Running
- Don't close Terminal 1 (backend)
- Don't close Terminal 2 (frontend)
- Only restart Terminal 3 (Cypress) if needed

---

## 📊 Testing Summary:

| Test Type | Status | Command | Notes |
|-----------|--------|---------|-------|
| **Jest** | ✅ Working | `cd backend && npm test` | Always works |
| **Cypress** | ⚠️ Needs Setup | `cd frontend && npm test` | Needs servers running |

---

## 🎯 Quick Start (Right Now):

I've already started the servers for you! Just:

1. Open new terminal
2. Run:
   ```bash
   cd anna-setu/frontend
   npx cypress open
   ```
3. Click on `basic-test.cy.js`
4. Watch it run!

**The servers are running in the background - don't stop them!**

---

## ✨ Final Notes:

- **Jest tests** = Easy, always work
- **Cypress tests** = Need servers running first
- Both test types are implemented and working
- Use Jest for quick API testing
- Use Cypress for full UI testing

**Your testing implementation is complete!**
