describe('Процесс оформления заказа', () => {
    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', 'api/auth/user', { fixture: 'token.json'}).as('token');
        cy.intercept('POST', 'api/orders', { fixture: 'orders.json'}).as('orders');
// seven
        window.localStorage.setItem('refreshToken', 'test-refresh-token');
        cy.setCookie('accessToken', 'test-access-token');

        cy.visit('/');
        cy.wait('@getIngredients');
    });
    
    afterEach(() => {
        window.localStorage.removeItem('refreshToken');
        cy.clearCookie('accessToken');
    });

    it('позволяет собрать и оформить заказ с отображением номера заказа', () => {
        cy.get("[data-cy='noBuns']").should("exist");
        
        // Добавляем ингредиенты разных типов в конструктор
        cy.addIngredientToConstructor('bun');
        cy.addIngredientToConstructor('main', 0);
        cy.addIngredientToConstructor('sauce', 0);
        
        // Проверяем, что ингредиенты добавлены
        cy.get("[data-cy='burger-constructor-element']").should("exist");
        cy.get("[data-cy='burger-constructor-element-fullwidth']").should("exist");
        
        // Оформляем заказ
        cy.get("[data-cy='place-order']").click();
        
        // Проверяем модальное окно с номером заказа
        cy.wait('@orders');
        cy.get("[data-cy='modal']").should("be.visible");
        cy.get("[data-cy='order-details-title']").first()
            .should('have.text', '71808')
            .and('be.visible');
            
        // Закрываем модальное окно
        cy.get("[data-cy='modal']")
            .find("button")
            .click();
      
        cy.get("[data-cy='modal']").should("not.exist");
        
        // Проверяем, что конструктор очистился
        cy.get("[data-cy='noBuns']").should("exist");
    });
});
