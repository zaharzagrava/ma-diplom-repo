import { EntityUpsertDto, EntityUpsertType } from "../containers/EntityUpsert/types";
import { ProductionChainUpsertDto } from "../containers/ProductionChain/types";
import { ErrorCodes } from "../error";
import { BisFunctionChangeOrderDto as BisFunctionOrderChangeDto, BisFunctionDeleteDto, BisFunctionDto, BisFunctionEditDto } from "./bis-function.types";
import { BisMetriscDto, Credit, Entities, Entity, Myself, Product, Resource, EntityUpsertable, ProductionChain } from "./types";

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

  PRODUCTION_CHAIN_UPSERT: "PRODUCTION_CHAIN_UPSERT" as "PRODUCTION_CHAIN_UPSERT",
  PRODUCTION_CHAIN_UPSERT_SUCCESS:
    "PRODUCTION_CHAIN_UPSERT_SUCCESS" as "PRODUCTION_CHAIN_UPSERT_SUCCESS",
  PRODUCTION_CHAIN_UPSERT_FAILURE:
    "PRODUCTION_CHAIN_UPSERT_FAILURE" as "PRODUCTION_CHAIN_UPSERT_FAILURE",

  ENTITIES_GET_ALL: "ENTITIES_GET_ALL" as "ENTITIES_GET_ALL",
  ENTITIES_GET_ALL_SUCCESS:
    "ENTITIES_GET_ALL_SUCCESS" as "ENTITIES_GET_ALL_SUCCESS",
  ENTITIES_GET_ALL_FAILURE:
    "ENTITIES_GET_ALL_FAILURE" as "ENTITIES_GET_ALL_FAILURE",

  ENTITY_UPSERT: "ENTITY_UPSERT" as "ENTITY_UPSERT",
  ENTITY_UPSERT_SUCCESS:
    "ENTITY_UPSERT_SUCCESS" as "ENTITY_UPSERT_SUCCESS",
  ENTITY_UPSERT_FAILURE:
    "ENTITY_UPSERT_FAILURE" as "ENTITY_UPSERT_FAILURE",

  ENTITY_DELETE: "ENTITY_DELETE" as "ENTITY_DELETE",
  ENTITY_DELETE_SUCCESS:
    "ENTITY_DELETE_SUCCESS" as "ENTITY_DELETE_SUCCESS",
  ENTITY_DELETE_FAILURE:
    "ENTITY_DELETE_FAILURE" as "ENTITY_DELETE_FAILURE",

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

export interface ProductionChainUpsert {
  type: typeof actionTypes.PRODUCTION_CHAIN_UPSERT;
  payload: ProductionChainUpsertDto;
}

export interface ProductionChainUpsertSuccess {
  type: typeof actionTypes.PRODUCTION_CHAIN_UPSERT_SUCCESS;
  payload: ProductionChain;
}

export interface ProductionChainUpsertFailure {
  type: typeof actionTypes.PRODUCTION_CHAIN_UPSERT_FAILURE;
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

export interface EntityUpsert {
  type: typeof actionTypes.ENTITY_UPSERT;
  payload: EntityUpsertDto;
}

export interface EntityUpsertSuccess {
  type: typeof actionTypes.ENTITY_UPSERT_SUCCESS;
  payload: EntityUpsertable;
}

export interface EntityUpsertFailure {
  type: typeof actionTypes.ENTITY_UPSERT_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface EntityDelete {
  type: typeof actionTypes.ENTITY_DELETE;
  payload: {
    id: string;
    __type__: EntityUpsertType;
  }
}

export interface EntityDeleteSuccess {
  type: typeof actionTypes.ENTITY_DELETE_SUCCESS;
  // id of the deleted entity
  payload: string;
}

export interface EntityDeleteFailure {
  type: typeof actionTypes.ENTITY_DELETE_FAILURE;
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
  | typeof actionTypes.ENTITY_UPSERT_FAILURE
  | typeof actionTypes.ENTITY_DELETE_FAILURE
  | typeof actionTypes.PRODUCTION_CHAIN_UPSERT_FAILURE
  ;



export type FailureAppAction =
  | GetMyselfFailure
  | PlanFailure
  | BisFunctionsGetAllFailure
  | BisFunctionUpsertFailure
  | BisFunctionOrderChangeFailure
  | BisFunctionDeleteFailure
  | ProductionChainUpsertFailure
  | EntitiesGetAllFailure
  | EntityUpsertFailure
  | EntityDeleteFailure
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
  | ProductionChainUpsert
  | ProductionChainUpsertSuccess
  | ProductionChainUpsertFailure
  | EntitiesGetAll
  | EntitiesGetAllSuccess
  | EntitiesGetAllFailure
  | EntityUpsert
  | EntityUpsertSuccess
  | EntityUpsertFailure
  | EntityDelete
  | EntityDeleteSuccess
  | EntityDeleteFailure
  | LogOutEnduser
  | LogOutEnduserSuccess
  | LogOutEnduserFailure
  | SetProviderInitialValues
  | SetProviderValues
  | SetChosenServiceType;
