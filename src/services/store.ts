import {
  configureStore,
  combineSlices,
  combineReducers
} from '@reduxjs/toolkit';
import { ingredientSlice } from './slices/ingredientSlice';
import { constructorSlice } from './slices/constructorSlice';
import { userSlice } from './slices/userSlice';
import { feedsSlice } from './slices/feedsSlice';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  ingredientData: ingredientSlice.reducer,
  constructorBurger: constructorSlice.reducer,
  userData: userSlice.reducer,
  feedsData: feedsSlice.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
