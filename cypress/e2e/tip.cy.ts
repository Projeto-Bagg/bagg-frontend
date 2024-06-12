describe('Criar tip', () => {
  beforeEach(() => {
    cy.login();

    cy.visit('/home');
  });

  it('Criar tip', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/tips/feed?page=1&relevancy=true&follows=true&cityInterest=true',
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
            url: '/cities/search?q=S%C3%A3o+Sebasti%C3%A3o&count=5',
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
            url: '/tips',
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

    cy.get('[name="tags"]').type('test{enter}test2{enter}test3{enter}');

    cy.get('[data-test="current-tags"]').children().should('have.length', 3);

    cy.get('input[type="file"]').selectFile(['cypress/assets/pic1.png'], {
      force: true,
    });

    cy.get('[data-test="create-tip-form"]').submit();

    cy.wait('@create-tip');

    cy.url().should('contain', 'tip');
  });

  it('Adicionando mídias', () => {
    cy.get('[data-test="create-tip"]').click();

    cy.get('input[type="file"]').selectFile(['cypress/assets/pic1.png'], {
      force: true,
    });

    cy.get('input[type="file"]').selectFile('cypress/assets/pic2.png', {
      force: true,
    });

    cy.get('[data-test="medias"]').children().should('have.length', 2);
  });

  it('Limite máximo de 10 mídias acrescentando tudo de uma vez só', () => {
    cy.get('[data-test="create-tip"]').click();

    cy.get('input[type="file"]').selectFile(
      [
        'cypress/assets/pic1.png',
        'cypress/assets/pic2.png',
        'cypress/assets/pic3.png',
        'cypress/assets/pic2.png',
        'cypress/assets/pic1.png',
        'cypress/assets/pic3.png',
        'cypress/assets/pic1.png',
        'cypress/assets/pic1.png',
        'cypress/assets/pic1.png',
        'cypress/assets/pic1.png',
        'cypress/assets/pic1.png',
      ],
      {
        force: true,
      },
    );

    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });

  it('Limite máximo de 10 mídias acrescentando aos poucos', () => {
    cy.get('[data-test="create-tip"]').click();

    cy.get('input[type="file"]').selectFile(
      [
        'cypress/assets/pic1.png',
        'cypress/assets/pic2.png',
        'cypress/assets/pic3.png',
        'cypress/assets/pic2.png',
        'cypress/assets/pic1.png',
        'cypress/assets/pic3.png',
      ],
      {
        force: true,
      },
    );

    cy.get('input[type="file"]').selectFile(
      [
        'cypress/assets/pic1.png',
        'cypress/assets/pic2.png',
        'cypress/assets/pic3.png',
        'cypress/assets/pic2.png',
        'cypress/assets/pic1.png',
        'cypress/assets/pic3.png',
        'cypress/assets/pic3.png',
        'cypress/assets/pic3.png',
      ],
      {
        force: true,
      },
    );

    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });

  it('Limite máximo de 100mb', () => {
    cy.get('[data-test="create-tip"]').click();

    const moreThanFiftyMb = 15000000 + 1;
    const bigFile = Cypress.Buffer.alloc(moreThanFiftyMb);
    bigFile.write('X', moreThanFiftyMb);

    cy.get('input[type="file"]').selectFile(
      [
        { contents: bigFile, fileName: 'image.png' },
        { contents: bigFile, fileName: 'imag2.png' },
        { contents: bigFile, fileName: 'imag3.png' },
        { contents: bigFile, fileName: 'imag4.png' },
        { contents: bigFile, fileName: 'imag5.png' },
        { contents: bigFile, fileName: 'imag7.png' },
        { contents: bigFile, fileName: 'imag10.png' },
      ],
      {
        force: true,
      },
    );

    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });

  it('Limite máximo de 100mb acrescentando aos poucos', () => {
    cy.get('[data-test="create-tip"]').click();

    const moreThanFiftyMb = 15000000 + 1;
    const bigFile = Cypress.Buffer.alloc(moreThanFiftyMb);
    bigFile.write('X', moreThanFiftyMb);

    cy.get('input[type="file"]').selectFile(
      [
        { contents: bigFile, fileName: 'image.png' },
        { contents: bigFile, fileName: 'imag2.png' },
        { contents: bigFile, fileName: 'imag3.png' },
        { contents: bigFile, fileName: 'imag4.png' },
      ],
      {
        force: true,
      },
    );

    cy.get('[data-test="medias"]').children().should('have.length', 4);

    cy.get('input[type="file"]').selectFile(
      [
        { contents: bigFile, fileName: 'imag5.png' },
        { contents: bigFile, fileName: 'imag7.png' },
        { contents: bigFile, fileName: 'imag10.png' },
      ],
      {
        force: true,
      },
    );

    cy.get('[data-test="toasts"]').children().should('have.length', 1);
  });

  it('Excluir uma mídia', () => {
    cy.get('[data-test="create-tip"]').click();

    cy.get('input[type="file"]').selectFile(
      ['cypress/assets/pic1.png', 'cypress/assets/pic2.png'],
      {
        force: true,
      },
    );

    cy.get('[data-test="medias"]').children().should('have.length', 2);

    cy.get('[data-test="delete-media-1"]').click();

    cy.get('[data-test="medias"]').children().should('have.length', 1);
  });
});

describe('Funcionalidades da tip', () => {
  beforeEach(() => {
    cy.login();

    cy.fixture('tip.json').then((tip) => {
      cy.intercept(
        {
          method: 'GET',
          url: '/tips/1',
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
      { method: 'GET', url: '/tip-comments/1' },
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
            url: '/tip-comments',
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

    cy.get('[data-test="comments"]').children().should('have.length', 1);
  });

  it('Excluir comentário', () => {
    cy.fixture('tip-comment.json').then((tipComment) => {
      cy.intercept(
        { method: 'GET', url: '/tip-comments/1' },
        {
          body: [tipComment],
          statusCode: 200,
        },
      );
    });

    cy.intercept(
      { method: 'DELETE', url: '/tip-comments/1' },
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
      { method: 'POST', url: '/tip-likes/1' },
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
          url: '/tips/1',
        },
        {
          body: {
            ...tip,
            isLiked: true,
            likesAmount: 1,
          },
          statusCode: 200,
        },
      );
    });

    cy.intercept(
      { method: 'DELETE', url: '/tip-likes/1' },
      {
        statusCode: 200,
      },
    ).as('like-tip');

    cy.get('[data-test="like-tip"]').click();

    cy.get('[data-test="like-tip"]').should('have.data', 'liked', false);
  });

  it('Excluir postagem', () => {
    cy.intercept(
      { method: 'DELETE', url: '/tips/1' },
      {
        statusCode: 200,
      },
    ).as('delete-tip');

    cy.get('[data-test="tip-options"]').click();
    cy.get('[data-test="tip-delete"]').click();
    cy.get('[data-test="tip-delete-confirm"]').click();

    cy.wait('@delete-tip');

    cy.url().should('contain', '/home');
  });

  // it('Copiar link da postagem', () => {
  //   cy.get('[data-test="tip-options"]').click();
  //   cy.get('[data-test="tip-copy-link"]').click();

  //   cy.window().then((window) => {
  //     cy.stub(window.navigator.clipboard, 'writeText').as('writeTextStub');
  //   });

  //   cy.window().then((win) => {
  //     win.navigator.clipboard.readText().then((text) => {
  //       expect(text).to.eq(Cypress.config().baseUrl + '/tip/1');
  //     });
  //   });

  //   cy.get('[data-test="toasts"]').children().should('have.length', 1);
  // });
});
