describe('Display flagpole data ....', function () {
  let endpoint = 'http://localhost:3000/get';

  it("Show the initial page", function () {
    cy.visit('http://localhost:3000/')

    cy.get('#loadFlagpolesBtn').click().then(($flagpoleList) =>{
    cy.get('.flagpole-name').should('have.length', 4)
    })
  });
});


