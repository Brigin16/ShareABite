describe('Simple Donation Test', () => {
  
  beforeEach(() => {
    // Clear all storage before each test
    cy.clearLocalStorage()
    cy.clearCookies()
  })
  
  it('should create a donation after login', () => {
    // Login first
    cy.visit('/login.html')
    cy.wait(1000)
    
    cy.get('#email').clear().type('testdonor@example.com')
    cy.get('#password').clear().type('password123')
    cy.get('#userType').select('donor')
    cy.get('button[type="submit"]').click()
    
    // Wait for redirect
    cy.url({ timeout: 15000 }).should('include', 'donorDashboard.html')
    cy.wait(3000) // Wait for dashboard to fully load
    
    // Try to find and click schedule pickup
    cy.get('a').contains('Schedule Pickup').click({ force: true })
    cy.wait(2000)
    
    // Fill form
    cy.get('#donationType').should('be.visible').select('human', { force: true })
    cy.get('#description').clear({ force: true }).type('Test donation from Cypress', { force: true })
    cy.get('#quantity').clear({ force: true }).type('10', { force: true })
    cy.get('#pickupAddress').clear({ force: true }).type('Test Address 123', { force: true })
    
    // Submit
    cy.get('#pickupForm button[type="submit"]').click({ force: true })
    
    // Check for notification
    cy.get('#notification', { timeout: 10000 }).should('exist')
  })
})
