describe('Basic flagpole tests using config.yaml....', function () {
  const env = Cypress.env('ENVIRONMENT'),
    YAML = require('yamljs');
  let baseURL = '', flagpoleData, flagpoleKeys, flagpoleSources;

  it('Set up data ', function () {
    cy.readFile('config.yaml').then((str) => {
      const config = YAML.parse(str);
      flagpoleSources = config[env].sources;
        let defaultSource = config[env].defaultSource,
        source = flagpoleSources[defaultSource];
      cy.log(`env is ${env} and default source is ${defaultSource} --> ${source}`)
      baseURL = config[env].domain;
      cy.readFile(source).then(function (data) {
        flagpoleData = data;
        flagpoleKeys = Object.keys(flagpoleData);
        cy.visit(baseURL).then(function () {
          cy.get('.flagpole-container').should('have.length', flagpoleKeys.length)
        })
      })
    })
  })

  it('Test data sources ', function () {
    let flagpoleSourceKeys = Object.keys(flagpoleSources);
    for (let i=0; i<flagpoleSourceKeys.length;i++) {
      let fullSource = flagpoleSources[flagpoleSourceKeys[i]],
        sourceRoot = /(.*).json$/.exec(fullSource)[1]
      cy.visit(baseURL+'/'+flagpoleSourceKeys[i]).then(function(){
        cy.get('.flagpole-container').should('length.not.to.be',0)
      })
      cy.visit(baseURL+'/'+fullSource).then(function(){
        cy.get('.flagpole-container').should('length.not.to.be',0)
      })
      cy.visit(baseURL+'/'+sourceRoot).then(function(){
        cy.get('.flagpole-container').should('length.not.to.be',0)
      })
    }
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
          let flagpole = flagpoleData[flagpoleKeys[i]],
            flagpoleNameText = flagpole.name.toUpperCase(),
            flagpoleValueText = flagpole.value?flagpole.trueName:flagpole.falseName,
            flagpoleValueTextDesc = flagpole.value?flagpole.trueDesc:flagpole.falseDesc;

          cy.get('[data-flagpole="'+flagpoleNameText+'"]').then(function(flagpoleElem) {
            cy.wrap(flagpoleElem).find('.flagpole-value').contains(flagpoleValueText);

            cy.wrap(flagpoleElem).find('.flagpole-value-desc').contains(flagpoleValueTextDesc)
          })
        }
      })

      it("Shows edit controls for each flagpole value correctly", function () {
        for (let i = 0; i < flagpoleKeys.length; i++) {
          let flagpole = flagpoleData[flagpoleKeys[i]],
            flagpoleNameText = flagpole.name.toUpperCase(),
            flagpoleValue = flagpole.value,
            flagpoleTrueName = flagpole.trueName,
            flagpoleFalseName = flagpole.falseName;

          if (flagpoleValue) {
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="'+flagpoleTrueName+'"]:checked').should('exist');
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="'+flagpoleFalseName+'"]:checked').should('not.exist')
          } else {
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="'+flagpoleTrueName+'"]:checked').should('not.exist');
            cy.get('[name="' + flagpoleNameText + '"][data-check-role="'+flagpoleFalseName+'"]:checked').should('exist')
          }
        }
      })
    })
})



