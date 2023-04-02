import produce from 'immer';
import { ErrorCodes } from '../error';
import { actionTypes, AppAction } from './actions';
import { Myself, ProviderForEnduser } from './types';

/* Initial State */
export const RootReducerInitialState = {
  forms: {
    provider: {
      providerIndex: null as string | null,
    },
  },

  ui: {
    //
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

    getProvidersByServiceType: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
    },

    postProvider: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    postEnduser: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    putAvatarEnduser: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    deleteAvatarEnduser: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    putEnduser: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null, // is there been at least one successful register
    },

    loginEnduser: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null,
    },

    confirmEnduser: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null,
    },

    confirmProvider: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null,
    },

    sendRestorePassword: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null,
    },

    changePasswordByToken: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null,
    },

    changePasswordByCurrPassword: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: null as boolean | null,
    },

    sendSupportEmail: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: false as boolean,
    },

    logoutEnduser: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
    },

    joinMailchimpAudience: {
      loading: false as boolean,
      errors: null as ErrorCodes[] | null,
      success: false as boolean | null,
    },
  },

  /**
   * Is modified by the following actions
   *  - getMyself
   */
  myself: null as Myself | null,

  /**
   * Is modified by the following actions
   *  - getProvidersByServiceType
   */
  providers: null as ProviderForEnduser[] | null,
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

      case actionTypes.GET_ALL_BIS_FUNCTIONS:
        draft.actions.getProvidersByServiceType.errors = null;
        draft.actions.getProvidersByServiceType.loading = true;
        break;
      case actionTypes.GET_ALL_BIS_FUNCTIONS_SUCCESS:
        draft.providers = action.payload.providers;
        draft.actions.getProvidersByServiceType.errors = null;
        draft.actions.getProvidersByServiceType.loading = false;
        break;
      case actionTypes.GET_ALL_BIS_FUNCTIONS_FAILURE:
        draft.actions.getProvidersByServiceType.errors = action.payload.errors;
        draft.actions.getProvidersByServiceType.loading = false;
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
