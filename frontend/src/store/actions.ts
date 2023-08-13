import { ErrorCodes } from "../error";
import { BisFunctionChangeOrderDto as BisFunctionOrderChangeDto, BisFunctionDeleteDto, BisFunctionDto, BisFunctionEditDto } from "./bis-function.types";
import { BisMetriscDto, Credit, Entities, Entity, Myself, Product, Resource } from "./types";

/* Action Types */
export const actionTypes = {
  LOGGED_IN: "LOGGED_IN" as "LOGGED_IN",

  //

  GET_MYSELF: "GET_MYSELF" as "GET_MYSELF",
  GET_MYSELF_SUCCESS: "GET_MYSELF_SUCCESS" as "GET_MYSELF_SUCCESS",
  GET_MYSELF_FAILURE: "GET_MYSELF_FAILURE" as "GET_MYSELF_FAILURE",

  PLAN: "PLAN" as "PLAN",
  PLAN_SUCCESS: "PLAN_SUCCESS" as "PLAN_SUCCESS",
  PLAN_FAILURE: "PLAN_FAILURE" as "PLAN_FAILURE",

  BIS_FUNCTIONS_GET_ALL: "BIS_FUNCTIONS_GET_ALL" as "BIS_FUNCTIONS_GET_ALL",
  BIS_FUNCTIONS_GET_ALL_SUCCESS:
    "BIS_FUNCTIONS_GET_ALL_SUCCESS" as "BIS_FUNCTIONS_GET_ALL_SUCCESS",
  BIS_FUNCTIONS_GET_ALL_FAILURE:
    "BIS_FUNCTIONS_GET_ALL_FAILURE" as "BIS_FUNCTIONS_GET_ALL_FAILURE",

  BIS_FUNCTION_UPSERT: "BIS_FUNCTION_UPSERT" as "BIS_FUNCTION_UPSERT",
  BIS_FUNCTION_UPSERT_SUCCESS:
    "BIS_FUNCTION_UPSERT_SUCCESS" as "BIS_FUNCTION_UPSERT_SUCCESS",
  BIS_FUNCTION_UPSERT_FAILURE:
    "BIS_FUNCTION_UPSERT_FAILURE" as "BIS_FUNCTION_UPSERT_FAILURE",

  BIS_FUNCTION_ORDER_CHANGE: "BIS_FUNCTION_ORDER_CHANGE" as "BIS_FUNCTION_ORDER_CHANGE",
  BIS_FUNCTION_ORDER_CHANGE_SUCCESS:
    "BIS_FUNCTION_ORDER_CHANGE_SUCCESS" as "BIS_FUNCTION_ORDER_CHANGE_SUCCESS",
  BIS_FUNCTION_ORDER_CHANGE_FAILURE:
    "BIS_FUNCTION_ORDER_CHANGE_FAILURE" as "BIS_FUNCTION_ORDER_CHANGE_FAILURE",

  BIS_FUNCTION_DELETE: "BIS_FUNCTION_DELETE" as "BIS_FUNCTION_DELETE",
  BIS_FUNCTION_DELETE_SUCCESS:
    "BIS_FUNCTION_DELETE_SUCCESS" as "BIS_FUNCTION_DELETE_SUCCESS",
  BIS_FUNCTION_DELETE_FAILURE:
    "BIS_FUNCTION_DELETE_FAILURE" as "BIS_FUNCTION_DELETE_FAILURE",

  ENTITIES_GET_ALL: "ENTITIES_GET_ALL" as "ENTITIES_GET_ALL",
  ENTITIES_GET_ALL_SUCCESS:
    "ENTITIES_GET_ALL_SUCCESS" as "ENTITIES_GET_ALL_SUCCESS",
  ENTITIES_GET_ALL_FAILURE:
    "ENTITIES_GET_ALL_FAILURE" as "ENTITIES_GET_ALL_FAILURE",

  LOG_OUT_ENDUSER: "LOG_OUT_ENDUSER" as "LOG_OUT_ENDUSER",
  LOG_OUT_ENDUSER_SUCCESS:
    "LOG_OUT_ENDUSER_SUCCESS" as "LOG_OUT_ENDUSER_SUCCESS",
  LOG_OUT_ENDUSER_FAILURE:
    "LOG_OUT_ENDUSER_FAILURE" as "LOG_OUT_ENDUSER_FAILURE",

  /** ui actions */
  SET_PROVIDER_INITIAL_VALUES:
    "SET_PROVIDER_INITIAL_VALUES" as "SET_PROVIDER_INITIAL_VALUES",
  SET_PROVIDER_VALUES: "SET_PROVIDER_VALUES" as "SET_PROVIDER_VALUES",

  SET_CHOSEN_SERVICE_TYPE:
    "SET_CHOSEN_SERVICE_TYPE" as "SET_CHOSEN_SERVICE_TYPE",
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
  payload: BisMetriscDto;
}

export interface PlanFailure {
  type: typeof actionTypes.PLAN_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface BisFunctionsGetAll {
  type: typeof actionTypes.BIS_FUNCTIONS_GET_ALL;
}

export interface BisFunctionsGetAllSuccess {
  type: typeof actionTypes.BIS_FUNCTIONS_GET_ALL_SUCCESS;
  payload: BisFunctionDto[];
}

export interface BisFunctionsGetAllFailure {
  type: typeof actionTypes.BIS_FUNCTIONS_GET_ALL_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface BisFunctionUpsert {
  type: typeof actionTypes.BIS_FUNCTION_UPSERT;
  payload: BisFunctionEditDto;
}

export interface BisFunctionUpsertSuccess {
  type: typeof actionTypes.BIS_FUNCTION_UPSERT_SUCCESS;
  payload: BisFunctionDto;
}

export interface BisFunctionUpsertFailure {
  type: typeof actionTypes.BIS_FUNCTION_UPSERT_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface BisFunctionOrderChange {
  type: typeof actionTypes.BIS_FUNCTION_ORDER_CHANGE;
  payload: BisFunctionOrderChangeDto;
}

export interface BisFunctionOrderChangeSuccess {
  type: typeof actionTypes.BIS_FUNCTION_ORDER_CHANGE_SUCCESS;
  payload: {
    updated: BisFunctionDto;
    moved?: {
      newOrder: number;
      id: string;
    }
  };
}

export interface BisFunctionOrderChangeFailure {
  type: typeof actionTypes.BIS_FUNCTION_ORDER_CHANGE_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface BisFunctionDelete {
  type: typeof actionTypes.BIS_FUNCTION_DELETE;
  payload: BisFunctionDeleteDto;
}

export interface BisFunctionDeleteSuccess {
  type: typeof actionTypes.BIS_FUNCTION_DELETE_SUCCESS;
  // name of the deleted function
  payload: string;
}

export interface BisFunctionDeleteFailure {
  type: typeof actionTypes.BIS_FUNCTION_DELETE_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface EntitiesGetAll {
  type: typeof actionTypes.ENTITIES_GET_ALL;
}

export interface EntitiesGetAllSuccess {
  type: typeof actionTypes.ENTITIES_GET_ALL_SUCCESS;
  payload: Entities;
}

export interface EntitiesGetAllFailure {
  type: typeof actionTypes.ENTITIES_GET_ALL_FAILURE;
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
  | typeof actionTypes.GET_MYSELF_FAILURE
  | typeof actionTypes.PLAN_FAILURE
  | typeof actionTypes.BIS_FUNCTIONS_GET_ALL_FAILURE
  | typeof actionTypes.BIS_FUNCTION_UPSERT_FAILURE
  | typeof actionTypes.BIS_FUNCTION_ORDER_CHANGE_FAILURE
  | typeof actionTypes.BIS_FUNCTION_DELETE_FAILURE
  | typeof actionTypes.ENTITIES_GET_ALL_FAILURE
  ;



export type FailureAppAction =
  | GetMyselfFailure
  | PlanFailure
  | BisFunctionsGetAllFailure
  | BisFunctionUpsertFailure
  | BisFunctionOrderChangeFailure
  | BisFunctionDeleteFailure
  | EntitiesGetAllFailure
  | LogOutEnduserFailure;

export type AppAction =
  | LoggedIn
  | GetMyself
  | GetMyselfSuccess
  | GetMyselfFailure
  | Plan
  | PlanSuccess
  | PlanFailure
  | BisFunctionsGetAll
  | BisFunctionsGetAllSuccess
  | BisFunctionsGetAllFailure
  | BisFunctionUpsert
  | BisFunctionUpsertSuccess
  | BisFunctionUpsertFailure
  | BisFunctionOrderChange
  | BisFunctionOrderChangeSuccess
  | BisFunctionOrderChangeFailure
  | BisFunctionDelete
  | BisFunctionDeleteSuccess
  | BisFunctionDeleteFailure
  | EntitiesGetAll
  | EntitiesGetAllSuccess
  | EntitiesGetAllFailure
  | LogOutEnduser
  | LogOutEnduserSuccess
  | LogOutEnduserFailure
  | SetProviderInitialValues
  | SetProviderValues
  | SetChosenServiceType;
