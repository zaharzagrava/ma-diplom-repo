import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import { ErrorCodes } from '../error';
import { firebaseAuth } from '../firebase';
import router from '../router';
import {
  actionTypes, FailureAppAction, FailureAppActionTypes,
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
  //
};
