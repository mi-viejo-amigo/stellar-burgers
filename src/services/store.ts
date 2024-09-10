import {
  configureStore,
  combineSlices,
  combineReducers
} from '@reduxjs/toolkit';
import { ingredientSlice } from './ingredientSlice';
import { constructorSlice } from './constructorSlice';
import { userSlice } from './userSlice';
import { feedsSlice } from './feedsSlice';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredientData: ingredientSlice.reducer,
  constructorBurger: constructorSlice.reducer,
  userData: userSlice.reducer,
  feedsData: feedsSlice.reducer
  // newBurger: orderSlice.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
