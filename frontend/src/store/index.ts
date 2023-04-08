import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { SagaIterator } from '@redux-saga/types';
import {
  AppState,
  RootReducer,
  RootReducerInitialState,
} from './reducer';
import { AppAction } from './actions';
import { rootSaga } from './sagas';
import { configureStore } from '@reduxjs/toolkit';

export type AppSaga = SagaIterator<AppState>;

/* Setting up saga and store */
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore<
  AppState,
  AppAction
>(
  {
    reducer: RootReducer,
    preloadedState: RootReducerInitialState,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
    middleware: [sagaMiddleware],
    devTools: true
  }
);

sagaMiddleware.run(rootSaga);
