import produce from 'immer';
import { ErrorCodes } from '../error';
import { actionTypes, AppAction } from './actions';
import { BisMetriscDto, Entities, Entity, Myself } from './types';
import { BisFunctionDto } from './bis-function.types';
import * as _ from 'lodash'
import { upsertTypeToKey } from '../containers/EntityUpsert/types';

/* Initial State */
export const RootReducerInitialState = {
  forms: {
    provider: {
      providerIndex: null as string | null,
    },
  },

  ui: {
    //
    monitoringAndPlanning: {
      from: 202201 as number | null,
      to: 202301 as number | null,
    }
  },

  actions: {
    /**
     * Basically acts as initial auth route to check whether user is authenticated or not
     */
    getMyself: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,

      /**
       * Is modified by the following actions
       *  - postEnduserSuccess
       *  - loginEnduserSuccess
       *  - getMyselfSuccess
       *  - getMyselfFailure
       */
      success: null as boolean | null, // is user logged in
    },

    plan: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    bisFunctionsGetAll: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    bisFunctionUpsert: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    bisFunctionOrderChange: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    bisFunctionDelete: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    productionChainUpsert: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    entitiesGetAll: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    entityUpsert: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    entityDelete: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    logoutEnduser: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
    },
  },

  /**
   * Is modified by the following actions
   *  - getMyself
   */
  myself: null as Myself | null,

  bisFunctions: null as BisFunctionDto[] | null,
  entites: null as Entities | null,
  bisMetrics: null as BisMetriscDto | null,
};

export type AppState = typeof RootReducerInitialState;

/* Reducer */
export const RootReducer = produce(
  (draft: AppState, action: AppAction) => {
    switch (action.type) {
      case actionTypes.GET_MYSELF:
        draft.actions.getMyself.errors = null;
        draft.actions.getMyself.loading = true;
        break;
      case actionTypes.GET_MYSELF_SUCCESS:
        draft.myself = action.payload.myself;
        draft.actions.getMyself.errors = null;
        draft.actions.getMyself.loading = false;
        draft.actions.getMyself.success = true;
        break;
      case actionTypes.GET_MYSELF_FAILURE:
        draft.actions.getMyself.errors = action.payload.errors;
        draft.actions.getMyself.loading = false;
        draft.actions.getMyself.success = false;
        break;

      case actionTypes.PLAN:
        draft.actions.plan.errors = null;
        draft.actions.plan.loading = true;
        break;
      case actionTypes.PLAN_SUCCESS:
        draft.bisMetrics = action.payload;
        draft.actions.plan.errors = null;
        draft.actions.plan.loading = false;
        break;
      case actionTypes.PLAN_FAILURE:
        draft.actions.plan.errors = action.payload.errors;
        draft.actions.plan.loading = false;
        break;

      case actionTypes.BIS_FUNCTIONS_GET_ALL:
        draft.actions.bisFunctionsGetAll.errors = null;
        draft.actions.bisFunctionsGetAll.loading = true;
        break;
      case actionTypes.BIS_FUNCTIONS_GET_ALL_SUCCESS:
        draft.bisFunctions = action.payload;
        draft.actions.bisFunctionsGetAll.errors = null;
        draft.actions.bisFunctionsGetAll.loading = false;
        break;
      case actionTypes.BIS_FUNCTIONS_GET_ALL_FAILURE:
        draft.actions.bisFunctionsGetAll.errors = action.payload.errors;
        draft.actions.bisFunctionsGetAll.loading = false;
        break;

      case actionTypes.BIS_FUNCTION_UPSERT:
        draft.actions.bisFunctionUpsert.errors = null;
        draft.actions.bisFunctionUpsert.loading = true;
        break;
      case actionTypes.BIS_FUNCTION_UPSERT_SUCCESS:
        if(draft.bisFunctions) {
          const index = draft.bisFunctions.findIndex(x => x.id === action.payload.id)
          if(index !== -1) {
            draft.bisFunctions.splice(index, 1, action.payload as any);
          } else {
            draft.bisFunctions.push(action.payload as any);
          }
        }

        draft.actions.bisFunctionUpsert.errors = null;
        draft.actions.bisFunctionUpsert.loading = false;
        break;
      case actionTypes.BIS_FUNCTION_UPSERT_FAILURE:
        draft.actions.bisFunctionUpsert.errors = action.payload.errors;
        draft.actions.bisFunctionUpsert.loading = false;
        break;

      case actionTypes.BIS_FUNCTION_ORDER_CHANGE:
        draft.actions.bisFunctionOrderChange.errors = null;
        draft.actions.bisFunctionOrderChange.loading = true;
        break;
      case actionTypes.BIS_FUNCTION_ORDER_CHANGE_SUCCESS:
        if(draft.bisFunctions) {
          const updatedBisFunctions = _.sortBy(draft.bisFunctions.map(x => {
            if(x.id === action.payload.updated.id) {
              return action.payload.updated;
            }

            if(x.id === action.payload.moved?.id) {
              return {
                ...x,
                order: action.payload.moved?.newOrder
              }
            }

            return x;
          }), 'order', 'asc')

          draft.bisFunctions = updatedBisFunctions
        }

        draft.actions.bisFunctionOrderChange.errors = null;
        draft.actions.bisFunctionOrderChange.loading = false;
        break;

      case actionTypes.BIS_FUNCTION_DELETE:
        draft.actions.bisFunctionDelete.errors = null;
        draft.actions.bisFunctionDelete.loading = true;
        break;
      case actionTypes.BIS_FUNCTION_DELETE_SUCCESS:
        if(draft.bisFunctions?.length) {
          draft.bisFunctions = draft.bisFunctions?.filter(x => x.name !== action.payload)
        }

        draft.actions.bisFunctionDelete.errors = null;
        draft.actions.bisFunctionDelete.loading = false;
        break;

      case actionTypes.BIS_FUNCTION_DELETE_FAILURE:
        draft.actions.bisFunctionDelete.errors = action.payload.errors;
        draft.actions.bisFunctionDelete.loading = false;
        break;

      case actionTypes.PRODUCTION_CHAIN_UPSERT:
        draft.actions.productionChainUpsert.errors = null;
        draft.actions.productionChainUpsert.loading = true;
        break;
      case actionTypes.PRODUCTION_CHAIN_UPSERT_SUCCESS:
        if(draft.entites?.productionChains) {
          const index = draft.entites?.productionChains.findIndex(x => x.id === action.payload.id)
          if(index !== -1) {
            draft.entites?.productionChains.splice(index, 1, action.payload as any);
          } else {
            draft.entites?.productionChains.push(action.payload as any);
          }
        }

        draft.actions.productionChainUpsert.errors = null;
        draft.actions.productionChainUpsert.loading = false;
        break;
      case actionTypes.PRODUCTION_CHAIN_UPSERT_FAILURE:
        draft.actions.productionChainUpsert.errors = action.payload.errors;
        draft.actions.productionChainUpsert.loading = false;
        break;

      case actionTypes.ENTITIES_GET_ALL:
        draft.actions.entitiesGetAll.errors = null;
        draft.actions.entitiesGetAll.loading = true;
        break;
      case actionTypes.ENTITIES_GET_ALL_SUCCESS:
        draft.entites = action.payload;
        draft.actions.entitiesGetAll.errors = null;
        draft.actions.entitiesGetAll.loading = false;
        break;
      case actionTypes.ENTITIES_GET_ALL_FAILURE:
        draft.actions.entitiesGetAll.errors = action.payload.errors;
        draft.actions.entitiesGetAll.loading = false;
        break;

      case actionTypes.ENTITY_UPSERT:
        draft.actions.entityUpsert.errors = null;
        draft.actions.entityUpsert.loading = true;
        break;
      case actionTypes.ENTITY_UPSERT_SUCCESS:
        if(draft.entites) {
          const key = upsertTypeToKey(action.payload.__type__)
          const index = draft.entites[key].findIndex(x => x.id === action.payload.id)
          if(index !== -1) {
            draft.entites[key].splice(index, 1, action.payload as any);
          } else {
            draft.entites[key].push(action.payload as any);
          }
        }

        draft.actions.entityUpsert.errors = null;
        draft.actions.entityUpsert.loading = false;
        break;
      case actionTypes.ENTITY_UPSERT_FAILURE:
        draft.actions.entityUpsert.errors = action.payload.errors;
        draft.actions.entityUpsert.loading = false;
        break;

      case actionTypes.ENTITY_DELETE:
        draft.actions.entityDelete.errors = null;
        draft.actions.entityDelete.loading = true;
        break;
      case actionTypes.ENTITY_DELETE_SUCCESS:
        if(draft.entites) {
          for (const [entityKey, entityList] of Object.entries(draft.entites)) {
            draft.entites[entityKey as keyof Entities] = entityList.filter((x: any) => x.id !== action.payload)
          }
        }

        draft.actions.entityDelete.errors = null;
        draft.actions.entityDelete.loading = false;
        break;
      case actionTypes.ENTITY_DELETE_FAILURE:
        draft.actions.entityDelete.errors = action.payload.errors;
        draft.actions.entityDelete.loading = false;
        break;

      case actionTypes.LOG_OUT_ENDUSER:
        draft.actions.logoutEnduser.errors = null;
        draft.actions.logoutEnduser.loading = true;
        break;
      case actionTypes.LOG_OUT_ENDUSER_SUCCESS:
        draft.actions.logoutEnduser.errors = null;
        draft.actions.logoutEnduser.loading = false;
        break;
      case actionTypes.LOG_OUT_ENDUSER_FAILURE:
        draft.actions.logoutEnduser.errors = action.payload.errors;
        draft.actions.logoutEnduser.loading = false;
        break;

      /* UI actions */

      default:
        break;
    }
  },
  RootReducerInitialState,
);
