describe('Ranking', () => {
  describe('Países', () => {
    it('Mudar ranking para visitas', () => {
      cy.visit('/ranking/country/rating');

      cy.get('[data-test="visits"]').click();

      cy.url().should('contain', '/ranking/country/visits');
    });

    it('Mudar filtro de data', () => {
      cy.visit('/ranking/country/rating');

      cy.get('[data-test="change-data-preset"]').click();

      cy.get('[role="option"]').eq(0).click();

      cy.url().should('contain', 'date=7');
    });

    it('Persistir filtro de data ao mudar para visitas', () => {
      cy.visit('/ranking/country/rating');

      cy.get('[data-test="change-data-preset"]').click();
      cy.get('[role="option"]').eq(0).click();
      cy.url().should('contain', 'date=7');

      cy.get('[data-test="visits"]').click();
      cy.url().should('contain', '/ranking/country/visits?date=7');
    });
  });

  describe('Cidades', () => {
    it('Mudar ranking para visitas', () => {
      cy.visit('/ranking/city/rating');

      cy.get('[data-test="visits"]').click();

      cy.url().should('contain', '/ranking/city/visits');
    });

    it('Mudar filtro de data', () => {
      cy.visit('/ranking/city/rating');

      cy.get('[data-test="change-data-preset"]').click();

      cy.get('[role="option"]').eq(0).click();

      cy.url().should('contain', 'date=7');
    });

    it('Mudar país', () => {
      cy.visit('/ranking/city/rating');

      cy.fixture('countries.json').then((countries) => {
        cy.intercept('GET', '/countries', {
          body: countries,
          statusCode: 200,
        });
      });

      cy.get('[data-test="select-country"]').click();
      cy.get('[role="option"]').eq(1).click();
      cy.url().should('contain', 'countryIso2=AF');
    });

    it('Persistir filtros ao mudar para visitas', () => {
      cy.visit('/ranking/city/rating');

      cy.fixture('countries.json').then((countries) => {
        cy.intercept('GET', '/countries', {
          body: countries,
          statusCode: 200,
        });
      });

      cy.get('[data-test="change-data-preset"]').click();
      cy.get('[role="option"]').eq(0).click();
      cy.url().should('contain', 'date=7');

      cy.get('[data-test="select-country"]').click();
      cy.get('[role="option"]').eq(1).click();
      cy.url().should('contain', 'countryIso2=AF');

      cy.get('[data-test="visits"]').click();
      cy.url().should('contain', '/ranking/city/visits?date=7&countryIso2=AF');
    });
  });
});
