# Quick Testing Guide

## Two Types of Tests

Your project has **TWO separate tests** in **TWO different folders**:

### 1. Jest (Backend) - in `backend/` folder
### 2. Cypress (Frontend) - in `frontend/` folder

---

## Jest (Backend API Testing)

### Run Tests:
```bash
cd anna-setu/backend
npm test
```

### What You'll See:
```
✓ should register a new donor user
✓ should login with correct credentials  
✓ should create a new donation
✓ should get donation history for donor

Tests: 4 passed
```

---

## Cypress (Frontend E2E Testing)

### Run Tests:
```bash
cd anna-setu/frontend
npm test
```

### What You'll See:
- Cypress window opens
- Click on `login.cy.js` or `donation.cy.js`
- Watch browser automatically:
  - Open pages
  - Fill forms
  - Click buttons
  - Verify results

---

## Important: Different Folders!

| Test | Folder | Command |
|------|--------|---------|
| **Jest** | `backend/` | `cd anna-setu/backend && npm test` |
| **Cypress** | `frontend/` | `cd anna-setu/frontend && npm test` |

**Make sure you're in the correct folder before running `npm test`!**

---

## Prerequisites

Before running tests:

1. **Start Backend:**
   ```bash
   cd anna-setu/backend
   node server.js
   ```

2. **Start Frontend:**
   ```bash
   cd anna-setu/frontend
   npm start
   ```

3. **Test user exists:**
   - Email: testdonor@example.com
   - Password: password123

---

## That's It!

**Jest** = Backend API testing (terminal output)
**Cypress** = Frontend UI testing (browser window)

Both test your application automatically!
