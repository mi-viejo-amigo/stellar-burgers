import { expect, test, describe, jest, beforeEach } from '@jest/globals';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import {
  setUser,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  getUserOrders,
  userSlice,
  setIsAuthChecked,
  clearUser
} from '../userSlice';

const mockedUser = {
  email: 'a@a.ru',
  name: 'Nikita'
};

const mockedRegisterData = {
  email: 'a@a.ru',
  name: 'Nikita',
  password: '123456'
};

const mockedLoginData = {
  email: 'a@a.ru',
  password: '123456'
};

const mockedUserOrders = [
  {
    _id: '670ebd1cd829be001c7766d3',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093e'
    ],
    status: 'done',
    name: 'Краторный био-марсианский люминесцентный бургер',
    createdAt: '2024-10-15T19:06:04.609Z',
    updatedAt: '2024-10-15T19:06:06.386Z',
    number: 56566
  },
  {
    _id: '670eb834d829be001c7766ca',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa0947',
      '643d69a5c3f7b9001cfa0947',
      '643d69a5c3f7b9001cfa0949',
      '643d69a5c3f7b9001cfa0949'
    ],
    status: 'done',
    name: 'Флюоресцентный фалленианский экзо-плантаго люминесцентный метеоритный бургер',
    createdAt: '2024-10-15T18:45:08.201Z',
    updatedAt: '2024-10-15T18:45:09.986Z',
    number: 56565
  }
];

describe('[userSlice]', () => {
  // Наш СТОР для тестирования
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: { user: userSlice.reducer }
    });
  });

  test('action [setUser] should set Users dates', () => {
    const posibleUserStates = [mockedUser, null];

    posibleUserStates.forEach((data) => {
      store.dispatch(setUser(data));
      const { user } = store.getState().user;
      expect(user).toEqual(data);
    });
  });

  test('action [setIsAuthChecked] should chenge userAuth status', () => {
    store.dispatch(setIsAuthChecked(true));
    const { isAuthChecked } = store.getState().user;
    expect(isAuthChecked).toBeTruthy();
  });

  test('action [clearUser] should set user to null', () => {
    store.dispatch(setUser(mockedUser));
    store.dispatch(clearUser());
    const { user } = store.getState().user;
    expect(user).toBeNull();
  });

  test('asinc action [registerUser] should change registerRequest to false', () => {
    store.dispatch(registerUser.pending('', mockedRegisterData));
    const { registerRequest } = store.getState().user;
    expect(registerRequest).toBeFalsy();
  });

  test('asinc action [registerUser] should chenge registerRequest status and set error correctly', () => {
    store.dispatch(
      registerUser.rejected(
        new Error('request finished with error'),
        '',
        mockedRegisterData
      )
    );
    const { registerRequest, error } = store.getState().user;
    expect(registerRequest).toBeFalsy();
    expect(error).toEqual('request finished with error');
  });

  test('asinc action [registerUser] should chenge registerRequest status and set error correctly', () => {
    store.dispatch(
      registerUser.fulfilled(
        { success: true, refreshToken: '', accessToken: '', user: mockedUser },
        '',
        mockedRegisterData
      )
    );
    const { registerRequest, error } = store.getState().user;
    expect(registerRequest).toBeTruthy();
    expect(error).toEqual('');
  });

  test('asinc action [loginUser] should chenge cleare error and set authChecked to false, while pending request', () => {
    store.dispatch(loginUser.pending('', mockedLoginData));
    const { isAuthChecked, error } = store.getState().user;
    expect(isAuthChecked).toBe(false);
    expect(error).toEqual('');
  });

  test('asinc action [loginUser] should set authChecked and error, when it is rejected', () => {
    store.dispatch(
      loginUser.rejected(
        new Error('email or password are incorrect'),
        '',
        mockedLoginData,
        { rejectedWithValue: true }
      )
    );
    const { isAuthChecked, error } = store.getState().user;
    expect(isAuthChecked).toBe(true);
    expect(error).toEqual(expect.any(String));
  });

  test('asinc action [loginUser] should set authChecked, set User and clere error, when it is fulfilled', () => {
    store.dispatch(
      loginUser.fulfilled(
        { success: true, refreshToken: '', accessToken: '', user: mockedUser },
        '',
        mockedLoginData
      )
    );
    const { isAuthChecked, error, user } = store.getState().user;
    expect(user).toEqual(mockedUser);
    expect(isAuthChecked).toBe(true);
    expect(error).toEqual('');
  });

  test('asinc action [updateUser] should set new UserData, when it is fulfilled', () => {
    store.dispatch(
      updateUser.fulfilled(
        { success: true, user: mockedUser },
        '',
        mockedRegisterData
      )
    );
    const { user } = store.getState().user;
    expect(user).toEqual(mockedUser);
  });

  test('asinc action [getUserOrders] should set userOrders, when it is fulfilled', () => {
    store.dispatch(getUserOrders.fulfilled(mockedUserOrders, '', undefined));
    const { userOrders } = store.getState().user;
    expect(userOrders).toEqual(mockedUserOrders);
  });

  test('asinc action [getUserOrders] should set request as True, while pending', () => {
    store.dispatch(getUserOrders.pending(''));
    const { orderRequest } = store.getState().user;
    expect(orderRequest).toBeTruthy();
  });
});
