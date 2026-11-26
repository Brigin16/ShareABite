# API Testing Guide

## Testing with Postman (Backend Running)

### Prerequisites
- Backend server running on `http://localhost:4000`
- Postman installed (or use Thunder Client in VS Code)

### Test 1: Register User
**Method:** POST  
**URL:** `http://localhost:4000/api/auth/register`  
**Headers:** `Content-Type: application/json`  
**Body (JSON):**
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123",
  "role": "donor",
  "donorType": "instant",
  "phone": "1234567890"
}
```
**Expected Response:** Status 201
```json
{
  "message": "User registered successfully! Please log in."
}
```

---

### Test 2: Login User
**Method:** POST  
**URL:** `http://localhost:4000/api/auth/login`  
**Headers:** `Content-Type: application/json`  
**Body (JSON):**
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```
**Expected Response:** Status 200
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "donor"
  }
}
```
**Important:** Copy the `token` value for next requests!

---

### Test 3: Create Donation
**Method:** POST  
**URL:** `http://localhost:4000/api/donor`  
**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_TOKEN_HERE` (paste token from login)

**Body (JSON):**
```json
{
  "type": "human",
  "description": "Cooked rice and curry",
  "quantity": 10,
  "pickupAddress": "123 Main Street, City",
  "additionalGuidelines": "Please handle with care"
}
```
**Expected Response:** Status 201
```json
{
  "message": "Donation scheduled successfully!",
  "donation": {
    "_id": "...",
    "type": "human",
    "description": "Cooked rice and curry",
    "quantity": 10,
    "status": "Pending"
  }
}
```

---

### Test 4: Get Donation History
**Method:** GET  
**URL:** `http://localhost:4000/api/donor`  
**Headers:**
- `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response:** Status 200
```json
[
  {
    "_id": "...",
    "type": "human",
    "description": "Cooked rice and curry",
    "quantity": 10,
    "status": "Pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Other Useful Endpoints to Test

### Get Admin Dashboard Stats
**Method:** GET  
**URL:** `http://localhost:4000/api/admin/dashboard`  
**Headers:** `Authorization: Bearer ADMIN_TOKEN`

### Get Volunteer Tasks
**Method:** GET  
**URL:** `http://localhost:4000/api/volunteer/tasks`  
**Headers:** `Authorization: Bearer VOLUNTEER_TOKEN`

---

## Tips
1. Always copy the token from login response
2. Add token to Authorization header as: `Bearer YOUR_TOKEN`
3. Check response status codes (200, 201, 401, 500)
4. Save requests in Postman collection for reuse
