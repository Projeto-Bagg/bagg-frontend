describe('Home', () => {
  it('Redirecionar para página inicial caso deslogado', () => {
    cy.visit('/home');

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Alterar feed', () => {
    cy.login();
    cy.visit('/home');

    cy.get('[data-test="following"]').click();

    cy.get('[data-test="following"]').should('have.data', 'state', 'active');

    cy.getCookie('bagg.default-feed').should('have.property', 'value', 'following');
  });

  it('Manter estado do feed', () => {
    cy.login();
    cy.visit('/home');
    cy.setCookie('bagg.default-feed', 'following');

    cy.get('[data-test="following"]').should('have.data', 'state', 'active');
  });
});
