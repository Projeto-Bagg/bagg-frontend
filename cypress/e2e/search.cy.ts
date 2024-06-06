describe('Página de pesquisa', () => {
  it('Manter texto de pesquisa ao atualizar página', () => {
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

  describe('Pesquisa de tips', () => {
    beforeEach(() => {
      cy.visit('/search');
    });

    it('Inserindo tag', () => {
      cy.get('[name="tags"]').type('test{enter}test2{enter}test3{enter}');
      cy.url().should('contain', 'test;test2;test3'.replaceAll(';', '%3B'));
    });

    it('Remover tag', () => {
      cy.get('[name="tags"]').type('test{enter}test2{enter}test3{enter}');
      cy.get('[data-test="remove-tag-test"]').click();
      cy.url().should('contain', 'test2;test3'.replaceAll(';', '%3B'));
    });

    it('Manter tags ao atualizar página', () => {
      cy.visit('/search?tags=tag;tag2;tag3');

      cy.get('[data-test="tag-tag"]').should('be.visible');
      cy.get('[data-test="tag-tag2"]').should('be.visible');
      cy.get('[data-test="tag-tag3"]').should('be.visible');
    });

    it('Inserir país', () => {
      cy.fixture('city-search.json')
        .then((citySearch) => {
          cy.intercept(
            {
              method: 'GET',
              url: '/cities/search?q=S%C3%A3o+Sebasti%C3%A3o&count=5',
            },
            {
              statusCode: 200,
              body: citySearch,
            },
          );
        })
        .as('city-search');

      cy.get('[data-test="select-city"]').click();
      cy.get('[cmdk-input]').type('São Sebastião');
      cy.wait('@city-search');
      cy.get('[data-value=166148]').click();

      cy.url().should('contain', 'city=166148');
    });

    it('Remover país', () => {
      cy.fixture('city-search.json')
        .then((citySearch) => {
          cy.intercept(
            {
              method: 'GET',
              url: '/cities/search?q=S%C3%A3o+Sebasti%C3%A3o&count=5',
            },
            {
              statusCode: 200,
              body: citySearch,
            },
          );
        })
        .as('city-search');

      cy.get('[data-test="select-city"]').click();
      cy.get('[cmdk-input]').type('São Sebastião');
      cy.wait('@city-search');
      cy.get('[data-value=166148]').click();

      cy.get('[data-test="select-city"]').click();
      cy.get('[data-test="remove-selected-city"]').click();
      cy.url().should('not.contain', 'city=166148');
    });

    it('Manter país ao atualizar página', () => {
      cy.visit('search?city=166148');

      cy.fixture('city.json')
        .then((citySearch) => {
          cy.intercept(
            {
              method: 'GET',
              url: '/cities/166148',
            },
            {
              statusCode: 200,
              body: citySearch,
            },
          );
        })
        .as('city-search');

      cy.get('[data-test="select-city"]').should('contain', 'São Sebastião');
    });
  });
});
