const request = require('supertest');
const baseURL = 'http://localhost:4000';

// Store tokens and IDs for use across tests
let donorToken;
let volunteerToken;
let donationId;

describe('Anna Setu API Tests', () => {
  
  // Test 1: Register User
  describe('POST /api/auth/register', () => {
    it('should register a new donor user', async () => {
      const response = await request(baseURL)
        .post('/api/auth/register')
        .send({
          name: 'Test Donor',
          email: `donor${Date.now()}@test.com`,
          password: 'password123',
          role: 'donor',
          donorType: 'instant', // Instant donors are auto-approved
          phone: '1234567890'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User registered successfully! Please log in.');
    });
  });

  // Test 2: Login User
  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      // First register an instant donor (auto-approved)
      const email = `logintest${Date.now()}@test.com`;
      await request(baseURL)
        .post('/api/auth/register')
        .send({
          name: 'Login Test Donor',
          email: email,
          password: 'password123',
          role: 'donor',
          donorType: 'instant', // Auto-approved
          phone: '9876543210'
        });

      // Now login with those credentials
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
      
      // Save donor token for later tests
      donorToken = loginResponse.body.token;
    });
  });

  // Test 3: Create Donation
  describe('POST /api/donor', () => {
    it('should create a new donation', async () => {
      const response = await request(baseURL)
        .post('/api/donor')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          type: 'human',
          description: 'Cooked rice and curry',
          quantity: 10,
          pickupAddress: '123 Test Street, Test City',
          additionalGuidelines: 'Handle with care'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('donation');
      expect(response.body.donation.type).toBe('human');
      expect(response.body.donation.status).toBe('Pending');
      expect(response.body.donation.quantity).toBe(10);
      
      // Save donation ID for reference
      donationId = response.body.donation._id;
    });
  });

  // Test 4: Get Donor History
  describe('GET /api/donor', () => {
    it('should get donation history for donor', async () => {
      const response = await request(baseURL)
        .get('/api/donor')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Should include the donation we just created
      expect(response.body.length).toBeGreaterThan(0);
      // Verify the donation we created is in the history
      const createdDonation = response.body.find(d => d._id === donationId);
      expect(createdDonation).toBeDefined();
      expect(createdDonation.type).toBe('human');
    });
  });

});
