describe('Trocar língua', () => {
  it('Trocar para inglês', () => {
    cy.visit('/');
    cy.get('#locale-select').click();
    cy.get('#en').click();

    cy.url().should('contain', 'en');
  });

  it('Trocar para português', () => {
    cy.visit('/en');
    cy.get('#locale-select').click();
    cy.get('#pt').click();

    cy.url().should('contain', 'pt');
  });
});
