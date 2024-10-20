import { expect, test, describe, jest, beforeEach } from '@jest/globals';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { feedsSlice, getOrderByNumber, getFeeds } from '../feedsSlice';

const mockedUserOrders = [
  {
    _id: '1',
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
    _id: '2',
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

describe('[feedsSlice] - should handle async actions', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: { feeds: feedsSlice.reducer }
    });
  });

  test('asinc action [getFeeds] should set Data correctly, when it is fulfilled', () => {
    store.dispatch(
      getFeeds.fulfilled(
        { orders: mockedUserOrders, total: 555, totalToday: 3, success: true },
        '',
        undefined
      )
    );
    const { orders, total, totalToday } = store.getState().feeds;
    const expectedResult = {
      orders: mockedUserOrders,
      total: 555,
      totalToday: 3
    };
    expect({ orders, total, totalToday }).toEqual(expectedResult);
  });

  test('asinc action [getFeeds] should chenge loading status, while it is pending', () => {
    store.dispatch(getFeeds.pending(''));
    const { isLoading } = store.getState().feeds;
    expect(isLoading).toBeTruthy();
  });

  test('asinc action [getOrderByNumber] should set order by ID', () => {
    store.dispatch(
      getOrderByNumber.fulfilled(
        { orders: mockedUserOrders, success: true },
        '',
        1 // order id
      )
    );
    const { orderByNumber } = store.getState().feeds;
    expect(orderByNumber).toEqual(mockedUserOrders[0]);
  });
});

// getOrderByNumber
