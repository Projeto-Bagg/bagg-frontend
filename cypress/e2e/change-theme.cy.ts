describe('Trocar tema', () => {
  it('Trocar para claro', () => {
    cy.visit('/');
    cy.get('#theme-toggle').click();
    cy.get('#light').click();

    cy.get('html').should('have.class', 'light');
  });

  it('Trocar para escuro', () => {
    cy.visit('/');
    cy.get('#theme-toggle').click();
    cy.get('#dark').click();

    cy.get('html').should('have.class', 'dark');
  });
});
