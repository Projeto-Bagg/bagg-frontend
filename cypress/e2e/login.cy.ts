describe('Logar', () => {
  it('Redirecionar para cadastro', () => {
    cy.visit('/login');
    cy.get('#redirect-signup').click();

    cy.url().should('contain', 'signup');
  });

  it('Login incorreto', () => {
    cy.visit('/login');

    cy.intercept('POST', 'http://localhost:3001/auth/login').as('loginRequest');

    cy.get('#login').type('teste');
    cy.get('#password').type('1234');

    cy.get('#login-form').submit();

    cy.get('@loginRequest').should(
      'have.nested.property',
      'response.body.statusCode',
      401,
    );

    cy.get('#toasts').should('have.descendants', 'li');
  });

  it('Login correto', () => {
    cy.visit('/login');

    cy.intercept('POST', 'http://localhost:3001/auth/login').as('loginRequest');

    cy.get('#login').type('teste');
    cy.get('#password').type('Teste123@');

    cy.get('#login-form').submit();

    cy.get('@loginRequest').should('have.nested.property', 'response.statusCode', 200);

    cy.url().should('not.contain', 'login');
  });
});
