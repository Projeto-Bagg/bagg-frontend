/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add ('login', (email, password) => { ... })

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      loginAdmin(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.session(['test'], () => {
    cy.setCookie(
      'bagg.sessionToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJVU0VSIiwiaGFzRW1haWxCZWVuVmVyaWZpZWQiOnRydWUsImlhdCI6MTcxNDg0ODQwMywiZXhwIjoyNzE0ODUyMDAzfQ.59WECadq6ehgb_6HruXZm5eovzZ3TnvUb-QxQkd1wUE',
    );

    cy.setCookie(
      'bagg.refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJVU0VSIiwiaGFzRW1haWxCZWVuVmVyaWZpZWQiOnRydWUsImlhdCI6MTcxNDg0ODQwMywiZXhwIjoyNzE0ODUyMDAzfQ.59WECadq6ehgb_6HruXZm5eovzZ3TnvUb-QxQkd1wUE',
    );
  });

  cy.fixture('user.json').then((user) => {
    cy.intercept('GET', '/users/me', {
      statusCode: 200,
      body: user,
    }).as('me');
  });
});

Cypress.Commands.add('loginAdmin', () => {
  cy.session(['admin'], () => {
    cy.setCookie(
      'bagg.sessionToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJBRE1JTiIsImhhc0VtYWlsQmVlblZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MTQ4NDg0MDMsImV4cCI6MjcxNDg1MjAwM30.zyFV32xQOXK8Rm0UK4uF8gHKXAG1JAZ3VdUsk6g24z0',
    );

    cy.setCookie(
      'bagg.refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJBRE1JTiIsImhhc0VtYWlsQmVlblZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MTQ4NDg0MDMsImV4cCI6MjcxNDg1MjAwM30.zyFV32xQOXK8Rm0UK4uF8gHKXAG1JAZ3VdUsk6g24z0',
    );
  });

  cy.fixture('admin.json').then((admin) => {
    cy.intercept('GET', '/admin/me', {
      statusCode: 200,
      body: admin,
    }).as('admin');
  });
});
