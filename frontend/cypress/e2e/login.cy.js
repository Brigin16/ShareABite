describe('Anna Setu - Login Flow', () => {
  
  it('should load the login page', () => {
    cy.visit('/login.html')
    cy.contains('Login').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('should login successfully with valid credentials', () => {
    cy.visit('/login.html')
    
    // Fill in login form
    cy.get('#email').type('testdonor@example.com')
    cy.get('#password').type('password123')
    cy.get('#userType').select('donor')
    
    // Submit form
    cy.get('button[type="submit"]').click()
    
    // Verify successful login - should redirect to donorDashboard.html
    cy.url({ timeout: 10000 }).should('include', 'donorDashboard.html')
  })

  it('should show error for invalid credentials', () => {
    cy.visit('/login.html')
    
    cy.get('#email').type('wrong@example.com')
    cy.get('#password').type('wrongpassword')
    cy.get('#userType').select('donor')
    cy.get('button[type="submit"]').click()
    
    // Verify error message appears in notification
    cy.get('#notification', { timeout: 5000 }).should('be.visible').and('contain', 'Invalid')
  })
})
