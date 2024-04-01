describe('Perfil', () => {
  it('Editar perfil', () => {
    const newData = {
      fullName: 'Modified name',
      bio: 'Modified bio',
      city: {
        id: 166148,
        name: 'São Sebastião',
        regionId: 5593,
        latitude: -23.76,
        longitude: -45.40972,
        region: {
          id: 5593,
          name: 'São Paulo',
          countryId: 282,
          latitude: -23.5505199,
          longitude: -46.6333094,
          stateCode: 'SP',
          type: null,
          country: {
            id: 282,
            name: 'Brazil',
            iso2: 'BR',
            capital: 'Brasilia',
            latitude: -10,
            longitude: -55,
          },
        },
      },
    };

    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', '/users/teste', user);
    });

    cy.fixture('user.json').then((user) => {
      cy.intercept('PUT', '/users', {
        body: {
          ...user,
          ...newData,
        },
      });
    });

    cy.fixture('city-search.json')
      .then((citySearch) => {
        cy.intercept('GET', '/cities/search?q=S%C3%A3o+Sebasti%C3%A3o&count=5', {
          body: citySearch,
        });
      })
      .as('city-search');

    cy.login();

    cy.visit('/teste');

    cy.get('[data-test="settings"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + 'pt/teste/settings/profile');

    cy.get('[name="fullName"]').clear().type(newData.fullName);
    cy.get('[name="bio"]').clear().type(newData.bio);
    cy.get('[data-test="select-city"]').click();
    cy.get('[cmdk-input]').type(newData.city.name);
    cy.wait('@city-search');
    cy.get('[data-value=166148]').click();

    cy.get('form').submit();

    cy.get('[data-test="fullName"]').should('have.text', newData.fullName);
    cy.get('[data-test="bio"]').should('have.text', newData.bio);
    cy.get('[data-test="city"]').should('contain.text', newData.city.name);
  });

  it('Seguir deslogado', () => {
    cy.fixture('user2.json').then((user2) => {
      cy.intercept('GET', '/users/teste2', user2);
    });

    cy.visit('/teste2');

    cy.get('[data-test="follow-button"]').click();

    cy.url().should('contain', 'login');
  });

  it('Seguir', () => {
    cy.login();

    cy.fixture('user2.json').then((user2) => {
      cy.intercept('GET', '/users/teste2', user2);
    });

    cy.intercept('POST', '/follows/teste2', {
      statusCode: 201,
    }).as('follow-user');

    cy.visit('/teste2');

    cy.get('[data-test="follow-button"]').click();

    cy.wait('@follow-user');

    cy.get('[data-test="follow-button"]').should('have.data', 'following', true);

    cy.get('[data-test="followers"]').should('have.text', '1');
  });

  it('Deixar de seguir', () => {
    cy.login();

    cy.fixture('user2.json').then((user2) => {
      cy.intercept('GET', '/users/teste2', {
        body: {
          ...user2,
          followers: 1,
          friendshipStatus: {
            ...user2.friendshipStatus,
            isFollowing: true,
          },
        },
      });
    });

    cy.intercept('DELETE', '/follows/teste2', {
      statusCode: 201,
    }).as('unfollow-user');

    cy.visit('/teste2');

    cy.get('[data-test="follow-button"]').click();

    cy.wait('@unfollow-user');

    cy.get('[data-test="follow-button"]').should('have.data', 'following', false);

    cy.get('[data-test="followers"]').should('have.text', '0');
  });
});
