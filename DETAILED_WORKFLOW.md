# ShareABite - Detailed Technical Workflow

## 🔧 System Architecture Overview

### Technology Stack Flow:
```
Frontend (HTML/CSS/JS) ↔ HTTP Requests ↔ Backend (Node.js/Express) ↔ MongoDB Database
                                    ↕
                            JWT Authentication
                                    ↕
                            Testing (Jest/Cypress)
```

---

## 📱 Phase 1: User Registration - Deep Dive

### 1.1 Frontend Registration Process

#### Step 1: Page Load (signup.html)
```javascript
// Frontend: signup.html loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form validation
    // Set up event listeners
    // Load role-specific fields
});
```

#### Step 2: Form Interaction
1. **User fills form fields:**
   ```html
   <input type="text" id="name" placeholder="Full Name" required>
   <input type="email" id="email" placeholder="Email Address" required>
   <input type="password" id="password" placeholder="Password" required>
   <select id="role" required>
       <option value="donor">Donor</option>
       <option value="volunteer">Volunteer</option>
       <option value="receiver">Receiver</option>
   </select>
   ```

2. **Dynamic field display:**
   ```javascript
   // If donor selected, show donor type
   if (role === 'donor') {
       showDonorTypeField();
   }
   ```

#### Step 3: Form Submission
```javascript
// Frontend validation
function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Email format validation
    if (!isValidEmail(email)) {
        showError('Invalid email format');
        return false;
    }
    
    // Password strength validation
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return false;
    }
    
    return true;
}
```

### 1.2 Backend Registration Process

#### Step 4: API Request Handling
```javascript
// Backend: routes/auth.js
router.post('/register', async (req, res) => {
    const { name, email, password, role, donorType } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email already exists.' 
            });
        }
        
        // Create new user
        const newUser = new User({ 
            name, 
            email, 
            password, // Will be hashed by pre-save middleware
            role, 
            donorType 
        });
        
        // Auto-approve instant donors
        if (role === 'donor' && donorType === 'instant') {
            newUser.status = 'approved';
        }
        
        await newUser.save();
        
        // Log activity
        const activity = new Activity({
            text: `${newUser.name} registered as a new ${newUser.role}.`,
            type: 'user_registered',
            userRef: newUser._id
        });
        await activity.save();
        
        res.status(201).json({ 
            message: 'User registered successfully! Please log in.' 
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error during registration.', 
            error: error.message 
        });
    }
});
```

#### Step 5: Database Operations
```javascript
// models/User.js - Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
```

### 1.3 Response Handling
```javascript
// Frontend: Handle registration response
fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    if (data.message) {
        showSuccessMessage(data.message);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
})
.catch(error => {
    showErrorMessage(error.message);
});
```

---

## 🔐 Phase 2: Authentication - Deep Dive

### 2.1 Login Process

#### Step 1: Login Form Submission
```javascript
// Frontend: js/login.js
async function handleLogin(event) {
    event.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const userType = userTypeSelect.value;
    
    if (!userType) {
        showNotification('Please select a user role.', 'error');
        return;
    }
    
    setLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed.');
        }
        
        // Store authentication data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showNotification(data.message, 'success');
        
        // Redirect based on role
        setTimeout(() => redirectByRole(data.user.role), 1000);
        
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        setLoading(false);
    }
}
```

#### Step 2: Backend Authentication
```javascript
// Backend: controllers/authController.js
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        
        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        
        // Check if user is approved
        if (user.status !== 'approved') {
            return res.status(403).json({ 
                message: 'Your account is pending approval. Please wait.' 
            });
        }
        
        // Generate JWT token
        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
        
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                donorType: user.donorType
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error during login.', 
            error: error.message 
        });
    }
};
```

#### Step 3: Password Comparison
```javascript
// models/User.js - Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};
```

#### Step 4: JWT Token Generation
```javascript
// JWT payload structure
const payload = {
    id: user._id,           // User ID for identification
    role: user.role,        // Role for authorization
    iat: timestamp,         // Issued at time
    exp: timestamp + 3days  // Expiration time
};

// Token signing
const token = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: '3d' 
});
```

### 2.2 Role-Based Redirection
```javascript
// Frontend: Redirect logic
function redirectByRole(role) {
    switch (role) {
        case 'admin':
            window.location.href = 'adminDashboard.html';
            break;
        case 'donor':
            window.location.href = 'donorDashboard.html';
            break;
        case 'volunteer':
            window.location.href = 'volunteerDashboard.html';
            break;
        case 'receiver':
            window.location.href = 'receiverDashboard.html';
            break;
        default:
            window.location.href = 'login.html';
    }
}
```

---

## 🍽️ Phase 3: Donation Creation - Deep Dive

### 3.1 Dashboard Initialization

#### Step 1: Page Load Authentication Check
```javascript
// Frontend: js/donorDashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Redirect if not authenticated or wrong role
    if (!token || !user || user.role !== 'donor') {
        window.location.href = 'login.html';
        return;
    }
    
    initializeDashboard();
});
```

#### Step 2: Dashboard Setup
```javascript
function initializeDashboard() {
    setupNavigation();
    populateProfile();
    checkApprovalStatus();
    loadDonations();
    
    // Event listeners
    logoutBtn.addEventListener('click', handleLogout);
    pickupForm.addEventListener('submit', handlePickupSubmit);
    schedulePickupBtn.addEventListener('click', () => {
        navigateToSection('schedule-pickup');
    });
}
```

### 3.2 Navigation System
```javascript
// Frontend: Dynamic navigation
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.target;
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show target section
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId)?.classList.add('active');
            
            // Update page title
            pageTitle.textContent = item.textContent.trim();
        });
    });
}
```

### 3.3 Donation Form Processing

#### Step 1: Form Validation
```javascript
// Frontend: Form validation
function validateDonationForm(formData) {
    const errors = [];
    
    if (!formData.type) {
        errors.push('Please select food type');
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
        errors.push('Description must be at least 10 characters');
    }
    
    if (!formData.quantity || formData.quantity < 1) {
        errors.push('Quantity must be at least 1 kg');
    }
    
    if (!formData.pickupAddress || formData.pickupAddress.trim().length < 10) {
        errors.push('Please provide complete pickup address');
    }
    
    return errors;
}
```

#### Step 2: Form Submission
```javascript
// Frontend: Handle donation creation
async function handlePickupSubmit(event) {
    event.preventDefault();
    
    const formData = {
        type: document.getElementById('donationType').value,
        description: document.getElementById('description').value.trim(),
        quantity: parseInt(document.getElementById('quantity').value),
        pickupAddress: document.getElementById('pickupAddress').value.trim(),
        additionalGuidelines: document.getElementById('additionalGuidelines').value.trim()
    };
    
    // Validate form
    const errors = validateDonationForm(formData);
    if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/donor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create donation');
        }
        
        showNotification(data.message, 'success');
        
        // Reset form and refresh data
        document.getElementById('pickupForm').reset();
        loadDonations();
        navigateToSection('dashboard');
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}
```

### 3.4 Backend Donation Processing

#### Step 1: Authentication Middleware
```javascript
// middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
```

#### Step 2: Donation Creation
```javascript
// Backend: controllers/donorController.js
exports.createDonation = async (req, res) => {
    const { type, description, quantity, pickupAddress, additionalGuidelines } = req.body;
    const donorId = req.user.id;
    
    try {
        // Create new donation
        const newDonation = new Donation({
            donor: donorId,
            type,
            description,
            quantity,
            pickupAddress,
            additionalGuidelines,
            status: 'Pending',
            createdAt: new Date()
        });
        
        await newDonation.save();
        
        // Log activity
        const activity = new Activity({
            text: `New ${type} donation created by donor`,
            type: 'donation_created',
            userRef: donorId,
            donationRef: newDonation._id
        });
        await activity.save();
        
        // Populate donor information for response
        await newDonation.populate('donor', 'name email');
        
        res.status(201).json({ 
            message: 'Donation scheduled successfully!', 
            donation: newDonation 
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error.', 
            error: error.message 
        });
    }
};
```

### 3.5 Database Schema
```javascript
// models/Donation.js
const DonationSchema = new mongoose.Schema({
    donor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['human', 'animal', 'compost'], 
        required: true 
    },
    description: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    quantity: { 
        type: Number, 
        required: true,
        min: 1,
        max: 1000
    },
    pickupAddress: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 10
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'Picked Up', 'Delivered', 'Completed'],
        default: 'Pending'
    },
    additionalGuidelines: { 
        type: String, 
        trim: true,
        maxlength: 300
    },
    assignedVolunteer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    assignedReceiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    currentTask: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    qualityCheck: {
        condition: String,
        packaging: String,
        notes: String,
        checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        checkedAt: Date
    }
}, { 
    timestamps: true 
});
```

---

## 👨‍💼 Phase 4: Admin Assignment - Deep Dive

### 4.1 Admin Dashboard Data Loading

#### Step 1: Dashboard Statistics
```javascript
// Backend: controllers/adminController.js
exports.getDashboardStats = async (req, res) => {
    try {
        // Parallel queries for better performance
        const [
            totalUsers,
            totalDonations,
            pendingDonations,
            completedDonations,
            activeVolunteers,
            recentActivities
        ] = await Promise.all([
            User.countDocuments(),
            Donation.countDocuments(),
            Donation.countDocuments({ status: 'Pending' }),
            Donation.countDocuments({ status: 'Completed' }),
            User.countDocuments({ role: 'volunteer', status: 'approved' }),
            Activity.find().sort({ createdAt: -1 }).limit(10).populate('userRef', 'name')
        ]);
        
        // Calculate success rate
        const successRate = totalDonations > 0 ? 
            ((completedDonations / totalDonations) * 100).toFixed(1) : 0;
        
        res.status(200).json({
            totalUsers,
            totalDonations,
            pendingDonations,
            completedDonations,
            activeVolunteers,
            successRate,
            recentActivities
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching dashboard stats', 
            error: error.message 
        });
    }
};
```

#### Step 2: Pending Assignments View
```javascript
// Frontend: Load pending assignments
async function loadPendingAssignments() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/pending-assignments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayPendingAssignments(data.pendingDonations);
        }
        
    } catch (error) {
        console.error('Error loading pending assignments:', error);
    }
}

function displayPendingAssignments(donations) {
    const container = document.getElementById('pendingAssignments');
    
    if (donations.length === 0) {
        container.innerHTML = '<p>No pending assignments</p>';
        return;
    }
    
    container.innerHTML = donations.map(donation => `
        <div class="assignment-card" data-donation-id="${donation._id}">
            <div class="donation-info">
                <h4>${donation.description}</h4>
                <p><strong>Type:</strong> ${donation.type}</p>
                <p><strong>Quantity:</strong> ${donation.quantity} kg</p>
                <p><strong>Address:</strong> ${donation.pickupAddress}</p>
                <p><strong>Donor:</strong> ${donation.donor.name}</p>
            </div>
            <div class="assignment-actions">
                <button class="btn btn-primary" onclick="openAssignmentModal('${donation._id}')">
                    Assign
                </button>
            </div>
        </div>
    `).join('');
}
```

### 4.2 Smart Assignment Algorithm

#### Step 1: Available Resources Query
```javascript
// Backend: Get available volunteers and receivers
exports.getAvailableResources = async (req, res) => {
    const { donationType } = req.query;
    
    try {
        // Get available volunteers (not currently assigned)
        const availableVolunteers = await User.find({
            role: 'volunteer',
            status: 'approved'
        }).select('name email phone location');
        
        // Get suitable receivers based on donation type
        let receiverQuery = {
            role: 'receiver',
            status: 'approved'
        };
        
        // Add type-specific filtering if needed
        if (donationType === 'animal') {
            receiverQuery.receiverType = 'animal_shelter';
        } else if (donationType === 'compost') {
            receiverQuery.receiverType = 'composting_facility';
        }
        
        const availableReceivers = await User.find(receiverQuery)
            .select('name email phone address capacity');
        
        res.status(200).json({
            volunteers: availableVolunteers,
            receivers: availableReceivers
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching available resources', 
            error: error.message 
        });
    }
};
```

#### Step 2: Assignment Logic
```javascript
// Backend: Assign donation to volunteer and receiver
exports.assignDonation = async (req, res) => {
    const { donationId, volunteerId, receiverId, notes } = req.body;
    
    try {
        // Start transaction for data consistency
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            // Update donation
            const donation = await Donation.findByIdAndUpdate(
                donationId,
                {
                    assignedVolunteer: volunteerId,
                    assignedReceiver: receiverId,
                    status: 'Assigned',
                    assignedAt: new Date(),
                    assignmentNotes: notes
                },
                { new: true, session }
            ).populate('donor assignedVolunteer assignedReceiver');
            
            if (!donation) {
                throw new Error('Donation not found');
            }
            
            // Create task for volunteer
            const task = new Task({
                donation: donationId,
                volunteer: volunteerId,
                receiver: receiverId,
                status: 'Assigned',
                assignedBy: req.user.id,
                assignedAt: new Date()
            });
            
            await task.save({ session });
            
            // Update donation with task reference
            donation.currentTask = task._id;
            await donation.save({ session });
            
            // Log activity
            const activity = new Activity({
                text: `Donation assigned to ${donation.assignedVolunteer.name}`,
                type: 'donation_assigned',
                userRef: req.user.id,
                donationRef: donationId
            });
            
            await activity.save({ session });
            
            // Commit transaction
            await session.commitTransaction();
            
            // Send notifications (outside transaction)
            await sendAssignmentNotifications(donation);
            
            res.status(200).json({
                message: 'Donation assigned successfully',
                donation,
                task
            });
            
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error assigning donation', 
            error: error.message 
        });
    }
};
```

### 4.3 Notification System
```javascript
// Backend: Send assignment notifications
async function sendAssignmentNotifications(donation) {
    try {
        // Create notifications for volunteer and receiver
        const notifications = [
            {
                recipient: donation.assignedVolunteer._id,
                type: 'task_assigned',
                title: 'New Task Assigned',
                message: `You have been assigned to pick up ${donation.description}`,
                data: { donationId: donation._id }
            },
            {
                recipient: donation.assignedReceiver._id,
                type: 'delivery_scheduled',
                title: 'Delivery Scheduled',
                message: `A food donation will be delivered to you soon`,
                data: { donationId: donation._id }
            }
        ];
        
        await Notification.insertMany(notifications);
        
        // In a real application, you would also send:
        // - Email notifications
        // - SMS notifications
        // - Push notifications
        
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
}
```

---

## 🚚 Phase 5: Volunteer Operations - Deep Dive

### 5.1 Task Management

#### Step 1: Load Assigned Tasks
```javascript
// Backend: Get volunteer's assigned tasks
exports.getAssignedTasks = async (req, res) => {
    const volunteerId = req.user.id;
    
    try {
        const tasks = await Task.find({ 
            volunteer: volunteerId,
            status: { $in: ['Assigned', 'Accepted', 'Picked Up'] }
        })
        .populate({
            path: 'donation',
            populate: {
                path: 'donor assignedReceiver',
                select: 'name email phone'
            }
        })
        .sort({ assignedAt: -1 });
        
        res.status(200).json({ tasks });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching tasks', 
            error: error.message 
        });
    }
};
```

#### Step 2: Task Acceptance
```javascript
// Frontend: Accept task
async function acceptTask(taskId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/volunteer/tasks/${taskId}/accept`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Task accepted successfully!', 'success');
            loadTasks(); // Refresh task list
        } else {
            throw new Error(data.message);
        }
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}
```

### 5.2 Quality Check Process

#### Step 1: Quality Check Form
```javascript
// Frontend: Quality check form
function showQualityCheckForm(taskId) {
    const modal = document.getElementById('qualityCheckModal');
    const form = document.getElementById('qualityCheckForm');
    
    form.innerHTML = `
        <h3>Quality Check</h3>
        <div class="form-group">
            <label>Food Condition:</label>
            <select id="foodCondition" required>
                <option value="">Select condition</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Packaging Quality:</label>
            <select id="packagingQuality" required>
                <option value="">Select quality</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Temperature Check:</label>
            <select id="temperatureCheck" required>
                <option value="">Select status</option>
                <option value="appropriate">Appropriate</option>
                <option value="too_hot">Too Hot</option>
                <option value="too_cold">Too Cold</option>
                <option value="room_temp">Room Temperature</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Quantity Verification:</label>
            <input type="number" id="actualQuantity" placeholder="Actual quantity (kg)" required>
        </div>
        
        <div class="form-group">
            <label>Additional Notes:</label>
            <textarea id="qualityNotes" placeholder="Any concerns or observations"></textarea>
        </div>
        
        <div class="form-group">
            <label>
                <input type="checkbox" id="safetyConfirm" required>
                I confirm this food is safe for consumption
            </label>
        </div>
        
        <div class="form-actions">
            <button type="button" onclick="submitQualityCheck('${taskId}')" class="btn btn-primary">
                Confirm Pickup
            </button>
            <button type="button" onclick="rejectFood('${taskId}')" class="btn btn-danger">
                Reject Food
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}
```

#### Step 2: Quality Check Submission
```javascript
// Backend: Update task with quality check
exports.updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status, qualityCheck } = req.body;
    const volunteerId = req.user.id;
    
    try {
        // Find task and verify volunteer
        const task = await Task.findOne({ 
            _id: taskId, 
            volunteer: volunteerId 
        }).populate('donation');
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Update task status
        task.status = status;
        task.updatedAt = new Date();
        
        // Add status-specific data
        if (status === 'Picked Up' && qualityCheck) {
            task.qualityCheck = {
                condition: qualityCheck.condition,
                packaging: qualityCheck.packaging,
                temperature: qualityCheck.temperature,
                actualQuantity: qualityCheck.actualQuantity,
                notes: qualityCheck.notes,
                safetyConfirmed: qualityCheck.safetyConfirmed,
                checkedBy: volunteerId,
                checkedAt: new Date()
            };
            
            task.pickedUpAt = new Date();
        } else if (status === 'Delivered') {
            task.deliveredAt = new Date();
        }
        
        await task.save();
        
        // Update donation status
        await Donation.findByIdAndUpdate(task.donation._id, { 
            status: status,
            qualityCheck: task.qualityCheck
        });
        
        // Log activity
        const activity = new Activity({
            text: `Task status updated to ${status}`,
            type: 'task_updated',
            userRef: volunteerId,
            donationRef: task.donation._id
        });
        await activity.save();
        
        res.status(200).json({ 
            message: `Task status updated to ${status}`, 
            task 
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating task status', 
            error: error.message 
        });
    }
};
```

---

## 🏠 Phase 6: Receiver Operations - Deep Dive

### 6.1 Delivery Tracking

#### Step 1: Incoming Deliveries
```javascript
// Backend: Get receiver's incoming deliveries
exports.getIncomingDeliveries = async (req, res) => {
    const receiverId = req.user.id;
    
    try {
        const deliveries = await Donation.find({
            assignedReceiver: receiverId,
            status: { $in: ['Assigned', 'Picked Up'] }
        })
        .populate('donor assignedVolunteer', 'name email phone')
        .populate('currentTask')
        .sort({ assignedAt: -1 });
        
        res.status(200).json({ deliveries });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching deliveries', 
            error: error.message 
        });
    }
};
```

#### Step 2: Delivery Confirmation
```javascript
// Frontend: Confirm delivery receipt
async function confirmDelivery(donationId) {
    const feedback = document.getElementById('deliveryFeedback').value;
    const utilizationPlan = document.getElementById('utilizationPlan').value;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/receiver/confirm-delivery`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                donationId,
                feedback,
                utilizationPlan,
                receivedAt: new Date()
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Delivery confirmed successfully!', 'success');
            loadDeliveries(); // Refresh delivery list
            closeConfirmationModal();
        } else {
            throw new Error(data.message);
        }
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}
```

### 6.2 Impact Reporting
```javascript
// Backend: Confirm delivery and calculate impact
exports.confirmDelivery = async (req, res) => {
    const { donationId, feedback, utilizationPlan } = req.body;
    const receiverId = req.user.id;
    
    try {
        // Update donation status
        const donation = await Donation.findOneAndUpdate(
            { 
                _id: donationId, 
                assignedReceiver: receiverId 
            },
            {
                status: 'Completed',
                receiverFeedback: feedback,
                utilizationPlan: utilizationPlan,
                completedAt: new Date()
            },
            { new: true }
        ).populate('donor assignedVolunteer assignedReceiver');
        
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        // Update associated task
        await Task.findOneAndUpdate(
            { donation: donationId },
            { 
                status: 'Completed',
                completedAt: new Date()
            }
        );
        
        // Calculate impact metrics
        const impact = calculateImpact(donation);
        
        // Create impact record
        const impactRecord = new Impact({
            donation: donationId,
            donor: donation.donor._id,
            volunteer: donation.assignedVolunteer._id,
            receiver: receiverId,
            foodRescued: donation.quantity,
            mealsServed: impact.mealsServed,
            co2Saved: impact.co2Saved,
            completedAt: new Date()
        });
        
        await impactRecord.save();
        
        // Log completion activity
        const activity = new Activity({
            text: `Donation completed - ${impact.mealsServed} meals served`,
            type: 'donation_completed',
            userRef: receiverId,
            donationRef: donationId
        });
        await activity.save();
        
        res.status(200).json({
            message: 'Delivery confirmed successfully',
            donation,
            impact
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error confirming delivery', 
            error: error.message 
        });
    }
};

// Impact calculation helper
function calculateImpact(donation) {
    const mealsPerKg = donation.type === 'human' ? 2 : 0; // 2 meals per kg for human food
    const co2PerKg = 2.5; // 2.5 kg CO2 saved per kg of food rescued
    
    return {
        mealsServed: donation.quantity * mealsPerKg,
        co2Saved: donation.quantity * co2PerKg
    };
}
```

---

## 📊 Phase 7: Analytics & Reporting - Deep Dive

### 7.1 Real-time Dashboard Updates

#### Step 1: Live Statistics
```javascript
// Backend: Get comprehensive analytics
exports.getAnalytics = async (req, res) => {
    const { timeRange = '30d' } = req.query;
    
    try {
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(timeRange.replace('d', '')));
        
        // Parallel aggregation queries
        const [
            donationStats,
            userStats,
            impactStats,
            trendData
        ] = await Promise.all([
            // Donation statistics
            Donation.aggregate([
                { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalQuantity: { $sum: '$quantity' }
                    }
                }
            ]),
            
            // User statistics
            User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        total: { $sum: 1 },
                        approved: {
                            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                        }
                    }
                }
            ]),
            
            // Impact statistics
            Impact.aggregate([
                { $match: { completedAt: { $gte: startDate, $lte: endDate } } },
                {
                    $group: {
                        _id: null,
                        totalMeals: { $sum: '$mealsServed' },
                        totalCO2Saved: { $sum: '$co2Saved' },
                        totalFoodRescued: { $sum: '$foodRescued' }
                    }
                }
            ]),
            
            // Trend data (daily aggregation)
            Donation.aggregate([
                { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            day: { $dayOfMonth: '$createdAt' }
                        },
                        donations: { $sum: 1 },
                        quantity: { $sum: '$quantity' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
            ])
        ]);
        
        res.status(200).json({
            donationStats,
            userStats,
            impactStats: impactStats[0] || { totalMeals: 0, totalCO2Saved: 0, totalFoodRescued: 0 },
            trendData
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching analytics', 
            error: error.message 
        });
    }
};
```

#### Step 2: Frontend Chart Rendering
```javascript
// Frontend: Render analytics charts
function renderAnalytics(data) {
    // Donation status pie chart
    renderPieChart('donationStatusChart', {
        labels: data.donationStats.map(stat => stat._id),
        data: data.donationStats.map(stat => stat.count),
        title: 'Donation Status Distribution'
    });
    
    // Impact metrics cards
    updateMetricCard('totalMeals', data.impactStats.totalMeals);
    updateMetricCard('totalCO2Saved', data.impactStats.totalCO2Saved.toFixed(1));
    updateMetricCard('totalFoodRescued', data.impactStats.totalFoodRescued);
    
    // Trend line chart
    renderLineChart('trendChart', {
        labels: data.trendData.map(point => `${point._id.day}/${point._id.month}`),
        datasets: [
            {
                label: 'Donations',
                data: data.trendData.map(point => point.donations),
                borderColor: '#4CAF50'
            },
            {
                label: 'Quantity (kg)',
                data: data.trendData.map(point => point.quantity),
                borderColor: '#2196F3'
            }
        ]
    });
}
```

---

## 🧪 Phase 8: Testing Workflow - Deep Dive

### 8.1 Jest Backend Testing

#### Step 1: Test Setup
```javascript
// __tests__/api.test.js
const request = require('supertest');
const baseURL = 'http://localhost:4000';

// Global test variables
let donorToken;
let volunteerToken;
let donationId;

describe('ShareABite API Tests', () => {
    // Test execution order is important for data dependencies
});
```

#### Step 2: Authentication Tests
```javascript
// Test user registration
it('should register a new donor user', async () => {
    const uniqueEmail = `donor${Date.now()}@test.com`;
    
    const response = await request(baseURL)
        .post('/api/auth/register')
        .send({
            name: 'Test Donor',
            email: uniqueEmail,
            password: 'password123',
            role: 'donor',
            donorType: 'instant', // Auto-approved
            phone: '1234567890'
        });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User registered successfully! Please log in.');
});

// Test user login
it('should login with correct credentials', async () => {
    const email = `logintest${Date.now()}@test.com`;
    
    // Register user first
    await request(baseURL)
        .post('/api/auth/register')
        .send({
            name: 'Login Test Donor',
            email: email,
            password: 'password123',
            role: 'donor',
            donorType: 'instant'
        });

    // Now login
    const loginResponse = await request(baseURL)
        .post('/api/auth/login')
        .send({
            email: email,
            password: 'password123'
        });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body.user.email).toBe(email);
    
    // Store token for subsequent tests
    donorToken = loginResponse.body.token;
});
```

#### Step 3: Donation Operation Tests
```javascript
// Test donation creation
it('should create a new donation', async () => {
    const response = await request(baseURL)
        .post('/api/donor')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
            type: 'human',
            description: 'Fresh cooked rice and curry',
            quantity: 15,
            pickupAddress: '123 Main Street, Test City',
            additionalGuidelines: 'Please come before 6 PM'
        });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('donation');
    expect(response.body.donation.type).toBe('human');
    expect(response.body.donation.status).toBe('Pending');
    expect(response.body.donation.quantity).toBe(15);
    
    // Store donation ID for subsequent tests
    donationId = response.body.donation._id;
});

// Test donation history retrieval
it('should get donation history for donor', async () => {
    const response = await request(baseURL)
        .get('/api/donor')
        .set('Authorization', `Bearer ${donorToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Verify the created donation is in the history
    const createdDonation = response.body.find(d => d._id === donationId);
    expect(createdDonation).toBeDefined();
    expect(createdDonation.type).toBe('human');
});
```

### 8.2 Cypress Frontend Testing

#### Step 1: Test Configuration
```javascript
// cypress.config.js
module.exports = {
    e2e: {
        baseUrl: 'http://localhost:8080',
        supportFile: false,
        video: false,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        responseTimeout: 10000
    }
}
```

#### Step 2: Basic UI Tests
```javascript
// cypress/e2e/basic-test.cy.js
describe('Basic ShareABite Tests', () => {
    
    it('should load the homepage', () => {
        cy.visit('/index.html')
        cy.contains('ShareABite').should('be.visible')
        cy.get('nav').should('be.visible')
        cy.get('footer').should('be.visible')
    })

    it('should load the login page', () => {
        cy.visit('/login.html')
        cy.get('#email').should('exist')
        cy.get('#password').should('exist')
        cy.get('#userType').should('exist')
        cy.get('button[type="submit"]').should('be.visible')
    })

    it('should complete full login flow', () => {
        // Clear browser state
        cy.clearAllLocalStorage()
        cy.clearAllCookies()
        
        // Navigate to login
        cy.visit('/login.html')
        cy.wait(2000) // Wait for page initialization
        
        // Fill login form
        cy.get('#email').type('testdonor@example.com', { delay: 100 })
        cy.get('#password').type('password123', { delay: 100 })
        cy.get('#userType').select('donor')
        
        // Submit form
        cy.get('button[type="submit"]').click()
        
        // Wait for redirect and verify
        cy.wait(5000)
        cy.url().should('match', /Dashboard\.html/)
    })
})
```

#### Step 3: Advanced Workflow Tests
```javascript
// cypress/e2e/donation-workflow.cy.js
describe('Complete Donation Workflow', () => {
    
    beforeEach(() => {
        // Login before each test
        cy.clearAllLocalStorage()
        cy.clearAllCookies()
        cy.visit('/login.html')
        cy.get('#email').type('testdonor@example.com')
        cy.get('#password').type('password123')
        cy.get('#userType').select('donor')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', 'donorDashboard.html')
        cy.wait(3000)
    })

    it('should create a complete donation', () => {
        // Navigate to donation form
        cy.get('[data-target="schedule-pickup"]').click({ force: true })
        cy.wait(1000)
        
        // Fill donation form
        cy.get('#donationType').select('human', { force: true })
        cy.get('#description').clear({ force: true }).type('Cypress test donation - fresh meals', { force: true })
        cy.get('#quantity').clear({ force: true }).type('20', { force: true })
        cy.get('#pickupAddress').clear({ force: true }).type('123 Cypress Test Street, Test City', { force: true })
        cy.get('#additionalGuidelines').clear({ force: true }).type('Test guidelines from Cypress', { force: true })
        
        // Submit form
        cy.get('#pickupForm button[type="submit"]').click({ force: true })
        
        // Verify success
        cy.get('#notification', { timeout: 10000 }).should('be.visible')
        
        // Verify donation appears in history
        cy.get('[data-target="donation-history"]').click({ force: true })
        cy.wait(2000)
        cy.contains('Cypress test donation').should('be.visible')
    })
})
```

---

## 🔄 Complete System Integration

### Integration Flow Summary:
1. **Frontend** sends HTTP requests
2. **Authentication middleware** validates JWT tokens
3. **Route handlers** process business logic
4. **Database operations** persist/retrieve data
5. **Response** sent back to frontend
6. **UI updates** reflect new state
7. **Notifications** inform relevant users
8. **Analytics** track system metrics

### Data Flow Example:
```
User Action (Create Donation)
    ↓
Frontend Form Submission
    ↓
HTTP POST /api/donor
    ↓
JWT Authentication Middleware
    ↓
Donation Controller
    ↓
MongoDB Save Operation
    ↓
Activity Logging
    ↓
Success Response
    ↓
Frontend UI Update
    ↓
Admin Notification
    ↓
Dashboard Statistics Update
```

This detailed workflow demonstrates how ShareABite seamlessly integrates all components to create a robust, tested, and user-friendly food donation platform that effectively addresses food waste while feeding communities in need.
