# Cypress Testing Setup

## Installation

Cypress download was interrupted. To install Cypress, run:

```bash
cd anna-setu/frontend
npm install --save-dev cypress
```

**Note:** Cypress is a large package (~200MB). Download may take 5-10 minutes depending on your internet speed.

## Running Tests

### Option 1: Interactive Mode (Recommended for Development)
```bash
npm test
```
This opens the Cypress Test Runner where you can:
- Click on test files to run them
- Watch tests execute in a real browser
- See each step highlighted
- Debug failures easily

### Option 2: Headless Mode (For CI/CD)
```bash
npm run test:headless
```
Runs all tests in the terminal without opening a browser.

## Test Files Created

### 1. Login Tests (`cypress/e2e/login.cy.js`)
Tests the login functionality:
- ✓ Load login page
- ✓ Login with valid credentials
- ✓ Show error for invalid credentials

### 2. Donation Tests (`cypress/e2e/donation.cy.js`)
Tests the complete donor flow:
- ✓ Navigate to schedule pickup page
- ✓ Create a new donation
- ✓ Display recent donations on dashboard
- ✓ View full donation history
- ✓ View profile information

## Prerequisites

Before running Cypress tests:

1. **Backend must be running:**
   ```bash
   cd anna-setu/backend
   node server.js
   ```
   Backend should be running on `http://localhost:4000`

2. **Frontend must be accessible:**
   - Open `login.html` in a browser or
   - Use Live Server extension in VS Code
   - Default URL: `http://127.0.0.1:5500`

3. **Test user must exist:**
   Create a test donor account:
   - Email: `testdonor@example.com`
   - Password: `password123`
   - Role: Donor (Instant type for auto-approval)

## Configuration

Edit `cypress.config.js` to change settings:

```javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5500', // Change to your frontend URL
    supportFile: false,
    video: false,
    screenshotOnRunFailure: true
  }
})
```

## What Cypress Tests

### Login Flow:
1. Opens login page
2. Fills email and password
3. Selects user role
4. Clicks login button
5. Verifies redirect to dashboard

### Donation Flow:
1. Logs in as donor
2. Navigates to schedule pickup
3. Fills donation form (type, description, quantity, address)
4. Submits form
5. Verifies success message
6. Checks donation appears in history

## Troubleshooting

### Cypress won't install
- Check internet connection
- Try: `npm cache clean --force`
- Then: `npm install --save-dev cypress`

### Tests fail immediately
- Ensure backend is running on port 4000
- Ensure frontend is accessible
- Check baseUrl in `cypress.config.js` matches your frontend URL

### Login test fails
- Create test user first (email: testdonor@example.com)
- Ensure user is approved (instant donor type)
- Check browser console for API errors

### Donation test fails
- Ensure you're logged in as an approved donor
- Check network tab for API call failures
- Verify backend is responding to POST /api/donor

## Benefits of Cypress

- **Visual Testing:** See tests run in real browser
- **Real User Simulation:** Actual clicks, typing, navigation
- **Auto-waiting:** No manual waits needed
- **Screenshots:** Auto-captures on failure
- **Time Travel:** Hover over commands to see what happened
- **Debugging:** Use Chrome DevTools during tests

## Next Steps

1. Install Cypress: `npm install --save-dev cypress`
2. Create test user in your application
3. Start backend server
4. Open frontend in browser
5. Run: `npm test`
6. Click on test files to watch them run!
