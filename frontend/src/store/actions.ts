import { ErrorCodes } from '../error';
import { BisFunctionDto } from './bis-function.types';
import {  BisMetricDto, Myself } from './types';

/* Action Types */
export const actionTypes = {
  LOGGED_IN: 'LOGGED_IN' as 'LOGGED_IN',

  //

  GET_MYSELF: 'GET_MYSELF' as 'GET_MYSELF',
  GET_MYSELF_SUCCESS: 'GET_MYSELF_SUCCESS' as 'GET_MYSELF_SUCCESS',
  GET_MYSELF_FAILURE: 'GET_MYSELF_FAILURE' as 'GET_MYSELF_FAILURE',

  PLAN: 'PLAN_ALPHA_BETA' as 'PLAN_ALPHA_BETA',
  PLAN_SUCCESS: 'PLAN_SUCCESS' as 'PLAN_SUCCESS',
  PLAN_FAILURE: 'PLAN_FAILURE' as 'PLAN_FAILURE',

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

export interface Plan {
  type: typeof actionTypes.PLAN;
}

export interface PlanSuccess {
  type: typeof actionTypes.PLAN_SUCCESS;
  payload: {
    bisFunctions: BisFunctionDto[];
    bisMetrics: BisMetricDto[];
  };
}

export interface PlanFailure {
  type: typeof actionTypes.PLAN_FAILURE;
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
  typeof actionTypes.PLAN_FAILURE ;

export type FailureAppAction =
  | GetMyselfFailure
  | PlanFailure
  | LogOutEnduserFailure;

export type AppAction =
  | LoggedIn
  | GetMyself
  | GetMyselfSuccess
  | GetMyselfFailure
  | Plan
  | PlanSuccess
  | PlanFailure
  | LogOutEnduser
  | LogOutEnduserSuccess
  | LogOutEnduserFailure
  | SetProviderInitialValues
  | SetProviderValues
  | SetChosenServiceType;
