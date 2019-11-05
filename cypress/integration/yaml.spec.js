describe('Basic flagpole tests using config.yaml....', function () {
  const env = Cypress.env('ENVIRONMENT'),
    YAML = require('yamljs');
  var baseURL = '', flagpoleData, flagpoleKeys;

  it("Setup test.....", function () {
    cy.readFile('config.yaml').then((str) => {
      const config = YAML.parse(str);
      baseURL = config[env].domain;
      cy.readFile(config[env]['source']).then(function (data) {
        flagpoleData = data;
        flagpoleKeys = Object.keys(flagpoleData)
        cy.visit(baseURL).then(function () {
          cy.get('.flagpole-container').should('have.length', flagpoleKeys.length)
        })
      })
    })
  })

  it("Show the initial page from the flagpole data", function () {
      cy.visit(baseURL).then(function () {
        cy.get('.flagpole-container').should('have.length', flagpoleKeys.length)
      })
    })
})



