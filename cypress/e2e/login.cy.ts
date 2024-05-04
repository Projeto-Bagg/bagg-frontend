describe('Logar', () => {
  it('Redirecionar para cadastro', () => {
    cy.visit('/login');
    cy.get('[data-test="redirect-signup"]').click();

    cy.url().should('contain', 'signup');
  });

  it('Login incorreto', () => {
    cy.visit('/login');

    cy.intercept('POST', '/auth/login', {
      statusCode: 401,
    }).as('loginRequest');

    cy.get('[name="login"]').type('teste');
    cy.get('[name="password"]').type('Teste123@');

    cy.get('#login-form').submit();

    cy.get('@loginRequest').should('have.nested.property', 'response.statusCode', 401);

    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });

  it('Login correto', () => {
    cy.visit('/login');

    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzExNzYzNDIwLCJleHAiOjE3MTE3NjcwMjB9.uXRAVSrAFZ7S32klVoElmLCmq_S3l4Zhl1L2KXOssjA',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzExNzYzNDIwLCJleHAiOjE3MTE3NjcwMjB9.uXRAVSrAFZ7S32klVoElmLCmq_S3l4Zhl1L2KXOssjA',
      },
    }).as('loginRequest');

    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', '/users/me', {
        statusCode: 200,
        body: user,
      }).as('me');
    });

    cy.get('[name="login"]').type('teste');
    cy.get('[name="password"]').type('Teste123@');

    cy.get('#login-form').submit();

    cy.wait('@loginRequest').should('have.nested.property', 'response.statusCode', 200);

    cy.wait('@me');

    cy.url().should('not.contain', 'login');
  });
});
