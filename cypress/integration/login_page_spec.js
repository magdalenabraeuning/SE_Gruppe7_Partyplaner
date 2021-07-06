

describe('The Login Page', () => {
  
    it('just log in', function () {
        // visit the startpage - if not loged in login will appear
        cy.visit('/')

       // not the clean way to test this, but everything else would have taken a huge amount of time 
       // for example we could have used the Google Authetication API, wich is not easy to handle
      const { username, password } = { username:'ninamagdatestuser@gmx.de', password: 'NinaMagdaTestuser'}

      cy.get('input#ui-sign-in-email-input.mdl-textfield__input.firebaseui-input.firebaseui-id-email')
        .wait(1000) // have to wait until everything finished loading, because if not incoming XHR requests interupt the type() command
        .clear()
        .type(username) 
        .should("have.value", username) //to check if type finished successful         

      cy.get('button').click()
      cy.wait(2000)
  
      cy.get('input#ui-sign-in-password-input.mdl-textfield__input.firebaseui-input.firebaseui-id-password')
        .clear()
        .type(password)
        .should("have.value", password)

      cy.get('button').click() 
      cy.wait(1000) //just to make sure the test dont fails just because it take a second more to load 

      // we should be redirected to /home
      cy.url().should('include', '/partys')
  
      // UI should reflect this user being logged in
      cy.get('h1').should('contain', 'Test User')
    })

    it('just log out', function () {

        cy.visit('/partys')

        cy.get('[id^=signoutbttn]')
          .wait(3000)
          .click()
        
        cy.url().should('include', '/home') 
        })
        
  })