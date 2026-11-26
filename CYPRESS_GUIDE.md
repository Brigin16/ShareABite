# Cypress E2E Testing Guide

## What is Cypress?
Cypress is an end-to-end testing framework that tests your application in a real browser, simulating actual user interactions.

## How Cypress Works
1. Opens a real browser (Chrome/Firefox)
2. Navigates to your frontend pages
3. Clicks buttons, fills forms, just like a real user
4. Verifies that elements appear and work correctly

## Setup Cypress

### 1. Install Cypress
```bash
cd anna-setu/frontend
npm init -y
npm install --save-dev cypress
```

### 2. Open Cypress
```bash
npx cypress open
```
This creates a `cypress` folder with example tests.

### 3. Configure Cypress
Create `cypress.config.js`:
```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5500', // Your frontend URL
    supportFile: false
  }
})
```

## Example Test: Login Flow

Create `cypress/e2e/login.cy.js`:
```javascript
describe('Anna Setu Login', () => {
  
  it('should load the login page', () => {
    cy.visit('/login.html')
    cy.contains('Login').should('be.visible')
  })

  it('should login successfully', () => {
    cy.visit('/login.html')
    
    // Fill in the form
    cy.get('input[name="email"]').type('testuser@example.com')
    cy.get('input[name="password"]').type('password123')
    
    // Click login button
    cy.get('button[type="submit"]').click()
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard')
    cy.contains('Welcome').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    cy.visit('/login.html')
    
    cy.get('input[name="email"]').type('wrong@example.com')
    cy.get('input[name="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()
    
    // Verify error message appears
    cy.contains('Invalid credentials').should('be.visible')
  })
})
```

## Example Test: Donor Creates Donation

Create `cypress/e2e/donation.cy.js`:
```javascript
describe('Donor Donation Flow', () => {
  
  beforeEach(() => {
    // Login before each test
    cy.visit('/login.html')
    cy.get('input[name="email"]').type('donor@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/donor-dashboard')
  })

  it('should create a new donation', () => {
    // Click "Create Donation" button
    cy.contains('Create Donation').click()
    
    // Fill donation form
    cy.get('select[name="type"]').select('human')
    cy.get('input[name="description"]').type('Rice and curry')
    cy.get('input[name="quantity"]').type('10')
    cy.get('textarea[name="pickupAddress"]').type('123 Main St')
    
    // Submit form
    cy.get('button[type="submit"]').click()
    
    // Verify success message
    cy.contains('Donation created successfully').should('be.visible')
    
    // Verify donation appears in history
    cy.contains('Rice and curry').should('be.visible')
  })
})
```

## Running Cypress Tests

### Interactive Mode (with browser UI)
```bash
npx cypress open
```
- Click on test file to run
- Watch tests execute in real browser
- See each step highlighted

### Headless Mode (for CI/CD)
```bash
npx cypress run
```
- Runs all tests without opening browser
- Faster for automated testing
- Shows results in terminal

## What Cypress Tests

### Frontend Tests:
- ✓ Login/Register forms work
- ✓ Navigation between pages
- ✓ Buttons and links work
- ✓ Forms submit correctly
- ✓ Error messages display
- ✓ Data appears after API calls
- ✓ User flows (register → login → create donation)

### Cypress vs Jest:
| Feature | Jest | Cypress |
|---------|------|---------|
| Tests | Backend API | Frontend UI |
| Runs in | Node.js | Real Browser |
| Speed | Fast | Slower |
| Sees | API responses | Visual elements |
| User Actions | No | Yes (clicks, typing) |

## Benefits of Cypress
1. **Visual Testing** - See tests run in browser
2. **Real User Simulation** - Clicks, typing, navigation
3. **Screenshots** - Auto-captures on failure
4. **Time Travel** - Hover over commands to see what happened
5. **Automatic Waiting** - No need for manual waits

## Complete Testing Strategy

```
Jest (Backend)
  ↓
Tests API endpoints
  ↓
Cypress (Frontend)
  ↓
Tests user interface
  ↓
Complete confidence!
```

## Next Steps
1. Install Cypress: `npm install --save-dev cypress`
2. Run: `npx cypress open`
3. Create test files in `cypress/e2e/`
4. Write tests for your user flows
5. Run tests before deploying
