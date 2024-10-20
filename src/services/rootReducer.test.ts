import { rootReducer, RootState } from './store';
import { initialState as ingredientData } from './slices/ingredientSlice';
import { initialState as constructorBurger } from './slices/constructorSlice';
import { initialState as userData } from './slices/userSlice';
import { initialState as feedsData } from './slices/feedsSlice';
import { expect, test, describe, jest } from '@jest/globals';

describe('rootReducer initiate', () => {
  test('should initiate correctly, and return the initial state', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);
    expect(state).toEqual({
      ingredientData,
      constructorBurger,
      userData,
      feedsData
    });
  });
});
