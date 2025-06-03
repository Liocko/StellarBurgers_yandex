describe('Функциональность конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  const openIngredientDetails = (categoryIndex = 0, itemIndex = 0) => {
    cy.get("[data-cy='ingredients-items']").eq(categoryIndex)
      .find("[data-cy='ingredient-container']").eq(itemIndex)
      .click();
  };
  
  describe('Работа с ингредиентами в конструкторе', () => {
    it('позволяет добавлять различные ингредиенты в конструктор', () => {
      cy.get("[data-cy='noBuns']").should("exist").and("be.visible");
      
      cy.addIngredientToConstructor('bun', 0);
      cy.addIngredientToConstructor('main', 1);
      
      cy.verifyIngredientInConstructor();
    });
  });

  describe('Взаимодействие с модальным окном деталей ингредиента', () => {
    beforeEach(() => {
      openIngredientDetails();
      cy.get("[data-cy='modal']").should("be.visible");
    });

    it('закрывает модальное окно при нажатии на кнопку закрытия', () => {
      cy.get("[data-cy='modal']")
        .find("button")
        .click();
        
      cy.get("[data-cy='modal']").should("not.exist");
    });

    it('закрывает модальное окно при клике на оверлей', () => {
      cy.get("[data-cy='modal-overlay']")
        .click({force: true});
        
      cy.get("[data-cy='modal']").should("not.exist");
    });
    
    it('отображает корректную информацию о выбранном ингредиенте', () => {
      let ingredientName;
      
      cy.get("[data-cy='modal']").should("exist");
      cy.get("[data-cy='ingredient-details-name']")
        .invoke('text')
        .then(text => {
          ingredientName = text;
          expect(ingredientName).to.not.be.empty;
        });
        
      cy.get("[data-cy='ingredient-details-calories']").should("exist");
    });
  });
});
