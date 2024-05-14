const candidates = require("./candidate.js");

describe('Test assessment for PushOperations: ', () => {
  
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC1: Check OrangeHRM logo', () => {
    verifyLogo();
  });

  it('TC2: Login - Happy path', () => {
    performLogin();
    cy.get("h6[class = 'oxd-text oxd-text--h6 oxd-topbar-header-breadcrumb-module']").should('have.text', 'Dashboard');
    cy.url().should('include', '/dashboard/index');
  });

  it('TC3: Add candidate', () => {
    addCandidate();
    cy.get("input[name='firstName']").should('be.visible');
    cy.get("input[name='lastName']").should('be.visible');
    cy.get("input[class='oxd-input oxd-input--active']").eq(1).should('be.visible');
  });

  it('TC4: Time reports', () => {
    timeReports();
    cy.url().should('include', '/time/displayProjectReportCriteria');
  });
});

function verifyLogo() {
  cy.get("img[alt = 'orangehrm-logo']").should('have.attr', 'src').and('include', '/web/images/ohrm_logo.png');
}

function performLogin() {
  cy.get("input[name = 'username']").type(Cypress.config('credentials').username);
  cy.get("input[name = 'password']").type(Cypress.config('credentials').password);
  cy.get("button[class = 'oxd-button oxd-button--medium oxd-button--main orangehrm-login-button']").click();
}


function addCandidate() {
  
  performLogin();
  
  candidates.forEach(candidate => {
    cy.get("div[class='oxd-sidepanel-body'] > ul > li").eq(4).click();
    cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();
    cy.get("input[name='firstName']").type(candidate.firstName);
    cy.get("input[name='lastName']").type(candidate.lastName);
    cy.get("input[class='oxd-input oxd-input--active']").eq(1).type(candidate.email);
    cy.get("button[type='submit']").click();
  });
}

function timeReports() {

  performLogin();

  cy.get("div[class='oxd-sidepanel-body'] > ul > li").eq(3).click();
  cy.contains("Reports").click();
  cy.contains("Project Reports").click();
  cy.get("div > input[placeholder='Type for hints...']").should('be.visible').type("Apache Software Foundation");
  cy.get("div > input[placeholder='Type for hints...']").type("{enter}");
  cy.contains("Apache Software Foundation - ASF - Phase 1").should('be.visible');
  cy.contains("Apache Software Foundation - ASF - Phase 1").click();
  cy.url().should("include", "/time/displayProjectReportCriteria");
  cy.get("div > div > div > input[placeholder = 'From']").click().type("2021-01-01");
  cy.get("div > div > div > input[placeholder = 'To']").click().type("2023-12-31");
  cy.contains(" View ").click();  
}