describe('Página da cidade deslogado', () => {
  beforeEach(() => {
    cy.fixture('city.json').then((city) => {
      cy.intercept('GET', '/cities/166148', {
        statusCode: 200,
        body: city,
      }).as('city');
    });

    cy.visit('/city/166148', { failOnStatusCode: false });

    cy.wait('@city');
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
});

describe('Página da cidade logado', () => {
  beforeEach(() => {
    cy.login();

    cy.fixture('city.json').then((city) => {
      cy.intercept('GET', '/cities/166148', {
        statusCode: 200,
        body: city,
      });
    });

    cy.intercept('GET', '/city-visits/166148', {
      statusCode: 200,
      body: [],
    }).as('get-reviews');

    cy.intercept('GET', '/cities/166148/images ', {
      statusCode: 200,
      body: [],
    }).as('get-images');

    cy.visit('/city/166148', { failOnStatusCode: false });
  });

  it('Marcando visita', () => {
    cy.fixture('city-visit.json').then((cityVisit) => {
      cy.intercept(
        { method: 'POST', url: '/city-visits' },
        {
          statusCode: 200,
          body: cityVisit,
        },
      ).as('city-visits');
    });
    cy.get('#check-visit').click();
    cy.wait('@city-visits');
    cy.get('#check-visit').children('svg').should('have.class', 'text-blue-400');
  });

  it('Marcando interesse', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/city-interests/166148',
      },
      {},
    ).as('city-interests');

    cy.get('#check-interest').click();
    cy.wait('@city-interests');
    cy.get('#check-interest').children('svg').should('have.class', 'text-green-400');
  });

  it('Marcando nota', () => {
    cy.fixture<CityVisit>('city-visit.json').then((cityVisit) => {
      cy.intercept(
        {
          method: 'POST',
          url: '/city-visits',
        },
        {
          statusCode: 200,
          body: {
            ...cityVisit,
            rating: 3,
          },
        },
      ).as('city-visits');
    });

    cy.get('[role=radiogroup]').children('[aria-label="Rate 3"]').click();

    cy.wait('@city-visits');

    cy.get('[role=radiogroup]')
      .children('[aria-label="Rate 3"]')
      .should('have.class', 'rr--on');

    cy.get('#check-visit').children('svg').should('have.class', 'text-blue-400');
  });

  it('Criando avaliação', () => {
    cy.fixture<CityVisit>('city-visit.json').then((cityVisit) => {
      cy.intercept(
        {
          method: 'POST',
          url: '/city-visits',
        },
        {
          statusCode: 200,
          body: {
            ...cityVisit,
            rating: 3,
            message: 'teste',
          },
        },
      ).as('city-visits');
    });

    cy.get('#create-city-visit').click();

    cy.get('[name="message"]').type('test');

    cy.get('[role=dialog]').find('[aria-label="Rate 4"]').click();

    cy.get('#create-city-visit-form').submit();

    cy.wait('@city-visits');

    cy.get('[data-test="city-visits"]').children().should('contain.text', 'teste');
  });

  it('Desmarcando visita com avaliação já preenchida', () => {
    cy.fixture('city.json').then((city) => {
      cy.intercept('GET', '/cities/166148', {
        statusCode: 200,
        body: {
          ...city,
          userVisit: {
            id: 1,
            message: 'test',
            rating: 4,
            createdAt: '2024-03-30T21:15:30.544Z',
            userId: 1,
          },
        },
      });
    });

    cy.get('#check-visit').click();

    cy.get('#toasts').children().should('have.length', 1);
  });
});
