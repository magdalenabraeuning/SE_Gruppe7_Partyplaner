//Remember to start first the cypress testrunner and the local development server (ionic serve)

describe('The Home Page', () => {
    it('successfully loads', () => {
      cy.visit('/') 
    })
  })