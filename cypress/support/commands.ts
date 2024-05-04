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
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.session(['test'], () => {
    cy.setCookie(
      'bagg.sessionToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzExNzYzNDIwLCJleHAiOjE3MTE3NjcwMjB9.uXRAVSrAFZ7S32klVoElmLCmq_S3l4Zhl1L2KXOssjA',
    );

    cy.setCookie(
      'bagg.refreshToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJ1c2VybmFtZSI6ImZlZmV6b2thIiwiaWF0IjoxNzExNzYzNDIwLCJleHAiOjE3MTE3NjcwMjB9.uXRAVSrAFZ7S32klVoElmLCmq_S3l4Zhl1L2KXOssjA',
    );
  });

  cy.fixture('user.json').then((user) => {
    cy.intercept('GET', '/users/me', {
      statusCode: 200,
      body: user,
    }).as('me');
  });
});
