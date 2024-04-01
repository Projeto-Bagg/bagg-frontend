describe('Criar tip', () => {
  beforeEach(() => {
    cy.login();

    cy.visit('/');
  });

  it('Criar tip', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/tips/feed?page=1',
      },
      {
        body: [],
        statusCode: 200,
      },
    );

    cy.fixture('city-search.json')
      .then((citySearch) => {
        cy.intercept(
          {
            method: 'GET',
            url: 'http://localhost:3001/cities/search?q=S%C3%A3o+Sebasti%C3%A3o&count=5',
          },
          {
            statusCode: 200,
            body: citySearch,
          },
        );
      })
      .as('city-search');

    cy.fixture('tip.json')
      .then((tip) => {
        cy.intercept(
          {
            method: 'POST',
            url: 'http://localhost:3001/tips',
          },
          {
            statusCode: 200,
            body: tip,
          },
        );
      })
      .as('create-tip');

    cy.get('[data-test="create-tip"]').click();

    cy.get('[data-test="select-city"]').click();

    cy.get('[cmdk-input]').type('São Sebastião');

    cy.wait('@city-search');

    cy.get('[data-value=166148]').click();

    cy.get('[name="message"]').type('test');

    cy.get('[data-test="create-tip-form"]').submit();

    cy.get('[data-test="homepage-feed"]').should('contain.text', 'test');

    cy.wait('@create-tip');
  });
});

describe('Funcionalidades na tip', () => {
  beforeEach(() => {
    cy.login();

    cy.fixture('tip.json').then((tip) => {
      cy.intercept(
        {
          method: 'GET',
          url: 'http://localhost:3001/tips/1',
        },
        {
          body: tip,
          statusCode: 200,
        },
      );
    });

    cy.visit('/tip/1');
  });

  it('Comentar', () => {
    cy.intercept(
      { method: 'GET', url: 'http://localhost:3001/tip-comments/1' },
      {
        body: [],
        statusCode: 200,
      },
    );

    cy.fixture('tip-comment.json')
      .then((tipComment) => {
        cy.intercept(
          {
            method: 'POST',
            url: 'http://localhost:3001/tip-comments',
          },
          {
            statusCode: 200,
            body: tipComment,
          },
        );
      })
      .as('create-tip');

    cy.get('[data-test="create-comment-form"]').children('input').type('test');

    cy.get('[data-test="create-comment-form"]').submit();

    cy.get('[data-test="comments"]').should('have.length', 1);
  });

  it('Excluir comentário', () => {
    cy.fixture('tip-comment.json').then((tipComment) => {
      cy.intercept(
        { method: 'GET', url: 'http://localhost:3001/tip-comments/1' },
        {
          body: [tipComment],
          statusCode: 200,
        },
      );
    });

    cy.intercept(
      { method: 'DELETE', url: 'http://localhost:3001/tip-comments/1' },
      {
        statusCode: 200,
      },
    ).as('delete-comments');

    cy.get('[data-test="comment-options"]').click();

    cy.get('[data-test="delete"]').click().get('[data-test="confirm"]').click();

    cy.wait('@delete-comments');

    cy.get('[data-test="comments"]').children().should('have.length', 0);
  });

  it('Curtir postagem', () => {
    cy.intercept(
      { method: 'POST', url: 'http://localhost:3001/tip-likes/1' },
      {
        statusCode: 200,
      },
    ).as('like-tip');

    cy.get('[data-test="like-tip"]').click();

    cy.get('[data-test="like-tip"]').should('have.data', 'liked', true);
  });

  it('Descurtir postagem', () => {
    cy.fixture('tip.json').then((tip) => {
      cy.intercept(
        {
          method: 'GET',
          url: 'http://localhost:3001/tips/1',
        },
        {
          body: {
            ...tip,
            isLiked: true,
            likedBy: 1,
          },
          statusCode: 200,
        },
      );
    });

    cy.intercept(
      { method: 'DELETE', url: 'http://localhost:3001/tip-likes/1' },
      {
        statusCode: 200,
      },
    ).as('like-tip');

    cy.get('[data-test="like-tip"]').click();

    cy.get('[data-test="like-tip"]').should('have.data', 'liked', false);
  });

  it('Excluir postagem', () => {
    cy.intercept(
      { method: 'DELETE', url: 'http://localhost:3001/tips/1' },
      {
        statusCode: 200,
      },
    ).as('delete-tip');

    cy.get('[data-test="tip-options"]').click();
    cy.get('[data-test="tip-delete"]').click();
    cy.get('[data-test="tip-delete-confirm"]').click();

    cy.wait('@delete-tip');

    cy.url().should('eq', 'http://localhost:3000/pt');
  });

  it('Copiar link da postagem', () => {
    cy.get('[data-test="tip-options"]').click();
    cy.get('[data-test="tip-copy-link"]').click();

    cy.window().then((window) => {
      cy.stub(window.navigator.clipboard, 'writeText').as('writeTextStub');
    });

    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq('http://localhost:3000/tip/1');
      });
    });

    cy.get('#toasts').children().should('have.length', 1);
  });
});
