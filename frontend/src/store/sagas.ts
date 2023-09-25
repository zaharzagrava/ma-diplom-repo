import axios from 'axios';
import { put, call, takeLeading } from 'redux-saga/effects';
import { ErrorCodes } from '../error';
import { firebaseAuth } from '../firebase';
import router from '../router';
import {
  actionTypes, AppAction, BisFunctionDelete, BisFunctionOrderChange, BisFunctionUpsert, EntityDelete, EntityUpsert, FailureAppAction, FailureAppActionTypes, ProductionChainUpsert,
} from './actions';
import { Entities, Entity, EntityUpsertable } from './types';

function* errorHandler(
  error: any,
  actionType: FailureAppActionTypes,
) {
  if (error.request && error.response) {
    yield put<FailureAppAction>({
      type: actionType,
      payload: {
        errors:
          error.response.data.message,
      },
    });
  } else if (
    error instanceof TypeError &&
    /network request failed/gi.test(error.message)
  ) {
    yield put<FailureAppAction>({
      type: actionType,
      payload: {
        errors: [ErrorCodes.SERVER_IS_UNAVAILABLE],
      },
    });
  } else {
    yield put<FailureAppAction>({
      type: actionType,
      payload: {
        errors: [ErrorCodes.INTERNAL_FRONTEND_ERROR],
      },
    });
  }
}

function* getMyself() {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.get('http://localhost:8000/api/users/me');
    });

    yield put({
      type: 'GET_MYSELF_SUCCESS',
      payload: {
        myself: response.data,
      },
    });
  } catch (error) {
    firebaseAuth.signOut();

    yield call(errorHandler, error, 'GET_MYSELF_FAILURE');
  }
}

function* plan() {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.post('http://localhost:8000/api/fin-planning');
    });

    yield put<AppAction>({
      type: 'PLAN_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    yield call(errorHandler, error, 'PLAN_FAILURE');
  }
}

function* bisFunctionsGetAll() {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.get('http://localhost:8000/api/bis-function');
    });

    yield put<AppAction>({
      type: 'BIS_FUNCTIONS_GET_ALL_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    yield call(errorHandler, error, 'BIS_FUNCTION_UPSERT_FAILURE');
  }
}

function* bisFunctionUpsert(params: BisFunctionUpsert) {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.post('http://localhost:8000/api/bis-function/upsert', params.payload);
    });

    yield put<AppAction>({
      type: 'BIS_FUNCTION_UPSERT_SUCCESS',
      payload: response.data
    });

    yield put<AppAction>({type: 'PLAN' });
  } catch (error) {
    yield call(errorHandler, error, 'BIS_FUNCTION_UPSERT_FAILURE');
  }
}

function* bisFunctionOrderChange(params: BisFunctionOrderChange) {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.post('http://localhost:8000/api/bis-function/order', params.payload);
    });

    yield put<AppAction>({
      type: 'BIS_FUNCTION_ORDER_CHANGE_SUCCESS',
      payload: response.data
    });

    yield put<AppAction>({type: 'PLAN' });
  } catch (error) {
    yield call(errorHandler, error, 'BIS_FUNCTION_ORDER_CHANGE_FAILURE');
  }
}

function* bisFunctionDelete(params: BisFunctionDelete) {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.post('http://localhost:8000/api/bis-function/delete', params.payload);
    });

    yield put<AppAction>({
      type: 'BIS_FUNCTION_DELETE_SUCCESS',
      payload: response.data
    });

    yield put<AppAction>({type: 'PLAN' });
  } catch (error) {
    yield call(errorHandler, error, 'BIS_FUNCTION_DELETE_FAILURE');
  }
}

function* entitiesGetAll() {
  try {
    const response: {
      data: Entities
    } = yield call(() => {
      return axios.get('http://localhost:8000/api/entities');
    });

    yield put<AppAction>({
      type: 'ENTITIES_GET_ALL_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    yield call(errorHandler, error, 'ENTITIES_GET_ALL_FAILURE');
  }
}

function* entityUpsert(params: EntityUpsert) {
  try {
    const response: {
      data: EntityUpsertable
    } = yield call(() => {
      return axios.post('http://localhost:8000/api/entities', params.payload);
    });

    yield put<AppAction>({
      type: 'ENTITY_UPSERT_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    yield call(errorHandler, error, 'ENTITY_UPSERT_FAILURE');
  }
}

function* entityDelete(params: EntityDelete) {
  try {
    const response: {
      data: string
    } = yield call(() => {
      return axios.delete('http://localhost:8000/api/entities', {
        data: params.payload
      });
    });

    yield put<AppAction>({
      type: 'ENTITY_DELETE_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    yield call(errorHandler, error, 'ENTITY_DELETE_FAILURE');
  }
}

function* productionChainUpsert(params: ProductionChainUpsert) {
  try {
    const response: {
      data: string
    } = yield call(() => {
      return axios.put('http://localhost:8000/api/production-chain', params.payload);
    });

    yield put<AppAction>({
      type: 'ENTITY_DELETE_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    yield call(errorHandler, error, 'ENTITY_DELETE_FAILURE');
  }
}

export const rootSaga = function* rootSaga() {
  yield takeLeading(actionTypes.GET_MYSELF, getMyself);
  yield takeLeading(actionTypes.PLAN, plan);
  yield takeLeading(actionTypes.BIS_FUNCTIONS_GET_ALL, bisFunctionsGetAll);
  yield takeLeading(actionTypes.BIS_FUNCTION_UPSERT, bisFunctionUpsert);
  yield takeLeading(actionTypes.BIS_FUNCTION_ORDER_CHANGE, bisFunctionOrderChange);
  yield takeLeading(actionTypes.BIS_FUNCTION_DELETE, bisFunctionDelete);
  yield takeLeading(actionTypes.ENTITIES_GET_ALL, entitiesGetAll);
  yield takeLeading(actionTypes.ENTITY_UPSERT, entityUpsert);
  yield takeLeading(actionTypes.ENTITY_DELETE, entityDelete);
  yield takeLeading(actionTypes.PRODUCTION_CHAIN_UPSERT, productionChainUpsert);
};
