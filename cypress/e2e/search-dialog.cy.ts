describe('Procurar países/usuários/cidades', () => {
  it('País', () => {
    cy.visit('/');
    cy.get('#search-dialog').click();
    cy.get('input').type('Guatemala');

    cy.wait(300);

    cy.get('#countries').children('a').should('contain.text', 'Guatemala');
  });

  it('Usuário', () => {
    cy.visit('/');
    cy.get('#search-dialog').click();
    cy.get('input').type('teste');

    cy.wait(300);

    cy.get('#users').children('a').should('contain.text', 'Teste@teste');
  });

  it('Cidade', () => {
    cy.visit('/');
    cy.get('#search-dialog').click();
    cy.get('input').type('Bangkok');

    cy.wait(300);

    cy.get('#cities').children('a').should('contain.text', 'Bangkok');
  });
});
