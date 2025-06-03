Cypress.Commands.add('clickIngredientInIndexedContainer', (index: number) => { 
    cy.get("[data-cy='ingredients-items']").eq(index)
    .find("[data-cy='ingredient-container']").first()
    .find("button").click();
});
// eight
Cypress.Commands.add('checkModalViibility', (isModalVisible: boolean) => { 
    cy.get("[data-cy='modal']").should(`${!isModalVisible ? "not." : ""}exist`);
});

Cypress.Commands.add('addIngredientToConstructor', (type: string, index: number = 0) => {
    const typeMap = {
        'bun': 0,
        'sauce': 1,
        'main': 2
    };
    
    cy.get("[data-cy='ingredients-items']").eq(typeMap[type])
        .find("[data-cy='ingredient-container']").eq(index)
        .click({force: true});
});

Cypress.Commands.add('verifyIngredientInConstructor', () => {
    cy.get("[data-cy='burger-constructor-element']").should("be.visible");
    cy.get("[data-cy='burger-constructor-element-fullwidth']").should("be.visible");
});

declare namespace Cypress {
    interface Chainable {
      clickIngredientInIndexedContainer(index: number): Chainable<void>;
      checkModalViibility(isModalVisible: boolean): Chainable<void>;
      addIngredientToConstructor(type: string, index?: number): Chainable<void>;
      verifyIngredientInConstructor(): Chainable<void>;
    }
}
