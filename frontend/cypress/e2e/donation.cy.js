describe('Anna Setu - Donor Donation Flow', () => {
  
  beforeEach(() => {
    // Login before each test
    cy.visit('/login.html')
    cy.get('#email').clear().type('testdonor@example.com')
    cy.get('#password').clear().type('password123')
    cy.get('#userType').select('donor')
    cy.get('button[type="submit"]').click()
    
    // Wait for dashboard to load
    cy.url({ timeout: 10000 }).should('include', 'donorDashboard.html')
    cy.wait(3000) // Wait for dashboard to fully initialize
  })

  it('should navigate to schedule pickup page', () => {
    // Click on Schedule Pickup in sidebar
    cy.get('.nav-item[data-target="schedule-pickup"]').click({ force: true })
    cy.wait(1000)
    
    // Verify form is visible
    cy.get('#pickupForm').should('be.visible')
  })

  it('should create a new donation successfully', () => {
    // Navigate to schedule pickup
    cy.get('.nav-item[data-target="schedule-pickup"]').click({ force: true })
    cy.wait(1500)
    
    // Fill out the donation form
    cy.get('#donationType').select('human', { force: true })
    cy.get('#description').clear({ force: true }).type('Fresh cooked rice and curry', { force: true })
    cy.get('#quantity').clear({ force: true }).type('15', { force: true })
    cy.get('#pickupAddress').clear({ force: true }).type('123 Main Street, Test City', { force: true })
    cy.get('#additionalGuidelines').clear({ force: true }).type('Please come before 6 PM', { force: true })
    
    // Submit the form
    cy.get('#pickupForm button[type="submit"]').click({ force: true })
    
    // Verify success notification appears
    cy.get('#notification', { timeout: 10000 }).should('be.visible')
  })

  it('should display recent donations on dashboard', () => {
    // Make sure we're on dashboard
    cy.get('.nav-item[data-target="dashboard"]').click({ force: true })
    cy.wait(1000)
    
    // Dashboard should show recent donations
    cy.get('#recentDonationsList').should('exist')
  })

  it('should view full donation history', () => {
    // Navigate to donation history
    cy.get('.nav-item[data-target="donation-history"]').click({ force: true })
    cy.wait(1500)
    
    // Verify history section is visible
    cy.get('#fullDonationHistory').should('be.visible')
  })

  it('should view profile information', () => {
    // Navigate to profile
    cy.get('.nav-item[data-target="profile"]').click({ force: true })
    cy.wait(1500)
    
    // Verify profile section is visible
    cy.get('#profile').should('be.visible')
    cy.get('#profileEmail').should('exist')
  })
})
