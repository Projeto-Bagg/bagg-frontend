it('Redirecionar para página inicial caso usuário não seja admin', () => {
  cy.login();

  cy.visit('/admin');

  Cypress.on('uncaught:exception', () => {
    return false;
  });

  cy.url().should('eq', Cypress.config().baseUrl);
});

it('Redirecionar para página inicial caso deslogado', () => {
  cy.visit('/admin');

  Cypress.on('uncaught:exception', () => {
    return false;
  });

  cy.url().should('eq', Cypress.config().baseUrl);
});

describe('Denúncia de tip', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit('/admin');

    cy.fixture<TipReport>('tip-report.json').then((tipReport) => {
      cy.intercept('GET', '/admin/tip-reports?page=1', {
        body: [tipReport],
      });
    });
  });

  it('Rejeitar denúncia', () => {
    cy.intercept('POST', 'admin/tip-reports/1/reject', {
      statusCode: 200,
    });
    cy.get('[data-test="tip-report-1"]').click();
    cy.get('[data-test="reject-report"]').click();
    cy.get('[data-test="tip-report-1"]').should('not.exist');
  });

  it('Aceitar denúncia', () => {
    cy.intercept('POST', 'admin/tip-reports/1/accept', {
      statusCode: 200,
    });
    cy.get('[data-test="tip-report-1"]').click();
    cy.get('[data-test="accept-report"]').click();
    cy.get('[data-test="tip-report-1"]').should('not.exist');
  });
});

describe('Denúncia de comentário', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit('/admin');

    cy.fixture<TipCommentReport>('tip-comment-report.json').then((tipCommentReport) => {
      cy.intercept('GET', '/admin/tip-comment-reports?page=1', {
        body: [tipCommentReport],
      });
    });
  });

  it('Rejeitar denúncia', () => {
    cy.intercept('POST', 'admin/tip-comment-reports/1/reject', {
      statusCode: 200,
    });
    cy.get('[data-test="tip-comment-report-1"]').click();
    cy.get('[data-test="reject-report"]').click();
    cy.get('[data-test="tip-comment-report-1"]').should('not.exist');
  });

  it('Aceitar denúncia', () => {
    cy.intercept('POST', 'admin/tip-comment-reports/1/accept', {
      statusCode: 200,
    });
    cy.get('[data-test="tip-comment-report-1"]').click();
    cy.get('[data-test="accept-report"]').click();
    cy.get('[data-test="tip-comment-report-1"]').should('not.exist');
  });
});

describe('Denúncia de postagem no diário', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit('/admin');

    cy.fixture<DiaryPostReport>('diary-post-report.json').then((DiaryPostReport) => {
      cy.intercept('GET', '/admin/diary-post-reports?page=1', {
        body: [DiaryPostReport],
      });
    });
  });

  it('Rejeitar denúncia', () => {
    cy.intercept('POST', 'admin/diary-post-reports/1/reject', {
      statusCode: 200,
    });
    cy.get('[data-test="diary-post-report-1"]').click();
    cy.get('[data-test="reject-report"]').click();
    cy.get('[data-test="diary-post-report-1"]').should('not.exist');
  });

  it('Aceitar denúncia', () => {
    cy.intercept('POST', 'admin/diary-post-reports/1/accept', {
      statusCode: 200,
    });
    cy.get('[data-test="diary-post-report-1"]').click();
    cy.get('[data-test="accept-report"]').click();
    cy.get('[data-test="diary-post-report-1"]').should('not.exist');
  });
});
