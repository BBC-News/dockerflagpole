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
          flagpole = flagpoleData[flagpoleKeys[i]],
          flagpoleValue = flagpole.value,
          flagpoleValueText = flagpoleValue?flagpole.trueName:flagpole.falseName,
          trueSelector = '[name="' + flagpoleNameText + '"][data-check-role="' + flagpole.trueName + '"]',
          falseSelector = '[name="' + flagpoleNameText + '"][data-check-role="' + flagpole.falseName + '"]';

        if (flagpoleValue) {
          cy.get(falseSelector).check();
          cy.get(trueSelector + ':checked').should('not.exist');
          cy.get(falseSelector + ':checked').should('exist');
        } else {
          cy.get(trueSelector).check();
          cy.get(trueSelector + ':checked').should('exist');
          cy.get(falseSelector + ':checked').should('not.exist')
        }
        cy.get('[data-flagpole="' + flagpoleNameText + '"]').find('.flagpole-value')
          .contains(flagpoleValueText)
      }
    })

    it("Use edit controls and update the value of each flagpole", function () {
      for (let i = 0; i < flagpoleKeys.length; i++) {
        let flagpole = flagpoleData[flagpoleKeys[i]],
          flagpoleNameText = flagpoleKeys[i].toUpperCase(),
          flagpoleValue = flagpole.value,
          flagpoleValueReverseText = !flagpole.value ? flagpole.trueName : flagpole.falseName,
          flagpoleValueReverseTextDesc = !flagpole.value ? flagpole.trueDesc : flagpole.falseDesc,
          selector = '[data-flagpole="' + flagpoleNameText + '"]';

        cy.get(selector).find('.flagpole-mod-date').then(function(modDateEl) {
          let origModDate=Date.parse(modDateEl.text()||'01 Jan 1970');
          cy.log('Orig mod date :'+origModDate)

          if (flagpoleValue) {
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="' + flagpole.falseName + '"]').check();
          } else {
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="' + flagpole.trueName + '"]').check();
          }

          // Enforce a wait to make sure that the modification dates don't clash
          cy.wait(1100)
          cy.get(selector).find('.update-button').click().then(function () {
            cy.get(selector).find('.flagpole-value').contains(flagpoleValueReverseText)
            cy.get(selector).find('.flagpole-value-desc').contains(flagpoleValueReverseTextDesc)

            cy.get(selector).find('.flagpole-mod-date').then(function(newModDateElem) {
              let newModDate=Date.parse(newModDateElem.text());
              cy.log('New mod date :'+newModDate)
              expect(isNaN(newModDate)).to.be.false;
              expect(newModDate).to.be.greaterThan(origModDate)
            })

          })
        })
      }
    })

    it('Reread test data after update in last test ', function () {
      cy.readFile('config.yaml').then((str) => {
        const config = YAML.parse(str);
        baseURL = config[env].domain;
        cy.readFile(config[env]['source']).then(function (data) {
          flagpoleData = data;
          flagpoleKeys = Object.keys(flagpoleData);
        })
      })
    })

    it("Use edit controls again to reverse the value of each flagpole", function () {
      for (let i = 0; i < flagpoleKeys.length; i++) {
        let flagpole = flagpoleData[flagpoleKeys[i]],
          flagpoleNameText = flagpoleKeys[i].toUpperCase(),
          flagpoleValue = flagpole.value,
          flagpoleValueReverseText = !flagpole.value ? flagpole.trueName : flagpole.falseName,
          flagpoleValueReverseTextDesc = !flagpole.value ? flagpole.trueDesc : flagpole.falseDesc,
          selector = '[data-flagpole="' + flagpoleNameText + '"]';

        cy.get(selector).find('.flagpole-mod-date').then(function(modDateEl) {
          let modificationDateString = modDateEl.text()
          expect(modificationDateString).is.not("");
          let origModDate=Date.parse(modificationDateString);

          if (flagpoleValue) {
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="' + flagpole.falseName + '"]').check();
          } else {
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="' + flagpole.trueName + '"]').check();
          }

          // Enforce a wait to make sure that the modification dates don't clash
          cy.wait(1100);

          cy.get(selector).find('.update-button').click().then(function () {
            cy.get(selector).find('.flagpole-value').contains(flagpoleValueReverseText);
            cy.get(selector).find('.flagpole-value-desc').contains(flagpoleValueReverseTextDesc)

            cy.get(selector).find('.flagpole-mod-date').then(function (newModDateElem) {
              let newModDate = Date.parse(newModDateElem.text());
              expect(isNaN(newModDate)).to.be.false;
              expect(newModDate).to.be.greaterThan(origModDate)
            })
          })
        })
      }
    })

  })
})

