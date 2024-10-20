/// <reference types="cypress" />

describe('[constructor] add an ingredient correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('http://127.0.0.1:4000/');
  });
  it('should add bun correctly', () => {
    cy.get('[data-cy="bun"]').contains('Добавить').click();

    const bunPlacesInConstructor = ['top', 'bottom'];

    bunPlacesInConstructor.forEach((place) => {
      cy.get(`[data-cy="constructor_bun-${place}"]`)
        .contains('Ингредиент - 1')
        .should('exist');
    });
  });
  it('should add (main or sauce*) correctly', () => {
    cy.get('[data-cy="sauce"]').contains('Добавить').click();

    cy.get('[data-cy="constructor_ingredients-midle"]')
      .contains('Ингредиент - 4')
      .should('exist');
  });
});

describe('[Modal window] open/close correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('http://127.0.0.1:4000/');
  });
  it('should open modal by click on an ingredient card, then close by closeIcon', () => {
    cy.get('[data-cy="sauce"]').contains('Ингредиент - 4').click();
    cy.get('[data-cy="modal"]').should('exist');

    cy.get('[data-cy="modal_close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('modal should be closed by overlay click', () => {
    cy.get('[data-cy="sauce"]').contains('Ингредиент - 4').click();
    cy.get('[data-cy="modal"]').should('exist');

    // Кликнуть по Overlay
    cy.get('body').click(10, 10); // Симулирует клик в левый верхний угол
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('[order] creates correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    // Перехват Юзера
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    // Установка токена в куки
    cy.setCookie('accessToken', 'Bearer fakeToken');
    // Установка токенов в локальное хранилище
    cy.window().then((win: Window & typeof globalThis) => {
      win.localStorage.setItem('refreshToken', 'fake');
    });
    cy.viewport(1920, 1080);
    cy.visit('http://127.0.0.1:4000/');

    cy.get('[data-cy="bun"]').contains('Добавить').click();
    cy.get('[data-cy="sauce"]').contains('Добавить').click();
    cy.get('[data-cy="main"]').contains('Добавить').click();
  });
  // отчищаем локальное хранилище и куки
  afterEach(() => {
    cy.window().then((win: Window & typeof globalThis) => {
      win.localStorage.clear();
    });
    cy.clearCookie('accessToken');
  });

  it('should create order, then show modal with correct order number', () => {
    cy.intercept('POST', 'api/orders', {
      fixture: 'post_order.json'
    });
    cy.get('body').contains('Оформить заказ').click();
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="order_number"]').should('contain', '3000');
  });

  it('should close order modal, and constructor should be empty', () => {
    cy.intercept('POST', 'api/orders', {
      fixture: 'post_order.json'
    });
    cy.get('body').contains('Оформить заказ').click();
    cy.get('[data-cy="modal_close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="constructor_bun-top_clear"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-cy="constructor_ingredients-midle"]').should(
      'contain',
      'Выберите начинку'
    );
    cy.get('[data-cy="constructor_bun-bottom_clear"]').should(
      'contain',
      'Выберите булки'
    );
  });
});
