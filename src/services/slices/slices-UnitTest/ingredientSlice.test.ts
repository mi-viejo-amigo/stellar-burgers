import { expect, test, describe, jest } from '@jest/globals';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { ingredientSlice, getAllIngredients } from '../ingredientSlice';
import { getIngredientsApi } from '@api';

const expectedResult = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  }
];

// Мокируем getIngredientsApi (которую внутри себя юзает наша Санка)
// Чтобы возвращать предсказуемое значение
jest.mock('@api');
(getIngredientsApi as jest.Mock).mockImplementation(() =>
  Promise.resolve(expectedResult)
);

describe('[ingredientSlice] - should handle async actions', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: { ingredients: ingredientSlice.reducer }
    });
  });

  test('should get ingredients', () => {
    store.dispatch(getAllIngredients.fulfilled(expectedResult, ''));
    const ingredients = store.getState().ingredients.ingredients;
    expect(ingredients).toEqual(expectedResult);
  });

  test('should change loading status in the Store', () => {
    store.dispatch(getAllIngredients.pending(''));
    const loading = store.getState().ingredients.loading;
    expect(loading).toBe(true);
  });

  test('should finish correctly with an error, save errorMassage and change loading status', () => {
    (getIngredientsApi as jest.Mock).mockRejectedValueOnce(
      'request finished with error' as never
    );

    store.dispatch(
      getAllIngredients.rejected(new Error('request finished with error'), '')
    );
    const { loading, error } = store.getState().ingredients;
    expect(loading).toBeFalsy();
    expect(error).toBe('request finished with error');
  });
});
