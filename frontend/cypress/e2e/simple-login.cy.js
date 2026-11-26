describe('Simple Login Test', () => {
  
  beforeEach(() => {
    // Clear all storage before each test
    cy.clearLocalStorage()
    cy.clearCookies()
  })
  
  it('should load the login page', () => {
    cy.visit('/login.html')
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#userType').should('be.visible')
  })

  it('should login successfully', () => {
    cy.visit('/login.html')
    
    // Wait for page to fully load
    cy.wait(1000)
    
    cy.get('#email').clear().type('testdonor@example.com')
    cy.get('#password').clear().type('password123')
    cy.get('#userType').select('donor')
    cy.get('button[type="submit"]').click()
    
    // Verify we're redirected to donor dashboard
    cy.url({ timeout: 15000 }).should('include', 'donorDashboard.html')
  })
})
