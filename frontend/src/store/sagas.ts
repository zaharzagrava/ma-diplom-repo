import axios from 'axios';
import { put, call, takeLatest, takeLeading } from 'redux-saga/effects';
import { ErrorCodes } from '../error';
import { firebaseAuth } from '../firebase';
import router from '../router';
import {
  actionTypes, AppAction, BisFunctionUpsert, FailureAppAction, FailureAppActionTypes,
} from './actions';

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
      return axios.post('http://localhost:8000/api/bis-function', params.payload);
    });

    yield put<AppAction>({
      type: 'BIS_FUNCTION_UPSERT_SUCCESS',
      payload: response.data
    });

    yield put<AppAction>({type: 'PLAN',});
  } catch (error) {
    yield call(errorHandler, error, 'BIS_FUNCTION_UPSERT_FAILURE');
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

function* getMyself() {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.get('http://localhost:8000/api/users/me');
    });

    router.navigate(`/home`);

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

export const rootSaga = function* rootSaga() {
  yield takeLeading(actionTypes.GET_MYSELF, getMyself);
  yield takeLeading(actionTypes.PLAN, plan);
  yield takeLeading(actionTypes.BIS_FUNCTION_UPSERT, bisFunctionUpsert);
  yield takeLeading(actionTypes.BIS_FUNCTIONS_GET_ALL, bisFunctionsGetAll);
};
