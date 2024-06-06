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
    cy.intercept('POST', '/users/delete', {
      statusCode: 403,
    });
    cy.get('[data-test="delete-account-current-password"]').type('Teste123');
    cy.get('[data-test="delete-account-button"]').click();
    cy.get('[data-test="delete-account-action"]').click();

    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });

  it('Senha correta', () => {
    cy.intercept('POST', '/users/delete', {
      statusCode: 200,
    });
    cy.get('[data-test="delete-account-current-password"]').type('Teste123');
    cy.get('[data-test="delete-account-button"]').click();
    cy.get('[data-test="delete-account-action"]').click();

    cy.url().should('eq', Cypress.config().baseUrl);

    cy.getCookie('bagg.access-token').should('not.exist');
    cy.getCookie('bagg.refresh-token').should('not.exist');
  });
});

describe('Esqueci a senha', () => {
  it('Redirecionar para a página de redefinição de senha', () => {
    cy.visit('/login');

    cy.get('[data-test="forgot-password"]').click();

    cy.url().should('contain', 'reset-password');
  });

  it('Inserir erro caso o email não tenha o formato certo', () => {
    cy.visit('/settings/reset-password');

    cy.get('[name="email"]').type('teste');
    cy.get('[data-test="invalid-email"]').should('be.visible');

    cy.get('[name="email"]').type('@gmail.com');
    cy.get('[data-test="invalid-email"]').should('not.exist');
  });

  it('Redirecionar para página "done"', () => {
    cy.visit('/settings/reset-password');
    cy.intercept('GET', '/users/send-reset-password/teste@gmail.com', {
      statusCode: 200,
    });

    cy.get('[name="email"]').type('teste@gmail.com');
    cy.get('[data-test="invalid-email"]').should('not.exist');
    cy.get('[data-test="forgot-password-form"]').submit();

    cy.url().should('contain', 'done');
  });

  it('Redirecionar para a página principal caso não seja enviado o token', () => {
    cy.visit('/settings/reset-password/reset');

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.wait(500);

    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Redirecionar para a página principal caso o usuário esteja logado', () => {
    cy.login();
    cy.visit(
      '/settings/reset-password/reset?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.wait(500);

    cy.url().should('eq', Cypress.config().baseUrl + 'home');
  });

  it('Exibir formulário de redefinição de senha', () => {
    cy.visit(
      '/settings/reset-password/reset?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzE0NDI4NDY1LCJleHAiOjIzMTQ0MzIwNjV9.ZE9T53k8Ws6W91bFngRNpQi40x3EIlVabGlrpoYSJz8',
    );

    cy.get('[name="password"]');
  });

  it('Redefinição da senha bem sucedida', () => {
    cy.visit(
      '/settings/reset-password/reset?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzE0NDI4NDY1LCJleHAiOjIzMTQ0MzIwNjV9.ZE9T53k8Ws6W91bFngRNpQi40x3EIlVabGlrpoYSJz8',
    );

    cy.get('[name="password"]').type('Teste@123');
    cy.get('[name="confirmPassword"]').type('Teste@123');

    cy.get('[data-test="forgot-password-form"]').submit();

    cy.intercept(
      'POST',
      '/users/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzE0NDI4NDY1LCJleHAiOjIzMTQ0MzIwNjV9.ZE9T53k8Ws6W91bFngRNpQi40x3EIlVabGlrpoYSJz8',
      { statusCode: 200 },
    ).as('req');

    cy.wait('@req');

    cy.url().should('contain', 'login');
  });
});

describe('Confirmar email', () => {
  it('Redirecionar para página principal caso não tenha os cookies da sessão temporária', () => {
    cy.visit('/settings/verify-email');

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.wait(500);

    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Exibir página de confirmação de email', () => {
    cy.setCookie(
      'bagg.temp-session-token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzE0NDI4NDY1LCJleHAiOjI3MTQ0MzIwNjV9.d5wXQO7zhXwk_UuCeEK50KM0Y7d0d9UC6h-a3ngRmQw',
    );

    cy.visit('/settings/verify-email');
    cy.get('[data-test="already-verified-button"]');
  });

  it('Abrir link de confirmação de email', () => {
    cy.setCookie(
      'bagg.temp-session-token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzE0NDI4NDY1LCJleHAiOjE3MTQ0MzIwNjV9.NPH7-TXOrG-_ZbREthgNFVqEUoUbvbaVFqkjTlHXHhw',
    );
    cy.setCookie(
      'bagg.temp-refresh-token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzE0NDI4NDY1LCJleHAiOjE3MTUwMzMyNjV9.9Qo1OqO8pfSinaReF39_Z16kct9-60LPfnhAjSTwrUQ',
    );

    cy.visit(
      'settings/verify-email/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbGlwZWJyaXRvMjA3N0BnbWFpbC5jb20iLCJpYXQiOjE3MTQwMDM0NjMsImV4cCI6MTcxNDAwNzA2M30.33Y2mRAkxcehmHdR29NdnCm-O4QQeLhFe4rxFEWTJ7Y',
    );

    cy.intercept(
      'GET',
      '/users/verify-email-confirmation/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzE0NDI4NDY1LCJleHAiOjE3MTQ0MzIwNjV9.NPH7-TXOrG-_ZbREthgNFVqEUoUbvbaVFqkjTlHXHhw',
      { statusCode: 200 },
    );

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.url().should('eq', Cypress.config().baseUrl);
  });
});
