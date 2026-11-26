# ShareABite - Project Workflow

## 🔄 System Architecture Flow

```
Frontend (HTML/CSS/JS) ↔ HTTP/HTTPS ↔ Backend (Node.js/Express) ↔ MongoDB
                                    ↕
                            JWT Authentication
                                    ↕
                            Testing (Jest/Cypress)
```

---

## 📋 Step-by-Step Workflow

### Step 1: User Registration
1. **User visits** ShareABite platform (http://localhost:8080)
2. **Clicks "Sign Up"** → Navigate to signup.html
3. **Fills registration form:**
   - Name, Email, Password
   - Role: Donor/Volunteer/Receiver/Admin
   - Additional role-specific fields
4. **Frontend validates** form data
5. **Sends POST request** to `/api/auth/register`
6. **Backend processes:**
   - Checks email uniqueness
   - Hashes password with bcryptjs
   - Saves user to MongoDB
   - Auto-approves instant donors
7. **Returns success message**
8. **User redirected** to login page

### Step 2: User Login
1. **User enters credentials** on login.html
2. **Selects role** from dropdown
3. **Frontend sends POST** to `/api/auth/login`
4. **Backend verifies:**
   - User exists in database
   - Password matches (bcrypt comparison)
   - Account is approved
5. **Generates JWT token** with user ID and role
6. **Returns token + user data**
7. **Frontend stores** token in localStorage
8. **Redirects to role-specific dashboard**

### Step 3: Donation Creation (Donor)
1. **Donor logs in** → Access donorDashboard.html
2. **Clicks "Schedule Pickup"**
3. **Fills donation form:**
   - Food type (Human/Animal/Compost)
   - Description and quantity
   - Pickup address
   - Special instructions
4. **Frontend validates** form data
5. **Sends POST request** to `/api/donor` with JWT token
6. **Backend creates donation:**
   - Validates JWT token
   - Creates Donation document
   - Sets status as "Pending"
   - Logs activity
7. **Returns success response**
8. **Frontend updates** donation history

### Step 4: Admin Assignment
1. **Admin logs in** → Access adminDashboard.html
2. **Views pending donations** list
3. **Selects donation** to assign
4. **Chooses volunteer** based on location/availability
5. **Selects receiver** based on food type/capacity
6. **Sends assignment** via POST to `/api/admin/assign`
7. **Backend processes:**
   - Updates donation status to "Assigned"
   - Creates Task document
   - Links volunteer and receiver
   - Sends notifications
8. **Updates all dashboards** with new status

### Step 5: Volunteer Pickup
1. **Volunteer receives** task notification
2. **Logs in** → Views volunteerDashboard.html
3. **Sees assigned task** with pickup details
4. **Accepts task** → Status: "Accepted"
5. **Travels to pickup location**
6. **Performs quality check:**
   - Food condition assessment
   - Packaging inspection
   - Safety verification
7. **Updates status** to "Picked Up"
8. **Proceeds to delivery location**

### Step 6: Delivery to Receiver
1. **Volunteer arrives** at receiver location
2. **Hands over food** to receiver
3. **Receiver inspects** donation quality
4. **Receiver confirms receipt** via dashboard
5. **Updates status** to "Delivered"
6. **System calculates impact:**
   - Meals served
   - CO2 emissions saved
   - Food waste prevented
7. **Final status:** "Completed"

### Step 7: Real-time Tracking
1. **All users can track** donation progress
2. **Status updates** reflect in real-time
3. **Notifications sent** at each stage
4. **Analytics updated** automatically
5. **Impact metrics** calculated and displayed

---

## 🔧 Technical Data Flow

### API Request Flow:
```
Frontend Form → HTTP Request → Express Router → Middleware → Controller → MongoDB → Response → Frontend Update
```

### Authentication Flow:
```
Login Form → POST /api/auth/login → Password Verification → JWT Generation → Token Storage → Dashboard Access
```

### Donation Flow:
```
Donation Form → POST /api/donor → JWT Validation → Database Save → Activity Log → Success Response → UI Update
```

### Assignment Flow:
```
Admin Selection → POST /api/admin/assign → Database Update → Task Creation → Notifications → Status Sync
```

---

## 📊 Database Operations

### User Registration:
```javascript
User.create({
  name, email, hashedPassword, role, status
}) → MongoDB Insert → Activity Log
```

### Donation Creation:
```javascript
Donation.create({
  donor, type, description, quantity, address, status: 'Pending'
}) → MongoDB Insert → Activity Log
```

### Assignment Process:
```javascript
Donation.update({ assignedVolunteer, assignedReceiver, status: 'Assigned' })
Task.create({ donation, volunteer, receiver })
Notification.create({ recipient, message })
```

### Status Updates:
```javascript
Task.update({ status: 'Picked Up', qualityCheck })
Donation.update({ status: 'Picked Up' })
Activity.create({ type: 'status_update' })
```

---

## 🧪 Testing Workflow

### Jest (Backend API Testing):
```
Test Setup → API Calls → Database Operations → Response Validation → Cleanup
```

### Cypress (Frontend E2E Testing):
```
Browser Launch → Page Navigation → User Interactions → Form Submissions → Assertions
```

### Test Execution:
```
npm test (Jest) → 4 API tests → 100% pass rate
npm test (Cypress) → 3 E2E tests → 100% pass rate
```

---

## 🔄 Complete System Integration

### Request-Response Cycle:
1. **User Action** (click, form submit)
2. **Frontend Processing** (validation, formatting)
3. **HTTP Request** (with JWT token)
4. **Backend Routing** (Express.js)
5. **Authentication** (JWT verification)
6. **Business Logic** (controllers)
7. **Database Operation** (MongoDB)
8. **Response Generation** (JSON)
9. **Frontend Update** (DOM manipulation)
10. **User Feedback** (notifications, UI changes)

### Real-time Updates:
```
Database Change → Activity Log → Dashboard Refresh → User Notification
```

### Error Handling:
```
Error Occurs → Catch Block → Error Response → Frontend Display → User Feedback
```

---

## 📱 User Experience Flow

### Donor Journey:
```
Register → Login → Create Donation → Track Status → View Impact
```

### Volunteer Journey:
```
Register → Approval → Login → Accept Task → Pickup → Quality Check → Deliver
```

### Receiver Journey:
```
Register → Approval → Login → View Deliveries → Confirm Receipt → Provide Feedback
```

### Admin Journey:
```
Login → View Pending → Assign Resources → Monitor Progress → Generate Reports
```

---

## 🎯 Key Workflow Features

### Security:
- JWT token authentication
- Password hashing (bcryptjs)
- Role-based access control
- Input validation

### Performance:
- Efficient database queries
- Minimal API calls
- Optimized frontend rendering
- Fast test execution

### Reliability:
- Error handling at all levels
- Transaction consistency
- Automated testing
- Data validation

### Scalability:
- RESTful API design
- Modular code structure
- Database indexing
- Stateless authentication

---

## 📈 Success Metrics

### Technical Performance:
- API response time: < 300ms
- Test execution: < 15 seconds
- Database queries: Optimized
- Error rate: < 1%

### Business Impact:
- Food rescued: Measurable in kg
- Meals served: Calculated automatically
- CO2 saved: Environmental impact
- User satisfaction: High engagement

---

## 🔚 Workflow Summary

ShareABite's workflow seamlessly connects:
1. **Technology** (Node.js, MongoDB, JWT)
2. **Users** (4 distinct roles)
3. **Processes** (Registration → Assignment → Delivery)
4. **Impact** (Food rescue → Community feeding)
5. **Quality** (Automated testing → Reliability)

**Result:** A complete, tested, and functional food donation platform that transforms waste into nourishment through systematic digital coordination.