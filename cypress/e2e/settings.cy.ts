describe('Alterar nome de usuário', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/settings');
  });

  it('Nome disponível', () => {
    cy.intercept('GET', '/users/username-availability/teste', {
      statusCode: 200,
    }).as('username-availability');

    cy.get('[name="username"]').type('teste');

    cy.get('[data-test="username-available"]').should('be.visible');
  });

  it('Nome indisponível', () => {
    cy.intercept('GET', '/users/username-availability/teste', {
      statusCode: 409,
    }).as('username-availability');

    cy.get('[name="username"]').type('teste');

    cy.get('[data-test="username-not-available"]').should('be.visible');
  });

  it('Alterando nome com sucesso', () => {
    cy.intercept('GET', '/users/username-availability/teste', {
      statusCode: 200,
    }).as('username-availability');

    cy.fixture('user.json').then((user) => {
      cy.intercept('PUT', '/users/teste', {
        body: {
          ...user,
          username: 'teste',
        },
        statusCode: 200,
      });
    });

    cy.intercept('POST', '/auth/refresh', {
      body: {
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
      },
    });

    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', '/users/me', {
        body: {
          ...user,
          username: 'teste',
        },
        statusCode: 200,
      });
    });

    cy.get('[name="username"]').type('teste');

    cy.get('[data-test="username-available"]').should('be.visible');

    cy.get('[data-test="change-username-form"]').submit();

    cy.get('[name="username"]').should('have.attr', 'placeholder', 'teste');

    cy.get('[data-test="username-changed-success"]').should('be.visible');

    cy.get('[data-test="header-dropdown-button"]').click();
    cy.get('[data-test="header-username"]').should('have.text', 'teste');
  });
});

describe('Alterar senha', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/settings');
  });

  it('Erro caso a senha atual seja igual a nova senha', () => {
    cy.get('[data-test="change-password-current-password"]').type('Teste123@');
    cy.get('[name="newPassword"]').type('Teste123@');
    cy.get('[name="confirmPassword"]').type('Teste123@');
    cy.get('[data-test="change-password-form"]').submit();
    cy.get('[data-test="same-password-error"]').should('be.visible');
  });

  it('Erro caso a nova senha seja fraca', () => {
    cy.get('[data-test="change-password-current-password"]').type('Teste123@');
    cy.get('[name="newPassword"]').type('Teste');
    cy.get('[name="confirmPassword"]').type('Teste123@');
    cy.get('[data-test="change-password-form"]').submit();
    cy.get('[data-test="weak-password-error"]').should('be.visible');
  });

  it('Erro caso a nova senha e a confirmação não coincidam', () => {
    cy.get('[data-test="change-password-current-password"]').type('Teste123@');
    cy.get('[name="newPassword"]').type('Teste123@');
    cy.get('[name="confirmPassword"]').type('Teste123');
    cy.get('[data-test="change-password-form"]').submit();
    cy.get('[data-test="unmatched-passwords-error"]').should('be.visible');
  });

  it('Senha atual incorreta', () => {
    cy.intercept('PUT', '/users/password', {
      statusCode: 409,
    });

    cy.get('[data-test="change-password-current-password"]').type('Teste123@@');
    cy.get('[name="newPassword"]').type('Teste123@');
    cy.get('[name="confirmPassword"]').type('Teste123@');
    cy.get('[data-test="change-password-form"]').submit();
    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });

  it('Senha alterada com sucesso', () => {
    cy.intercept('PUT', '/users/password', {
      statusCode: 200,
    });

    cy.get('[data-test="change-password-current-password"]').type('Teste123@@');
    cy.get('[name="newPassword"]').type('Teste123@');
    cy.get('[name="confirmPassword"]').type('Teste123@');
    cy.get('[data-test="change-password-form"]').submit();
    cy.get('[data-test="password-changed-success"]').should('be.visible');
  });
});

describe('Excluir conta', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/settings');
  });

  it('Modal de confirmação não abre caso a senha não tenha sido preenchida', () => {
    cy.get('[data-test="delete-account-button"]').click();
    cy.get('[role="alertdialog"]').should('not.exist');
  });

  it('Modal de confirmação abre caso a senha tenha sido preenchida', () => {
    cy.get('[data-test="delete-account-current-password"]').type('Teste123@');
    cy.get('[data-test="delete-account-button"]').click();
    cy.get('[role="alertdialog"]').should('be.visible');
  });

  it('Senha incorreta', () => {
    cy.intercept('DELETE', '/users?currentPassword=Teste123', {
      statusCode: 403,
    });
    cy.get('[data-test="delete-account-current-password"]').type('Teste123');
    cy.get('[data-test="delete-account-button"]').click();
    cy.get('[data-test="delete-account-action"]').click();

    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });

  it('Senha correta', () => {
    cy.intercept('DELETE', '/users?currentPassword=Teste123', {
      statusCode: 200,
    });
    cy.get('[data-test="delete-account-current-password"]').type('Teste123');
    cy.get('[data-test="delete-account-button"]').click();
    cy.get('[data-test="delete-account-action"]').click();

    cy.url().should('eq', Cypress.config().baseUrl);

    cy.getCookie('bagg.sessionToken').should('not.exist');
    cy.getCookie('bagg.refreshToken').should('not.exist');
  });
});
