describe('Perfil', () => {
  it('Seguir deslogado', () => {
    cy.fixture('user2.json').then((user2) => {
      cy.intercept('GET', 'http://localhost:3001/users/teste2', user2);
    });

    cy.visit('/teste2');

    cy.get('[data-test="follow-button"]').click();

    cy.url().should('contain', 'login');
  });

  it('Seguir', () => {
    cy.login();

    cy.fixture('user2.json').then((user2) => {
      cy.intercept('GET', 'http://localhost:3001/users/teste2', user2);
    });

    cy.intercept('POST', 'http://localhost:3001/follows/teste2', {
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
      cy.intercept('GET', 'http://localhost:3001/users/teste2', {
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

    cy.intercept('DELETE', 'http://localhost:3001/follows/teste2', {
      statusCode: 201,
    }).as('unfollow-user');

    cy.visit('/teste2');

    cy.get('[data-test="follow-button"]').click();

    cy.wait('@unfollow-user');

    cy.get('[data-test="follow-button"]').should('have.data', 'following', false);

    cy.get('[data-test="followers"]').should('have.text', '0');
  });
});
