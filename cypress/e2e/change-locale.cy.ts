describe('Trocar língua', () => {
  it('Trocar para inglês', () => {
    cy.visit('/');
    cy.get('[data-test="locale-select"]').click();
    cy.get('[data-test="en"]').click();

    cy.url().should('contain', 'en');
  });

  it('Trocar para português', () => {
    cy.visit('/en');
    cy.get('[data-test="locale-select"]').click();
    cy.get('[data-test="pt"]').click();

    cy.url().should('contain', 'pt');
  });
});
