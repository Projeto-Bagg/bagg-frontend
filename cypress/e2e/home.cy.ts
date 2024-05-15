describe('Home', () => {
  it('Redirecionar para página inicial caso deslogado', () => {
    cy.visit('/home');

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.url().should('eq', Cypress.config().baseUrl);
  });
});
