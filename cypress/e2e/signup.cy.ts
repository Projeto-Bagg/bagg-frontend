describe('Cadastro', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Cadastro bem sucedido', () => {
    cy.intercept('POST', '/users', {
      statusCode: 201,
    }).as('signup-request');

    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJVU0VSIiwiaGFzRW1haWxCZWVuVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE3MTQ4NDg0MDMsImV4cCI6MjcxNDg1MjAwM30.iiYbVT4yQfEjZzZt4VnOcTk_9P2OK3TJzmyqCDVqWHI',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJVU0VSIiwiaGFzRW1haWxCZWVuVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE3MTQ4NDg0MDMsImV4cCI6MjcxNDg1MjAwM30.iiYbVT4yQfEjZzZt4VnOcTk_9P2OK3TJzmyqCDVqWHI',
      },
    }).as('login');

    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', '/users/me', {
        statusCode: 200,
        body: user,
      }).as('me');
    });

    cy.intercept('GET', '/users/username-availability/teste', {
      statusCode: 200,
    }).as('username-availability');

    cy.intercept('GET', '/users/email-availability/teste@gmail.com', {
      statusCode: 200,
    }).as('email-availability');

    cy.get('[name="fullName"]').type('Usuário teste');
    cy.get('[name="username"]').type('teste');
    cy.get('[name="email"]').type('teste@gmail.com');
    cy.get('[data-test="birthdate-day"]').click();
    cy.get('[role=option]').contains(6).click();
    cy.get('[data-test="birthdate-month"]').click();
    cy.get('[role=option]').contains('Março').click();
    cy.get('[data-test="birthdate-year"]').click();
    cy.get('[role=option]').contains(2002).click();
    cy.get('[name="password"]').type('Teste@1234');
    cy.get('[name="confirmPassword"]').type('Teste@1234');
    cy.get('[data-test="signup-form"]').submit();

    cy.wait('@signup-request');
    cy.wait('@login');

    cy.url().should('contain', 'verify-email');
  });

  it('Inserir erro caso nome de usuário ou email estejam indisponíveis', () => {
    cy.intercept('GET', '/users/username-availability/teste', {
      statusCode: 409,
    }).as('username-availability');

    cy.intercept('GET', '/users/email-availability/teste@gmail.com', {
      statusCode: 409,
    }).as('email-availability');

    cy.get('[name="username"]').type('teste');
    cy.get('[name="email"]').type('teste@gmail.com');

    cy.get('[data-test="username-not-available"]').should('be.visible');
    cy.get('[data-test="email-not-available"]').should('be.visible');
  });

  it('Inserir erro caso o email não tenha o formato certo', () => {
    cy.get('[name="email"]').type('teste');
    cy.get('[data-test="invalid-email"]').should('be.visible');

    cy.get('[name="email"]').type('@gmail.com');
    cy.get('[data-test="invalid-email"]').should('not.exist');
  });

  it('Dias no mês corretos', () => {
    cy.get('[data-test="birthdate-month"]').click();
    cy.get('[role=option]').contains('Fevereiro').click();
    cy.get('[data-test="birthdate-day"]').click();
    cy.get('[role=option]').contains(30).should('not.exist');
  });

  it('Nome de usuário e email disponíveis', () => {
    cy.intercept('GET', '/users/username-availability/teste', {
      statusCode: 200,
    }).as('username-availability');

    cy.intercept('GET', '/users/email-availability/teste@gmail.com', {
      statusCode: 200,
    }).as('email-availability');

    cy.get('[name="username"]').type('teste');
    cy.get('[name="email"]').type('teste@gmail.com');

    cy.get('[data-test="username-available"]').should('be.visible');
    cy.get('[data-test="email-available"]').should('be.visible');
  });

  it('Redirecionar para login', () => {
    cy.get('[data-test="redirect-signup"]').click();

    cy.url().should('contain', 'login');
  });

  describe('Data de nascimento', () => {
    it('Idade mínima de 16 anos', () => {
      const date = new Date();

      cy.get('[data-test="birthdate-year"]').click();
      cy.get('[role=option]')
        .contains(date.getFullYear() - 16)
        .click();
      cy.get('[data-test="birthdate-month"]').click();
      cy.get('[role=option]').eq(date.getMonth()).should('not.have.data', 'disabled');
      cy.get('[role=option]')
        .eq(date.getMonth() + 4)
        .should('have.data', 'disabled');
      cy.get('[role=option]').eq(date.getMonth()).click();

      cy.get('[data-test="birthdate-day"]').click();
      cy.get('[role=option]')
        .eq(date.getDate() + 1)
        .should('have.data', 'disabled');
      cy.get('[role=option]')
        .eq(date.getDate() - 1)
        .should('not.have.data', 'disabled');
    });

    it('Desmarcar dia caso o mês seja alterado para um que não tenha a quantidade de dias do anterior', () => {
      cy.get('[data-test="birthdate-month"]').click();
      cy.get('[role=option]').contains('Março').click();
      cy.get('[data-test="birthdate-day"]').click();
      cy.get('[role=option]').contains(30).click();

      cy.get('[data-test="birthdate-month"]').click();
      cy.get('[role=option]').contains('Fevereiro').click();

      cy.get('[data-test="birthdate-day"]').should('have.value', '');

      cy.get('[data-test="signup-form"]').submit();
      cy.get('[data-test="birthdate-too-small"]').should('be.visible');
    });

    it('Desmarcar mês e dia caso o usuário tenha menos de 16 anos', () => {
      cy.get('[data-test="birthdate-month"]').click();
      cy.get('[role=option]').contains('Dezembro').click();
      cy.get('[data-test="birthdate-day"]').click();
      cy.get('[role=option]').contains(30).click();
      cy.get('[data-test="birthdate-year"]').click();
      cy.get('[role=option]').contains(2008).click();

      cy.get('[data-test="birthdate-month"]').should('have.value', '');
      cy.get('[data-test="birthdate-day"]').should('have.value', '');

      cy.get('[data-test="birthdate-month"]').click();
      cy.get('[role=option]').contains('Fevereiro').click();

      cy.get('[data-test="signup-form"]').submit();
      cy.get('[data-test="birthdate-too-small"]').should('be.visible');
    });
  });

  describe('Senha', () => {
    it('Senhas não coincidem', () => {
      cy.get('[name="password"]').type('Teste@123');
      cy.get('[name="confirmPassword"]').type('Teste@123@');

      cy.get('[data-test="unmatched-passwords"]').should('be.visible');
    });

    it('Senha tem 8 caracteres', () => {
      cy.get('[name="password"]').type('Teste1234');

      cy.get('[data-test="password-length"]').should('have.data', 'valid', true);
    });

    it('Senha tem letras maiúsculas e minúsculas', () => {
      cy.get('[name="password"]').type('Te');

      cy.get('[data-test="password-a-z"]').should('have.data', 'valid', true);
    });

    it('Senha tem números', () => {
      cy.get('[name="password"]').type('1');

      cy.get('[data-test="password-0-9"]').should('have.data', 'valid', true);
    });

    it('Senha tem caracteres especiais', () => {
      cy.get('[name="password"]').type('@');

      cy.get('[data-test="password-special-character"]').should(
        'have.data',
        'valid',
        true,
      );
    });
  });
});
