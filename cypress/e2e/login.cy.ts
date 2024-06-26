describe('Logar', () => {
  beforeEach(() => {
    cy.visit('/login');

    Cypress.on('uncaught:exception', (err) => {
      // Cypress and React Hydrating the document don't get along
      // for some unknown reason. Hopefully, we figure out why eventually
      // so we can remove this.
      if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message)
      ) {
        return false;
      }
    });
  });

  it('Redirecionar para cadastro', () => {
    cy.get('[data-test="redirect-signup"]').click();

    cy.url().should('contain', 'signup');
  });

  it('Login incorreto', () => {
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
    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJVU0VSIiwiaGFzRW1haWxCZWVuVmVyaWZpZWQiOnRydWUsImlhdCI6MTcxNDg0ODQwMywiZXhwIjoyNzE0ODUyMDAzfQ.59WECadq6ehgb_6HruXZm5eovzZ3TnvUb-QxQkd1wUE',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJVU0VSIiwiaGFzRW1haWxCZWVuVmVyaWZpZWQiOnRydWUsImlhdCI6MTcxNDg0ODQwMywiZXhwIjoyNzE0ODUyMDAzfQ.59WECadq6ehgb_6HruXZm5eovzZ3TnvUb-QxQkd1wUE',
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
