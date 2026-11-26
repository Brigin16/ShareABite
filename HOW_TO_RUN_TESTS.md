# How to Run Tests - Complete Guide

## Overview

Your project has **TWO** types of tests:
1. **Jest** - Backend API testing (in `backend` folder)
2. **Cypress** - Frontend E2E testing (in `frontend` folder)

---

## 1. Running Jest Tests (Backend API)

### Location: `anna-setu/backend`

### Command:
```bash
cd anna-setu/backend
npm test
```

### What it tests:
- ✓ Register User
- ✓ Login User
- ✓ Create Donation
- ✓ Get Donation History

### Output:
```
Test Suites: 1 passed
Tests:       4 passed
Time:        ~1 second
```

### Prerequisites:
- Backend must be running on port 4000
- MongoDB must be running

---

## 2. Running Cypress Tests (Frontend E2E)

### Location: `anna-setu/frontend`

### Commands:

#### Option A: Interactive Mode (Recommended)
```bash
cd anna-setu/frontend
npm test
```
- Opens Cypress Test Runner window
- Click on test files to run them
- Watch tests execute in browser
- Great for debugging

#### Option B: Headless Mode (For CI/CD)
```bash
cd anna-setu/frontend
npm run test:headless
```
- Runs all tests in terminal
- No browser window opens
- Faster execution
- Good for automated testing

### What it tests:

**login.cy.js:**
- ✓ Load login page
- ✓ Login successfully
- ✓ Show error for invalid credentials

**donation.cy.js:**
- ✓ Navigate to schedule pickup page
- ✓ Create a new donation
- ✓ Display recent donations
- ✓ View donation history
- ✓ View profile information

### Prerequisites:
- Backend running on port 4000
- Frontend running on port 8080
- Test user exists (testdonor@example.com)

---

## Complete Testing Workflow

### Step 1: Start Backend
```bash
cd anna-setu/backend
node server.js
```
**Keep this running in one terminal**

### Step 2: Start Frontend Server
```bash
cd anna-setu/frontend
npm start
```
**Keep this running in another terminal**

### Step 3: Run Jest Tests (Backend)
```bash
# Open new terminal
cd anna-setu/backend
npm test
```

### Step 4: Run Cypress Tests (Frontend)
```bash
# Open new terminal
cd anna-setu/frontend
npm test
```
**Then click on test files in Cypress window**

---

## Quick Reference

| Test Type | Location | Command | Output |
|-----------|----------|---------|--------|
| **Jest** | `backend/` | `npm test` | Terminal |
| **Cypress (UI)** | `frontend/` | `npm test` | Browser Window |
| **Cypress (Headless)** | `frontend/` | `npm run test:headless` | Terminal |

---

## Troubleshooting

### Jest tests fail:
```bash
# Check backend is running
curl http://localhost:4000

# Check MongoDB is running
# Windows: Check Services for "MongoDB"
```

### Cypress tests fail:
```bash
# Check frontend is accessible
curl http://localhost:8080

# Check backend is running
curl http://localhost:4000

# Verify test user exists
# Email: testdonor@example.com
# Password: password123
```

### "npm test" runs wrong test:
- **In backend folder** → Runs Jest
- **In frontend folder** → Runs Cypress
- Make sure you're in the correct folder!

---

## Summary

**Jest (Backend):**
```bash
cd anna-setu/backend && npm test
```

**Cypress (Frontend):**
```bash
cd anna-setu/frontend && npm test
```

**Both are independent - run them from their respective folders!**
