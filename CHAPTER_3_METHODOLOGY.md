# CHAPTER 3: METHODOLOGY

## 3.1 Overview of the Platform

ShareABite employs a full-stack web architecture with clear separation between backend API services and frontend user interface. The platform follows RESTful principles for API design and implements modern JavaScript practices for both server and client-side code.

### Architecture Components:

**Backend (Node.js + Express.js):**
- RESTful API server handling all business logic
- MongoDB database for persistent data storage
- JWT-based authentication middleware
- Role-based authorization system
- Comprehensive error handling

**Frontend (HTML5 + CSS3 + Vanilla JavaScript):**
- Static web pages served via HTTP server
- Dynamic content rendering using JavaScript
- Responsive design for multiple devices
- Form validation and user feedback
- Local storage for session management

**Testing Infrastructure:**
- Jest for backend API testing
- Cypress for frontend E2E testing
- Automated test execution
- Continuous integration ready

## 3.2 Steps in Automating API Testing with Jest

### Step 1: Jest Setup and Configuration

**Installation:**
```bash
npm install --save-dev jest supertest
```

**Configuration (jest.config.js):**
```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 10000
};
```

**Package.json Script:**
```json
"scripts": {
  "test": "jest --detectOpenHandles --forceExit"
}
```

### Step 2: Test File Structure

Created `__tests__/api.test.js` with organized test suites:

```javascript
const request = require('supertest');
const baseURL = 'http://localhost:4000';

describe('ShareABite API Tests', () => {
  // Test suites for each endpoint
});
```

### Step 3: Authentication Testing

**Test Case 1: User Registration**
```javascript
it('should register a new donor user', async () => {
  const response = await request(baseURL)
    .post('/api/auth/register')
    .send({
      name: 'Test Donor',
      email: `donor${Date.now()}@test.com`,
      password: 'password123',
      role: 'donor',
      donorType: 'instant'
    });

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('message');
});
```

**Test Case 2: User Login**
```javascript
it('should login with correct credentials', async () => {
  const loginResponse = await request(baseURL)
    .post('/api/auth/login')
    .send({
      email: email,
      password: 'password123'
    });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body).toHaveProperty('token');
  donorToken = loginResponse.body.token;
});
```

### Step 4: Donation Operations Testing

**Test Case 3: Create Donation**
```javascript
it('should create a new donation', async () => {
  const response = await request(baseURL)
    .post('/api/donor')
    .set('Authorization', `Bearer ${donorToken}`)
    .send({
      type: 'human',
      description: 'Cooked rice and curry',
      quantity: 10,
      pickupAddress: '123 Test Street'
    });

  expect(response.status).toBe(201);
  expect(response.body.donation.type).toBe('human');
});
```

**Test Case 4: Get Donation History**
```javascript
it('should get donation history for donor', async () => {
  const response = await request(baseURL)
    .get('/api/donor')
    .set('Authorization', `Bearer ${donorToken}`);

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});
```

### Step 5: Test Execution

**Running Tests:**
```bash
cd backend
npm test
```

**Test Results:**
```
PASS  __tests__/api.test.js
  ShareABite API Tests
    ✓ should register a new donor user (263ms)
    ✓ should login with correct credentials (221ms)
    ✓ should create a new donation (45ms)
    ✓ should get donation history (23ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Time:        1.166s
```

### Step 6: Key Testing Strategies

**Dynamic Test Data:**
- Used `Date.now()` for unique email generation
- Prevents test conflicts on multiple runs
- Ensures test independence

**Token Management:**
- Stored JWT tokens between test cases
- Enabled authenticated endpoint testing
- Simulated real user sessions

**Assertion Patterns:**
- Status code validation
- Response structure verification
- Data type checking
- Business logic validation

## 3.3 Frontend E2E Testing with Cypress

### Step 1: Cypress Installation and Setup

**Installation:**
```bash
cd frontend
npm install --save-dev cypress http-server
```

**Configuration (cypress.config.js):**
```javascript
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: false,
    video: false,
    screenshotOnRunFailure: true
  }
}
```

### Step 2: Test Environment Setup

**Frontend Server:**
```bash
npm start  # Starts http-server on port 8080
```

**Backend Server:**
```bash
node server.js  # Runs on port 4000
```

### Step 3: Basic Test Implementation

**Test File: basic-test.cy.js**

**Test Case 1: Homepage Load**
```javascript
it('should load the homepage', () => {
  cy.visit('/index.html')
  cy.contains('ShareABite').should('be.visible')
})
```

**Test Case 2: Login Page Load**
```javascript
it('should load the login page', () => {
  cy.visit('/login.html')
  cy.get('#email').should('exist')
  cy.get('#password').should('exist')
})
```

**Test Case 3: Complete Login Flow**
```javascript
it('should complete full login flow', () => {
  cy.clearAllLocalStorage()
  cy.clearAllCookies()
  
  cy.visit('/login.html')
  cy.wait(2000)
  
  cy.get('#email').type('testdonor@example.com')
  cy.get('#password').type('password123')
  cy.get('#userType').select('donor')
  cy.get('button[type="submit"]').click()
  
  cy.wait(5000)
  cy.url().should('match', /Dashboard\.html/)
})
```

### Step 4: Test Execution

**Interactive Mode:**
```bash
npm test  # Opens Cypress Test Runner
```

**Headless Mode:**
```bash
npm run test:headless  # Runs in terminal
```

**Test Results:**
```
Running: basic-test.cy.js

Basic ShareABite Tests
  ✓ should load the homepage (762ms)
  ✓ should load the login page (473ms)
  ✓ should complete full login flow (11138ms)

3 passing (12s)
```

### Step 5: Advanced Cypress Features

**State Management:**
```javascript
beforeEach(() => {
  cy.clearLocalStorage()
  cy.clearCookies()
})
```

**Force Interactions:**
```javascript
cy.get('button').click({ force: true })
```

**Custom Waits:**
```javascript
cy.wait(2000)  // Wait for page initialization
```

**URL Assertions:**
```javascript
cy.url().should('include', 'dashboard')
```

## 3.4 Testing Methodology Comparison

### Jest (Backend API Testing)

**Advantages:**
- Fast execution (~1 second for 4 tests)
- No browser required
- Easy to integrate with CI/CD
- Excellent for unit and integration testing
- Detailed error messages

**Use Cases:**
- API endpoint validation
- Business logic testing
- Database operations
- Authentication flows
- Data validation

### Cypress (Frontend E2E Testing)

**Advantages:**
- Tests real user interactions
- Visual feedback during testing
- Automatic waiting for elements
- Screenshot and video recording
- Time-travel debugging

**Use Cases:**
- User workflow validation
- Form submission testing
- Navigation testing
- UI responsiveness
- Cross-browser compatibility

### Combined Approach Benefits

1. **Complete Coverage:** Backend logic + Frontend UI
2. **Confidence:** Both layers tested independently
3. **Regression Prevention:** Automated test suites
4. **Documentation:** Tests serve as usage examples
5. **Quality Assurance:** Catch bugs before production
