describe('Active flagpole tests using config.yaml....', function () {
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

  describe("Ensure that flagpole app behaviour is consistent", function() {

    it("Use edit controls for each flagpole with no update to current value", function () {
      for (let i = 0; i < flagpoleKeys.length; i++) {
        let flagpoleNameText = flagpoleKeys[i].toUpperCase(),
          flagpoleValue = flagpoleData[flagpoleKeys[i]],
          flagpoleValueText = flagpoleValue?'TRUE':'FALSE';
        if (flagpoleValue) {
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="OFF"]').check();
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="ON"]:checked').should('not.exist');
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="OFF"]:checked').should('exist');
        } else {
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="ON"]').check();
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="ON"]:checked').should('exist');
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="OFF"]:checked').should('not.exist')
        }
        cy.get('[data-flagpole="' + flagpoleNameText + '"]').find('.flagpole-value').contains(flagpoleValueText)
      }
    })

    it("Use edit controls and update the value of each flagpole", function () {
      for (let i = 0; i < flagpoleKeys.length; i++) {
        let flagpoleNameText = flagpoleKeys[i].toUpperCase(),
          flagpoleValue = flagpoleData[flagpoleKeys[i]],
          flagpoleValueReverseText = !flagpoleValue?'TRUE':'FALSE';
        if (flagpoleValue) {
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="OFF"]').check();
        } else {
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="ON"]').check();
        }
        cy.get('[data-flagpole="' + flagpoleNameText + '"]').find('.update-button').click().then(function() {
          cy.get('[data-flagpole="' + flagpoleNameText + '"]').find('.flagpole-value').contains(flagpoleValueReverseText)
        })
      }
    })

    it("Use edit controls again to reverse the value of each flagpole", function () {
      for (let i = 0; i < flagpoleKeys.length; i++) {
        let flagpoleNameText = flagpoleKeys[i].toUpperCase(),
          flagpoleValue = flagpoleData[flagpoleKeys[i]],
          flagpoleValueReverseText = !flagpoleValue?'TRUE':'FALSE';
        if (flagpoleValue) {
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="OFF"]').check();
        } else {
          cy.get('[name="' + flagpoleNameText + '"][data-check-role="ON"]').check();
        }
        cy.get('[data-flagpole="' + flagpoleNameText + '"]').find('.update-button').click().then(function() {
          cy.get('[data-flagpole="' + flagpoleNameText + '"]').find('.flagpole-value').contains(flagpoleValueReverseText)
        })
      }
    })

  })
})

