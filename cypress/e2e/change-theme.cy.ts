describe('Trocar tema', () => {
  it('Trocar para claro', () => {
    cy.visit('/');
    cy.get('[data-test="theme-toggle"]').click();
    cy.get('[data-test="light"]').click();

    cy.get('html').should('have.class', 'light');
  });

  it('Trocar para escuro', () => {
    cy.visit('/');
    cy.get('[data-test="theme-toggle"]').click();
    cy.get('[data-test="dark"]').click();

    cy.get('html').should('have.class', 'dark');
  });
});
