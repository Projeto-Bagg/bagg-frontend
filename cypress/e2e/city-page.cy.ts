describe('Página da cidade', () => {
  beforeEach(() => {
    cy.visit('/city/166148', { failOnStatusCode: false });
  });

  it('Erro na criação de visita deslogado', () => {
    cy.get('#check-visit').click();
    cy.wait(500);
    cy.url().should('contain', 'login');
  });

  it('Erro na criação de interesse deslogado', () => {
    cy.get('#check-interest').click();
    cy.wait(200);
    cy.url().should('contain', 'login');
  });

  it('Erro na atribuição de nota deslogado', () => {
    cy.get('[role=radiogroup]').children('[aria-label="Rate 1"]').click();
    cy.wait(200);
    cy.url().should('contain', 'login');
  });

  it('Erro na criação de avaliação deslogado', () => {
    cy.get('#create-city-visit').click();
    cy.wait(200);
    cy.url().should('contain', 'login');
  });

  it('Marcando visita', () => {
    cy.login();
    cy.intercept(
      { method: 'POST', url: 'http://localhost:3001/city-visits' },
      {
        body: {
          cityId: 166148,
        },
      },
    ).as('city-visits');
    cy.visit('/city/166148', { failOnStatusCode: false });
    cy.get('#check-visit').click();
    cy.wait('@city-visits');
    cy.get('#check-visit').children('svg').should('have.class', 'text-blue-400');
  });

  it('Marcando interesse', () => {
    cy.login();
    cy.intercept(
      {
        method: 'POST',
        url: 'http://localhost:3001/city-interests/166148',
      },
      {},
    ).as('city-interests');
    cy.visit('/city/166148', { failOnStatusCode: false });
    cy.get('#check-interest').click();
    cy.wait('@city-interests');
    cy.get('#check-interest').children('svg').should('have.class', 'text-green-400');
  });
});
