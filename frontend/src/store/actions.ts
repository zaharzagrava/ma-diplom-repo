import { ErrorCodes } from '../error';
import { Myself, ProviderForEnduser } from './types';

/* Action Types */
export const actionTypes = {
  LOGGED_IN: 'LOGGED_IN' as 'LOGGED_IN',

  //

  GET_MYSELF: 'GET_MYSELF' as 'GET_MYSELF',
  GET_MYSELF_SUCCESS: 'GET_MYSELF_SUCCESS' as 'GET_MYSELF_SUCCESS',
  GET_MYSELF_FAILURE: 'GET_MYSELF_FAILURE' as 'GET_MYSELF_FAILURE',

  GET_ALL_BIS_FUNCTIONS: 'GET_ALL_BIS_FUNCTIONS' as 'GET_ALL_BIS_FUNCTIONS',
  GET_ALL_BIS_FUNCTIONS_SUCCESS: 'GET_ALL_BIS_FUNCTIONS_SUCCESS' as 'GET_ALL_BIS_FUNCTIONS_SUCCESS',
  GET_ALL_BIS_FUNCTIONS_FAILURE: 'GET_ALL_BIS_FUNCTIONS_FAILURE' as 'GET_ALL_BIS_FUNCTIONS_FAILURE',

  LOG_OUT_ENDUSER: 'LOG_OUT_ENDUSER' as 'LOG_OUT_ENDUSER',
  LOG_OUT_ENDUSER_SUCCESS: 'LOG_OUT_ENDUSER_SUCCESS' as 'LOG_OUT_ENDUSER_SUCCESS',
  LOG_OUT_ENDUSER_FAILURE: 'LOG_OUT_ENDUSER_FAILURE' as 'LOG_OUT_ENDUSER_FAILURE',

  /** ui actions */
  SET_PROVIDER_INITIAL_VALUES: 'SET_PROVIDER_INITIAL_VALUES' as 'SET_PROVIDER_INITIAL_VALUES',
  SET_PROVIDER_VALUES: 'SET_PROVIDER_VALUES' as 'SET_PROVIDER_VALUES',

  SET_CHOSEN_SERVICE_TYPE: 'SET_CHOSEN_SERVICE_TYPE' as 'SET_CHOSEN_SERVICE_TYPE',
};

/* Actions */
export interface LoggedIn {
  type: typeof actionTypes.LOGGED_IN;
}

//

export interface GetMyself {
  type: typeof actionTypes.GET_MYSELF;
}

export interface GetMyselfSuccess {
  type: typeof actionTypes.GET_MYSELF_SUCCESS;
  payload: {
    myself: Myself;
  };
}

export interface GetMyselfFailure {
  type: typeof actionTypes.GET_MYSELF_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface GetBisFunctions {
  type: typeof actionTypes.GET_ALL_BIS_FUNCTIONS;
  payload: {
    serviceType: any
  }
}

export interface GetBisFunctionsSuccess {
  type: typeof actionTypes.GET_ALL_BIS_FUNCTIONS_SUCCESS;
  payload: {
    providers: ProviderForEnduser[];
  };
}

export interface GetBisFunctionsFailure {
  type: typeof actionTypes.GET_ALL_BIS_FUNCTIONS_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface LogOutEnduser {
  type: typeof actionTypes.LOG_OUT_ENDUSER;
}

export interface LogOutEnduserSuccess {
  type: typeof actionTypes.LOG_OUT_ENDUSER_SUCCESS;
}

export interface LogOutEnduserFailure {
  type: typeof actionTypes.LOG_OUT_ENDUSER_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

/** UI actions */
export interface SetProviderInitialValues {
  type: typeof actionTypes.SET_PROVIDER_INITIAL_VALUES;
  payload: any;
}

export interface SetProviderValues {
  type: typeof actionTypes.SET_PROVIDER_VALUES;
  payload: any;
}


export interface SetChosenServiceType {
  type: typeof actionTypes.SET_CHOSEN_SERVICE_TYPE;
  payload: any;
}

export type FailureAppActionTypes =
  typeof actionTypes.GET_MYSELF_FAILURE |
  typeof actionTypes.GET_ALL_BIS_FUNCTIONS_FAILURE ;

export type FailureAppAction =
  | GetMyselfFailure
  | GetBisFunctionsFailure
  | LogOutEnduserFailure;

export type AppAction =
  | LoggedIn
  | GetMyself
  | GetMyselfSuccess
  | GetMyselfFailure
  | GetBisFunctions
  | GetBisFunctionsSuccess
  | GetBisFunctionsFailure
  | LogOutEnduser
  | LogOutEnduserSuccess
  | LogOutEnduserFailure
  | SetProviderInitialValues
  | SetProviderValues
  | SetChosenServiceType;
