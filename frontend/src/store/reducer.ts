import produce from 'immer';
import { ErrorCodes } from '../error';
import { actionTypes, AppAction } from './actions';
import { BisMetricDto, Myself, ProviderForEnduser } from './types';
import { BisFunctionDto } from './bis-function.types';

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
  bisMetrics: null as BisMetricDto[] | null,
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
        draft.bisFunctions = action.payload.bisFunctions;
        draft.bisMetrics = action.payload.bisMetrics;
        draft.actions.plan.errors = null;
        draft.actions.plan.loading = false;
        break;
      case actionTypes.PLAN_FAILURE:
        draft.actions.plan.errors = action.payload.errors;
        draft.actions.plan.loading = false;
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
