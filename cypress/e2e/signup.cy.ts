describe('Cadastro', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Cadastro correto', () => {
    cy.intercept('POST', '/users', {
      statusCode: 201,
    }).as('signup-request');

    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        accessToken: 'token',
        refreshToken: 'token',
      },
    }).as('login');

    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', '/users/me', {
        statusCode: 200,
        body: user,
      }).as('me');
    });

    cy.get('[name="fullName"]').type('Usuário teste');
    cy.get('[name="username"]').type('teste');
    cy.get('[name="email"]').type('teste@gmail.com');
    cy.get('#birthdateDay').click();
    cy.get('[role=option]').contains(6).click();
    cy.get('#birthdateMonth').click();
    cy.get('[role=option]').contains('Março').click();
    cy.get('#birthdateYear').click();
    cy.get('[role=option]').contains(2002).click();
    cy.get('[name="password"]').type('Teste@1234');
    cy.get('[name="confirmPassword"]').type('Teste@1234');
    cy.get('#signup-form').submit();

    cy.wait('@signup-request');
    cy.wait('@login');
    cy.wait('@me');

    cy.url().should('not.contain', 'signup');
  });

  it('Nome de usuário e email em uso', () => {
    cy.intercept('POST', '/users', {
      statusCode: 409,
      body: {
        username: {
          description: 'Username not available',
          code: 'username-not-available',
        },
        email: {
          description: 'Email not available',
          code: 'email-not-available',
        },
      },
    }).as('signup-request');

    cy.get('[name="fullName"]').type('Usuário teste');
    cy.get('[name="username"]').type('teste');
    cy.get('[name="email"]').type('teste@gmail.com');
    cy.get('#birthdateDay').click();
    cy.get('[role=option]').contains(6).click();
    cy.get('#birthdateMonth').click();
    cy.get('[role=option]').contains('Março').click();
    cy.get('#birthdateYear').click();
    cy.get('[role=option]').contains(2002).click();
    cy.get('[name="password"]').type('Teste@1234');
    cy.get('[name="confirmPassword"]').type('Teste@1234');
    cy.get('#signup-form').submit();

    cy.wait('@signup-request');

    cy.get('[data-test="username-not-available"]').should('be.visible');
    cy.get('[data-test="email-not-available"]').should('be.visible');
  });

  it('Redirecionar para login', () => {
    cy.get('[data-test="redirect-signup"]').click();

    cy.url().should('contain', 'login');
  });
});
