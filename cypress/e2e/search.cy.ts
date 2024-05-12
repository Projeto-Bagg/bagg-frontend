describe('Página de pesquisa', () => {
  it('Manutenção do estado de pesquisa por parâmetros da url', () => {
    cy.visit('/search/country?q=teste');
    cy.get('input').should('have.value', 'teste');
    cy.get('[data-test="search-country-link"]').should('have.class', 'border-blue-600');
  });

  it('Inserindo texto', () => {
    cy.visit('/search');
    cy.get('[data-test="search-input"]').type('teste');
    cy.wait(1000);
    cy.url().should('eq', Cypress.config().baseUrl + 'search?q=teste');
  });

  it('Alterando fator de pesquisa', () => {
    cy.visit('/search');
    cy.get('[data-test="search-country-link"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + 'search/country');
    cy.get('[data-test="search-country-link"]').should('have.class', 'border-blue-600');
  });

  it('Alterando fator de pesquisa com texto', () => {
    cy.visit('/search');
    cy.get('[data-test="search-input"]').type('teste');
    cy.wait(1000);
    cy.url().should('eq', Cypress.config().baseUrl + 'search?q=teste');
    cy.get('[data-test="search-country-link"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + 'search/country?q=teste');
    cy.get('[data-test="search-country-link"]').should('have.class', 'border-blue-600');
  });

  it('Pesquisa sem resultados', () => {
    cy.intercept('GET', '/users/search?q=teste&count=50&page=1', {
      body: [],
      statusCode: 200,
    });

    cy.visit('/search/user');
    cy.get('[data-test="search-input"]').type('teste');
    cy.wait(1000);
    cy.url().should('eq', Cypress.config().baseUrl + 'search/user?q=teste');
    cy.get('[data-test="no-results"]').should('be.visible');
  });

  it('Pesquisa com resultados', () => {
    cy.fixture('city-search.json').then((citySearch) => {
      cy.intercept('GET', '/cities/search?q=S%C3%A3o+Sebasti%C3%A3o&count=50&page=1', {
        body: citySearch,
        statusCode: 200,
      });
    });

    cy.visit('/search/city');
    cy.get('[data-test="search-input"]').type('São Sebastião');
    cy.wait(1000);
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + 'search/city?q=S%C3%A3o+Sebasti%C3%A3o',
    );

    cy.get('[data-test="cities"]').children().should('have.length', 5);
  });
});
