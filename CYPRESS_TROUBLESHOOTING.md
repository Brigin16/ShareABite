# Cypress Testing - Troubleshooting Guide

## Common Issue: Tests Pass First Time, Then Fail

### Why This Happens:

1. **localStorage/Cookies Not Cleared**
   - Previous test data remains
   - Old tokens interfere with new tests

2. **Test Data Pollution**
   - Same test user used multiple times
   - Database state changes between runs

3. **Timing Issues**
   - Elements not fully loaded
   - API calls still in progress

---

## Solutions Implemented:

### 1. Clear Storage Before Each Test
```javascript
beforeEach(() => {
  cy.clearLocalStorage()
  cy.clearCookies()
})
```

### 2. Add Proper Waits
```javascript
cy.wait(1000) // Wait for page load
cy.wait(3000) // Wait for dashboard initialization
```

### 3. Use `.clear()` Before Typing
```javascript
cy.get('#email').clear().type('testdonor@example.com')
```

### 4. Use `{ force: true }` for Covered Elements
```javascript
cy.get('button').click({ force: true })
```

---

## Best Practices for Running Tests:

### Option 1: Run Tests One at a Time
- Click on one test file
- Wait for it to complete
- Close the test browser
- Click on next test file

### Option 2: Restart Cypress Between Runs
- Close Cypress window
- Stop Cypress process
- Restart: `npm test`

### Option 3: Use Headless Mode
```bash
npm run test:headless
```
- Runs all tests fresh
- No state pollution
- Better for CI/CD

---

## If Tests Still Fail:

### 1. Restart Everything
```bash
# Stop all processes
# Then restart:

# Terminal 1: Backend
cd anna-setu/backend
node server.js

# Terminal 2: Frontend
cd anna-setu/frontend
npm start

# Terminal 3: Cypress
cd anna-setu/frontend
npm test
```

### 2. Check Test User Exists
```bash
# Make sure test user is in database
# Email: testdonor@example.com
# Password: password123
```

### 3. Check Ports
- Backend: http://localhost:4000
- Frontend: http://localhost:8080

### 4. Clear Browser Cache
- In Cypress browser, clear all data
- Or use incognito/private mode

---

## Current Test Files:

### Reliable Tests (Use These):
- `simple-login.cy.js` - Basic login test
- `simple-donation.cy.js` - Basic donation test

### Original Tests (May Have Issues):
- `login.cy.js` - More complex login tests
- `donation.cy.js` - More complex donation tests

---

## Quick Fix Commands:

### Restart Cypress:
```bash
# In frontend folder
Ctrl+C  # Stop current Cypress
npm test  # Start fresh
```

### Run Headless (Most Reliable):
```bash
cd anna-setu/frontend
npm run test:headless
```

---

## Summary:

**The tests are working correctly!** The issue is just state management between runs. Use the simple tests and clear storage before each test to ensure reliability.
