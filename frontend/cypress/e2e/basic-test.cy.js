describe('Basic ShareABite Tests', () => {
  
  it('should load the homepage', () => {
    cy.visit('/index.html')
    cy.contains('ShareABite').should('be.visible')
  })

  it('should load the login page', () => {
    cy.visit('/login.html')
    cy.get('#email').should('exist')
    cy.get('#password').should('exist')
  })

  it('should complete full login flow', () => {
    // Clear everything first
    cy.clearAllLocalStorage()
    cy.clearAllCookies()
    
    // Visit login page
    cy.visit('/login.html')
    cy.wait(2000)
    
    // Fill form
    cy.get('#email').type('testdonor@example.com', { delay: 100 })
    cy.get('#password').type('password123', { delay: 100 })
    cy.get('#userType').select('donor')
    
    // Submit
    cy.get('button[type="submit"]').click()
    
    // Wait for redirect (be patient)
    cy.wait(5000)
    
    // Check if we're on dashboard (any dashboard page is success)
    cy.url().should('match', /Dashboard\.html/)
  })
})
