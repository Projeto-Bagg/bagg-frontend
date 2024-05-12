describe('Criar diário', () => {
  beforeEach(() => {
    cy.login();

    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', '/users/teste', user);
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/trip-diaries/user/teste',
      },
      {
        statusCode: 200,
        body: [],
      },
    );

    cy.visit('/teste/diary-posts');
  });

  it('Criar diário', () => {
    cy.fixture('city-search.json')
      .then((citySearch) => {
        cy.intercept(
          {
            method: 'GET',
            url: '/cities/search?q=S%C3%A3o+Sebasti%C3%A3o&count=5',
          },
          {
            statusCode: 200,
            body: citySearch,
          },
        );
      })
      .as('city-search');

    cy.fixture('trip-diary.json')
      .then((tripDiary) => {
        cy.intercept(
          {
            method: 'POST',
            url: '/trip-diaries',
          },
          {
            statusCode: 200,
            body: tripDiary,
          },
        );
      })
      .as('create-trip-diary');

    cy.fixture('trip-diary.json')
      .then((tripDiary) => {
        cy.intercept(
          {
            method: 'GET',
            url: '/trip-diaries/1',
          },
          {
            statusCode: 200,
            body: tripDiary,
          },
        );
      })
      .as('trip-diary');

    cy.fixture('diary-post.json')
      .then((diaryPost) => {
        cy.intercept(
          {
            method: 'GET',
            url: '/trip-diaries/1/posts?page=1',
          },
          {
            statusCode: 200,
            body: [diaryPost],
          },
        );
      })
      .as('trip-diary-posts');

    cy.intercept(
      {
        method: 'GET',
        url: '/diary-posts/user/teste?page=1',
      },
      {
        statusCode: 200,
        body: [],
      },
    );

    cy.fixture('diary-post.json')
      .then((diaryPost) => {
        cy.intercept(
          {
            method: 'POST',
            url: '/diary-posts',
          },
          {
            statusCode: 200,
            body: diaryPost,
          },
        );
      })
      .as('create-diary-post');

    cy.get('[data-test="create-post"]').click();

    cy.get('[data-test="create-trip-diary-button"]').click();
    cy.get('[name="title"]').type('test');
    cy.get('[name="message"]').type('test');
    cy.get('[data-test="select-city"]').click();
    cy.get('[cmdk-input]').type('São Sebastião');
    cy.wait('@city-search');
    cy.get('[data-value=166148]').click();
    cy.get('[data-test="create-trip-diary-form"]').submit();

    cy.get('[data-test="select-trip-diary"]').click();
    cy.wait(300);
    cy.get('[data-value=teste]').click();
    cy.get('[name="message"]').type('test');
    cy.get('[data-test="create-post-form"]').submit();

    cy.wait('@create-diary-post');

    cy.url().should('contain', '/teste/diary-posts');
    cy.get('[data-test="diary-posts-feed"]').should('contain.text', 'test');
    cy.wait('@trip-diary');
    cy.wait('@trip-diary-posts').then(() => {
      cy.get('body').should('contain.text', 'test');
    });
  });
});

describe('Funcionalidades do diário', () => {
  beforeEach(() => {
    cy.login();

    cy.visit('/diary/post/1');

    cy.fixture('diary-post.json').then((diaryPost) => {
      cy.intercept(
        {
          method: 'GET',
          url: '/diary-posts/1',
        },
        {
          body: diaryPost,
          statusCode: 200,
        },
      );
    });
  });

  it('Curtir postagem', () => {
    cy.intercept(
      { method: 'POST', url: '/diary-post-likes/1' },
      {
        statusCode: 200,
      },
    ).as('like-diary-post');

    cy.get('[data-test="diary-post-like"]').click();

    cy.get('[data-test="diary-post-like"]').should('have.data', 'liked', true);
  });

  it('Descurtir postagem', () => {
    cy.fixture('diary-post.json').then((diaryPost) => {
      cy.intercept(
        {
          method: 'GET',
          url: '/diary-posts/1',
        },
        {
          body: {
            ...diaryPost,
            isLiked: true,
            likedBy: 1,
          },
          statusCode: 200,
        },
      );
    });

    cy.intercept(
      { method: 'DELETE', url: '/diary-post-likes/1' },
      {
        statusCode: 200,
      },
    ).as('unlike-diary-post');

    cy.get('[data-test="diary-post-like"]').click();

    cy.get('[data-test="diary-post-like"]').should('have.data', 'liked', false);
  });

  it('Excluir postagem', () => {
    cy.intercept(
      { method: 'DELETE', url: '/diary-posts/1' },
      {
        statusCode: 200,
      },
    ).as('delete-diary-post');

    cy.get('[data-test="diary-post-options"]').click();
    cy.get('[data-test="diary-post-delete"]').click();
    cy.get('[data-test="diary-post-delete-confirm"]').click();

    cy.wait('@delete-diary-post');

    cy.url().should('contain', '/home');
  });

  it('Copiar link da postagem', () => {
    cy.get('[data-test="diary-post-options"]').click();
    cy.get('[data-test="diary-post-copy-link"]').click();

    cy.window().then((window) => {
      cy.stub(window.navigator.clipboard, 'writeText').as('writeTextStub');
    });

    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq(Cypress.config().baseUrl + '/diary/post/1');
      });
    });

    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });
});
