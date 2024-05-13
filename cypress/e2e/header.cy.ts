describe('Cabeçalho deslogado', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Botões mobile', () => {
    cy.viewport('iphone-xr');

    cy.get('a[href="/"]').should('be.visible');
    cy.get('[data-test="search-dialog"]').should('be.visible');
    cy.get('[data-test="mobile-nav-trigger"]').should('be.visible');
  });

  it('Botões desktop', () => {
    cy.get('a[href="/"]').should('be.visible');
    cy.get('a[href="/ranking"]').should('be.visible');
    cy.get('[data-test="search-dialog"]').should('be.visible');
    cy.get('[data-test="locale-select"]').should('be.visible');
    cy.get('[data-test="theme-toggle"]').should('be.visible');
    cy.get('a[href="/login"]').should('be.visible');
    cy.get('a[href="/signup"]').should('be.visible');
  });

  it('Abrir menú lateral mobile deslogado', () => {
    cy.viewport('iphone-xr');

    cy.get('[data-test="mobile-nav-trigger"]').click();
    cy.get('[role="dialog"]').should('have.data', 'state', 'open');
    cy.get('a[href="/login"]').should('be.visible');
    cy.get('a[href="/signup"]').should('be.visible');
  });
});

describe('Temas', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Trocar tema mobile', () => {
    cy.viewport('iphone-xr');

    cy.get('[data-test="mobile-nav-trigger"]').click();
    cy.get('[data-test="theme-collapsible"]').click();
    cy.get('[data-test="light"]').click();

    cy.get('html').should('have.class', 'light');
  });

  it('Trocar tema desktop', () => {
    cy.get('[data-test="theme-toggle"]').click();
    cy.get('[data-test="light"]').click();

    cy.get('html').should('have.class', 'light');
  });

  it('Utilizar tema padrão do navegador', () => {
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        cy.get('html').should('have.class', 'dark');
      } else {
        cy.get('html').should('have.class', 'light');
      }
    }
  });

  it('Persistência do tema', () => {
    window.localStorage.setItem('theme', 'light');

    cy.get('html').should('have.class', 'light');
  });
});

describe('Linguagens', () => {
  it('Trocar linguagem desktop', () => {
    cy.visit('/');
    cy.get('[data-test="locale-select"]').click();
    cy.get('[data-test="en"]').click();
    cy.getCookie('NEXT_LOCALE').should('have.nested.property', 'value', 'en');
  });

  it('Trocar linguagem para inglês mobile', () => {
    cy.visit('/');

    cy.viewport('iphone-xr');

    cy.get('[data-test="mobile-nav-trigger"]').click();
    cy.get('[data-test="language-collapsible"]').click();
    cy.get('[data-test="en"]').click();

    cy.getCookie('NEXT_LOCALE').should('have.nested.property', 'value', 'en');
  });

  it('Persistência da linguagem', () => {
    cy.setCookie('NEXT_LOCALE', 'en');
    cy.visit('/');
    cy.getCookie('NEXT_LOCALE').should('have.nested.property', 'value', 'en');
  });
});

describe('Logado', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('Botões mobile', () => {
    cy.viewport('iphone-xr');

    cy.get('a[href="/"]').should('be.visible');
    cy.get('[data-test="create-tip"]').should('be.visible');
    cy.get('[data-test="create-post"]').should('be.visible');
  });

  it('Botões desktop', () => {
    cy.get('a[href="/"]').should('be.visible');
    cy.get('a[href="/ranking"]').should('be.visible');
    cy.get('[data-test="create-tip"]').should('be.visible');
    cy.get('[data-test="create-post"]').should('be.visible');
    cy.get('[data-test="search-dialog"]').should('be.visible');
    cy.get('[data-test="locale-select"]').should('be.visible');
    cy.get('[data-test="theme-toggle"]').should('be.visible');
    cy.get('[data-test="header-dropdown-button"]').should('be.visible');
  });

  it('Abrir menú lateral mobile', () => {
    cy.viewport('iphone-xr');

    cy.get('[data-test="mobile-nav-trigger"]').click();
    cy.get('[role="dialog"]').should('have.data', 'state', 'open');
    cy.get('[role="dialog"]').should('contain.text', 'Sair');
    cy.get('a[href="/login"]').should('not.exist');
    cy.get('a[href="/signup"]').should('not.exist');
    cy.get('[role="dialog"]').should('contain.text', 'Sair');
  });
});
