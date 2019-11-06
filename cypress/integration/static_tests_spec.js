describe('Basic flagpole tests using config.yaml....', function () {
  const env = Cypress.env('ENVIRONMENT'),
    YAML = require('yamljs');
  var baseURL = '', flagpoleData, flagpoleKeys;

  it('Set up data ', function () {
    cy.readFile('config.yaml').then((str) => {
      const config = YAML.parse(str);
      baseURL = config[env].domain;
      cy.readFile(config[env]['source']).then(function (data) {
        flagpoleData = data;
        flagpoleKeys = Object.keys(flagpoleData);
        cy.visit(baseURL).then(function () {
          cy.get('.flagpole-container').should('have.length', flagpoleKeys.length)
        })
      })
    })
  })

  describe("ensure that the contents of the flagpole file are displayed", function() {

      it("Show all flagpoles from the flagpole data", function () {
        cy.visit(baseURL).then(function () {
          cy.get('.flagpole-container').should('have.length', flagpoleKeys.length)
        })
      })

      it("Shows each flagpole as an element", function () {
          for (let i=0; i<flagpoleKeys.length;i++){
            cy.get('[data-flagpole='+flagpoleKeys[i].toUpperCase()).then(function(flagpoleElem) {
              expect(flagpoleElem).to.have.length(1)
            })
          }
        })

      it("Shows each flagpole current value correctly", function () {
        for (let i=0; i<flagpoleKeys.length;i++){
          let flagpoleNameText = flagpoleKeys[i].toUpperCase(),
            flagpoleValueText = flagpoleData[flagpoleKeys[i]]?'TRUE':'FALSE';
          cy.get('[data-flagpole="'+flagpoleNameText+'"]').then(function(flagpoleElem) {
            cy.wrap(flagpoleElem).find('.flagpole-value').contains(flagpoleValueText)
          })
        }
      })

      it("Shows edit controls for each flagpole value correctly", function () {
        for (let i = 0; i < flagpoleKeys.length; i++) {
          let flagpoleNameText = flagpoleKeys[i].toUpperCase(),
            flagpoleValue = flagpoleData[flagpoleKeys[i]];
          if (flagpoleValue) {
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="ON"]:checked').should('exist');
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="OFF"]:checked').should('not.exist')
          } else {
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="ON"]:checked').should('not.exist');
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="OFF"]:checked').should('exist')
          }
        }
      })
    })
})



