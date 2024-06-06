describe('Denunciar', () => {
  describe('Geral', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/home');
      cy.fixture<Tip>('tip.json').then((tip) => {
        cy.intercept('GET', 'tips/recommend/feed?page=1', {
          body: [{ ...tip, user: { id: 2 } }],
        });
      });
    });

    it('Erro ao não inserior motivo da denúncia', () => {
      cy.get('[data-test="tip-options"]').click();
      cy.get('[data-test="report"]').click();
      cy.get('[data-test="report-form"]').submit();
      cy.get('[data-test="empty-reason-error"]').should('be.visible');
      cy.get('button').should('be.disabled');
    });
  });

  describe('Tip', () => {
    beforeEach(() => {
      cy.fixture<Tip>('tip.json').then((tip) => {
        cy.intercept('GET', 'tips/1', {
          body: { ...tip, user: { id: 2 } },
        });
      });
    });

    it('Opção de denúncia não deve aparecer caso deslogado', () => {
      cy.visit('/tip/1');

      cy.get('[data-test="comment-options"]').should('not.exist');
    });

    it('Enviando denúncia', () => {
      cy.intercept('POST', '/tips/report/1', {
        statusCode: 201,
      });

      cy.login();
      cy.visit('/tip/1');

      cy.get('[data-test="tip-options"]').click();
      cy.get('[data-test="report"]').click();
      cy.get('button[value="spam"]').click();
      cy.get('[data-test="report-form"]').submit();

      cy.get('[data-test="toasts"]').children().should('have.length', 1);
    });
  });

  describe('Comentário', () => {
    beforeEach(() => {
      cy.fixture<Tip>('tip.json').then((tip) => {
        cy.intercept('GET', 'tips/2', {
          body: { ...tip, user: { id: 2 } },
        });
      });
      cy.fixture<TipComment>('tip-comment.json').then((comment) => {
        cy.intercept('GET', 'tip-comments/1', {
          body: [{ ...comment, user: { id: 2 } }],
        });
      });
    });

    it('Opção de denúncia não deve aparecer caso deslogado', () => {
      cy.visit('/tip/2');

      cy.get('[data-test="comment-options"]').should('not.exist');
    });

    it('Enviando denúncia', () => {
      cy.login();
      cy.visit('/tip/2');

      cy.intercept('POST', '/tip-comments/report/1', {
        statusCode: 201,
      });

      cy.get('[data-test="comment-options"]').click();
      cy.get('[data-test="report"]').click();
      cy.get('button[value="spam"]').click();
      cy.get('[data-test="report-form"]').submit();

      cy.get('[data-test="toasts"]').children().should('have.length', 1);
    });
  });

  describe('Diário de viagem', () => {
    beforeEach(() => {
      cy.fixture<DiaryPost>('diary-post.json').then((diaryPost) => {
        cy.intercept('GET', 'diary-posts/1', {
          body: { ...diaryPost, user: { id: 2 } },
        });
      });
    });

    it('Opção de denúncia não deve aparecer caso deslogado', () => {
      cy.visit('/diary/post/1');

      cy.get('[data-test="diary-post-options"]').click();
      cy.get('[data-test="report"]').should('not.exist');
    });

    it('Enviando denúncia', () => {
      cy.login();
      cy.visit('/diary/post/1');

      cy.intercept('POST', '/diary-posts/report/1', {
        statusCode: 201,
      });

      cy.get('[data-test="diary-post-options"]').click();
      cy.get('[data-test="report"]').click();
      cy.get('button[value="spam"]').click();
      cy.get('[data-test="report-form"]').submit();

      cy.get('[data-test="toasts"]').children().should('have.length', 1);
    });
  });
});
