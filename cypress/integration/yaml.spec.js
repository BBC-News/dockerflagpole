describe('Basic flagpole tests using config.yaml....', function () {
  const env = Cypress.env('ENVIRONMENT'),
    YAML = require('yamljs');

  it("Show the initial page from the flagpole data", function () {
    cy.readFile('config.yaml').then((str) => {
      const config = YAML.parse(str);
      let baseURL = config[env].domain;
      cy.readFile(config[env]['source']).then(function (data) {
        let flagpoleKeys = Object.keys(data)
        cy.visit(baseURL).then(function () {
          cy.get('.flagpole-container').should('have.length', flagpoleKeys.length)
        })
      })
    })
  })
})



