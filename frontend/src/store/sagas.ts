import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import { ErrorCodes } from '../error';
import { firebaseAuth } from '../firebase';
import router from '../router';
import {
  actionTypes, AppAction, FailureAppAction, FailureAppActionTypes,
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

function* plan() {
  try {
    const response: {
      data: any
    } = yield call(() => {
      return axios.get('http://localhost:8000/api/fin-planning/plan');
    });

    yield put<AppAction>({
      type: 'PLAN_SUCCESS',
      payload: {
        bisFunctions: response.data.bisFunctions,
        bisMetrics: response.data.bisMetrics,
      },
    });
  } catch (error) {
    firebaseAuth.signOut();

    yield call(errorHandler, error, 'GET_MYSELF_FAILURE');
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
  yield takeLatest(actionTypes.GET_MYSELF, getMyself);
  yield takeLatest(actionTypes.PLAN, plan);
};
