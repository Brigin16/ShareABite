# Test Commands - Quick Reference

## Jest (Backend API Tests)

```bash
cd anna-setu/backend
npm test
```

**Output:** Terminal shows pass/fail

---

## Cypress (Frontend E2E Tests)

```bash
cd anna-setu/frontend
npm test
```

**Output:** Browser window opens with test runner

---

## Remember:

- **Backend folder** → Jest tests
- **Frontend folder** → Cypress tests
- **Different folders = Different tests!**

---

## Full Testing Session:

```bash
# Terminal 1: Start Backend
cd anna-setu/backend
node server.js

# Terminal 2: Start Frontend
cd anna-setu/frontend
npm start

# Terminal 3: Run Jest
cd anna-setu/backend
npm test

# Terminal 4: Run Cypress
cd anna-setu/frontend
npm test
```
