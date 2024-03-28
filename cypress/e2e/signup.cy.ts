describe('Cadastro', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  // it('Cadastro incorreto', () => {
  //   cy.intercept('POST', 'http://localhost:3001/auth/login').as('loginRequest');

  //   cy.get('#fullName').type('Usuário teste');
  //   cy.get('#username').type('teste');
  //   cy.get('#email').type('teste@gmail.com');
  //   cy.get('#birthdateDay').click();
  //   cy.get('[role=option]').contains(6).click();
  //   cy.get('#birthdateMonth').click();
  //   cy.get('[role=option]').contains('Março').click();
  //   cy.get('#birthdateYear').click();
  //   cy.get('[role=option]').contains(2002).click();
  //   cy.get('#password').type('1234');
  //   cy.get('#confirmPassword').type('1234');
  //   cy.get('#signup-form').submit();
  // });

  it('Redirecionar para login', () => {
    cy.get('#redirect-login').click();

    cy.url().should('contain', 'login');
  });
});
