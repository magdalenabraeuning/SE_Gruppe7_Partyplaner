describe('Info Page', () => {
    it('check party information', function () {
      
      cy.visit('/partys')
      cy.wait(10000)

      const {partyCard} = {partyCard: "Details"}

      // Click on a Party 
      cy.get('ion-label')
        .click()
        .wait(2000)

      cy.url().should('include', '/info') 

      // Check if the Partydetails are visible
      cy.get('[id^=details]')
        .wrap({ foo: partyCard })
        .its('foo').should('eq', partyCard)
    })
  })