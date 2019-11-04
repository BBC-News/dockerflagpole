describe('Basic flagpole tests ....', function () {
  let endpoint = Cypress.env('BASEURL');

  it("Show the initial page from the flagpole data", function () {
    cy.readFile(Cypress.env('SOURCE')).then(function(data) {
      let flagpoleKeys = Object.keys(data)
      cy.visit(endpoint).then(function () {
        cy.get('.flagpole-container').should('have.length', flagpoleKeys.length)
      })
    })
  })

  it("Displays the flagpoles data correctly", function () {
    cy.readFile(Cypress.env('SOURCE')).then(function(flagpoleData){
      let flagpoleKeys = Object.keys(flagpoleData);
      for (let i=0; i<flagpoleKeys.length;i++){
        let flagpoleName = flagpoleKeys[i].toUpperCase(),
          flagpoleValue = flagpoleData[flagpoleKeys[i]]?'TRUE':'FALSE';
        cy.get('.flagpole-container').contains(flagpoleName)
          .get('.flagpole-value').contains('FAL')//flagpoleValue)
          //cy.get('[type="checkbox"]').should('be.checked')
          //let checkState = cy.get('[type="checkbox"]').check();
          //expect(checkState).toEqual().toEqual(flagpoleData[flagpoleKeys[i]])
      }
    })
  })

  // it("Displays the flagpoles data correctly", function () {
  //   cy.readFile(Cypress.env('SOURCE')).then(function(flagpoleData){
  //     let flagpoleKeys = Object.keys(flagpoleData);
  //     for (let i=0; i<flagpoleKeys.length;i++){
  //       let flagpoleName = flagpoleKeys[i].toUpperCase(),
  //         flagpoleValue = flagpoleData[flagpoleKeys[i]]?'TRUE':'FALSE';
  //       cy.get('.flagpole-container').contains(flagpoleName).then(function(flagpoleElem){
  //         cy.get('.flagpole-value').contains(flagpoleValue)
  //         //cy.get('[type="checkbox"]').should('be.checked')
  //         //let checkState = cy.get('[type="checkbox"]').check();
  //         //expect(checkState).toEqual().toEqual(flagpoleData[flagpoleKeys[i]])
  //       })
  //     }
  //   })
  //})
})


