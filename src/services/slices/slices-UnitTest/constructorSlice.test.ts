import { describe, expect, test, jest } from '@jest/globals';
import { constructorSlice, initialState } from '../constructorSlice';
import { TConstructorIngredient } from '../../../utils/types';
import { nanoid } from '@reduxjs/toolkit';

// Мокируем nanoid, чтобы возвращать предсказуемое значение
jest.mock('@reduxjs/toolkit', () => {
  const actualToolkit = jest.requireActual('@reduxjs/toolkit');
  return {
    ...(actualToolkit as object),
    nanoid: jest.fn(() => 'Mocked-ID') // Указываем значение, которое нужно вернуть
  };
});

const bun = {
  _id: '1',
  name: 'test',
  type: 'bun',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 1,
  image: 'test',
  image_mobile: 'test',
  image_large: 'test'
};

const sauce = { ...bun, type: 'sauce' };
const main = { ...sauce, type: 'main' };

const stateForMoveIngredients = {
  ...initialState,
  constructorItems: {
    bun: null,
    ingredients: [
      { ...sauce, id: '1' },
      { ...main, id: '2' }
    ]
  }
};

describe('[ constructorSlice ] - Handles actions correctly', () => {
  const addBunAction = constructorSlice.actions.addIngredient(bun);
  const addMainAction = constructorSlice.actions.addIngredient(main);
  let newState = constructorSlice.reducer(initialState, addBunAction);

  test('Handles the add ingredient action', () => {
    newState = constructorSlice.reducer(newState, addMainAction);

    expect(newState.constructorItems.bun).toEqual({
      ...bun,
      id: 'Mocked-ID'
    });

    expect(newState.constructorItems.ingredients.length).toEqual(1);
    expect(newState.constructorItems.ingredients[0]).toEqual({
      ...main,
      id: 'Mocked-ID'
    });
  });

  test('Handles the remove ingredient action', () => {
    const mainToRemove = newState.constructorItems
      .ingredients[0] as TConstructorIngredient;
    const removeMainAction =
      constructorSlice.actions.removeIngredient(mainToRemove);
    newState = constructorSlice.reducer(newState, removeMainAction);
    expect(newState.constructorItems.ingredients.length).toEqual(0);
  });

  test('Handles the correct ingridient move up/down action', () => {
    // Попытка передвинуть вниз элемент массива который итак занимает последний индекс.
    // В этом случае ничего не должно меняться
    const incorectMovingAction = constructorSlice.actions.moveIngredient({
      ingredient: stateForMoveIngredients.constructorItems.ingredients[1],
      moveTo: 'down'
    });

    let stateWithMovedIngredient = constructorSlice.reducer(
      stateForMoveIngredients,
      incorectMovingAction
    );
    expect(stateWithMovedIngredient).toEqual(stateForMoveIngredients);

    // Корректное передвижение последнего элемента массива к началу.
    // Массив должен поменяться
    const moveAction = constructorSlice.actions.moveIngredient({
      ingredient: stateForMoveIngredients.constructorItems.ingredients[1],
      moveTo: 'up'
    });

    stateWithMovedIngredient = constructorSlice.reducer(
      stateWithMovedIngredient,
      moveAction
    );
    expect(stateWithMovedIngredient.constructorItems.ingredients).toEqual([
      { ...main, id: '2' },
      { ...sauce, id: '1' }
    ]);
  });
});
