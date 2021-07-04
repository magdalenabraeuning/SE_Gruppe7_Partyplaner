

describe('The Login Page', () => {
  
    it('just log in', function () {
        // auf die Loginseite kommen 
        cy.visit('/')

      // destructuring assignment of the this.currentUser object
      const { username, password } = { username:'ninamagdatestuser@gmx.de', password: 'NinaMagdaTestuser'}

      cy.get('input#ui-sign-in-email-input.mdl-textfield__input.firebaseui-input.firebaseui-id-email')
        .wait(1000) // have to wait until everything finished loading, because if not it interups the type() command
        .clear()
        .type(username) 
        .should("have.value", username) //Errorhandling um zu schauen obs fertig getippt hat        

      cy.get('button').click()
      cy.wait(1000)
  
      cy.get('input#ui-sign-in-password-input.mdl-textfield__input.firebaseui-input.firebaseui-id-password')
        .clear()
        .type('{downarrow}')
        .type(password)
        .wait(1000)
        .should("have.value", password)

      cy.get('button').click() 
      cy.wait(1000)

      // we should be redirected to /home
      cy.url().should('include', '/home')
  
      // UI should reflect this user being logged in
      cy.get('h1').should('contain', 'Test User')
    })
  })