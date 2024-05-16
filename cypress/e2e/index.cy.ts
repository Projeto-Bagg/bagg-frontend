describe('Página inicial', () => {
  it('Redirecionar para feed caso logado', () => {
    cy.login();
    cy.visit('/');

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.url().should('contain', 'home');
  });
});
