# How to Run Cypress Tests - Complete Guide

## The Problem:
Cypress tests need **3 things running at the same time**:
1. Backend server (port 4000)
2. Frontend server (port 8080)
3. Cypress test runner

If you stop any of these, tests will fail!

---

## Solution: Keep Everything Running

### Step 1: Start Backend (Keep Running)
Open **Terminal 1** and run:
```bash
cd anna-setu/backend
node server.js
```
**DO NOT CLOSE THIS TERMINAL!** Keep it running.

### Step 2: Start Frontend (Keep Running)
Open **Terminal 2** and run:
```bash
cd anna-setu/frontend
npm start
```
**DO NOT CLOSE THIS TERMINAL!** Keep it running.

### Step 3: Run Cypress Tests
Open **Terminal 3** and run:
```bash
cd anna-setu/frontend
npm test
```

Now click on test files in Cypress window!

---

## Important Rules:

### ✅ DO:
- Keep all 3 terminals open
- Keep backend and frontend running while testing
- Only close Cypress window between test runs
- Restart Cypress (Terminal 3) if needed

### ❌ DON'T:
- Don't stop backend server
- Don't stop frontend server
- Don't close Terminal 1 or Terminal 2
- Only Terminal 3 (Cypress) can be restarted

---

## If Tests Fail:

### Check 1: Is Backend Running?
Open browser: http://localhost:4000
- Should see: `{"message":"Welcome to the Anna Setu API!"}`
- If not, restart Terminal 1

### Check 2: Is Frontend Running?
Open browser: http://localhost:8080
- Should see your website
- If not, restart Terminal 2

### Check 3: Restart Cypress Only
- Close Cypress window
- In Terminal 3, press Ctrl+C
- Run `npm test` again

---

## Quick Restart Script

If everything stopped, run these in order:

```bash
# Terminal 1
cd anna-setu/backend
node server.js

# Terminal 2 (new terminal)
cd anna-setu/frontend
npm start

# Terminal 3 (new terminal)
cd anna-setu/frontend
npm test
```

---

## Alternative: Run Tests Without Cypress UI

If you don't want to keep Cypress window open:

```bash
# Make sure backend and frontend are running first!
cd anna-setu/frontend
npm run test:headless
```

This runs all tests in terminal and exits automatically.

---

## Summary:

**The key:** Backend and Frontend must ALWAYS be running for Cypress tests to work!

Think of it like this:
- Backend = Your API server (must run)
- Frontend = Your website (must run)
- Cypress = A robot that visits your website and tests it

If the website isn't running, the robot can't test it!
