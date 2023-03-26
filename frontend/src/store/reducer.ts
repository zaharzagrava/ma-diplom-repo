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

      case actionTypes.GET_PROVIDERS:
        draft.actions.getProvidersByServiceType.errors = null;
        draft.actions.getProvidersByServiceType.loading = true;
        break;
      case actionTypes.GET_PROVIDERS_SUCCESS:
        draft.providers = action.payload.providers;
        draft.actions.getProvidersByServiceType.errors = null;
        draft.actions.getProvidersByServiceType.loading = false;
        break;
      case actionTypes.GET_PROVIDERS_FAILURE:
        draft.actions.getProvidersByServiceType.errors = action.payload.errors;
        draft.actions.getProvidersByServiceType.loading = false;
        break;

      case actionTypes.POST_ENDUSER:
        draft.actions.postEnduser.errors = null;
        draft.actions.postEnduser.loading = true;
        break;
      case actionTypes.POST_ENDUSER_SUCCESS:
        draft.actions.postEnduser.errors = null;
        draft.actions.postEnduser.loading = false;
        draft.actions.postEnduser.success = true;
        draft.myself = action.payload.enduser;

        draft.actions.getMyself.errors = null;
        draft.actions.getMyself.loading = false;
        draft.actions.getMyself.success = true;
        break;
      case actionTypes.POST_ENDUSER_FAILURE:
        draft.actions.postEnduser.errors = action.payload.errors;
        draft.actions.postEnduser.loading = false;
        break;

      case actionTypes.PUT_AVATAR_ENDUSER:
        draft.actions.putAvatarEnduser.errors = null;
        draft.actions.putAvatarEnduser.loading = true;
        break;
      case actionTypes.PUT_AVATAR_ENDUSER_SUCCESS:
        draft.actions.putAvatarEnduser.errors = null;
        draft.actions.putAvatarEnduser.loading = false;
        draft.actions.putAvatarEnduser.success = true;
        if (draft.myself) draft.myself.avatar = action.payload.avatar;
        break;
      case actionTypes.PUT_AVATAR_ENDUSER_FAILURE:
        draft.actions.putAvatarEnduser.errors = action.payload.errors;
        draft.actions.putAvatarEnduser.loading = false;
        break;

      case actionTypes.DELETE_AVATAR_ENDUSER:
        draft.actions.deleteAvatarEnduser.errors = null;
        draft.actions.deleteAvatarEnduser.loading = true;
        break;
      case actionTypes.DELETE_AVATAR_ENDUSER_SUCCESS:
        draft.actions.deleteAvatarEnduser.errors = null;
        draft.actions.deleteAvatarEnduser.loading = false;
        draft.actions.deleteAvatarEnduser.success = true;
        if (draft.myself) draft.myself.avatar = null;
        break;
      case actionTypes.DELETE_AVATAR_ENDUSER_FAILURE:
        draft.actions.putAvatarEnduser.errors = action.payload.errors;
        draft.actions.putAvatarEnduser.loading = false;
        break;

      case actionTypes.PUT_ENDUSER:
        draft.actions.putEnduser.errors = null;
        draft.actions.putEnduser.loading = true;
        break;
      case actionTypes.PUT_ENDUSER_SUCCESS:
        draft.actions.putEnduser.errors = null;
        draft.actions.putEnduser.loading = false;
        draft.actions.putEnduser.success = true;
        if (draft.myself) draft.myself = { ...draft.myself, ...action.payload };
        break;
      case actionTypes.PUT_ENDUSER_FAILURE:
        draft.actions.putEnduser.errors = action.payload.errors;
        draft.actions.putEnduser.loading = false;
        break;

      case actionTypes.CONFIRM_ENDUSER:
        draft.actions.confirmEnduser.errors = null;
        draft.actions.confirmEnduser.loading = true;
        break;
      case actionTypes.CONFIRM_ENDUSER_SUCCESS:
        draft.actions.confirmEnduser.errors = null;
        draft.actions.confirmEnduser.loading = false;
        draft.actions.confirmEnduser.success = true;
        break;
      case actionTypes.CONFIRM_ENDUSER_FAILURE:
        draft.actions.confirmEnduser.errors = action.payload.errors;
        draft.actions.confirmEnduser.loading = false;
        break;

      case actionTypes.CONFIRM_PROVIDER:
        draft.actions.confirmProvider.errors = null;
        draft.actions.confirmProvider.loading = true;
        break;
      case actionTypes.CONFIRM_PROVIDER_SUCCESS:
        draft.actions.confirmProvider.errors = null;
        draft.actions.confirmProvider.loading = false;
        draft.actions.confirmProvider.success = true;
        break;
      case actionTypes.CONFIRM_PROVIDER_FAILURE:
        draft.actions.confirmProvider.errors = action.payload.errors;
        draft.actions.confirmProvider.loading = false;
        break;

      case actionTypes.CHANGE_PASSWORD_BY_CURR_PASSWORD:
        draft.actions.changePasswordByCurrPassword.errors = null;
        draft.actions.changePasswordByCurrPassword.loading = true;
        break;
      case actionTypes.CHANGE_PASSWORD_BY_CURR_PASSWORD_SUCCESS:
        draft.actions.changePasswordByCurrPassword.errors = null;
        draft.actions.changePasswordByCurrPassword.loading = false;
        draft.actions.changePasswordByCurrPassword.success = true;
        break;
      case actionTypes.CHANGE_PASSWORD_BY_CURR_PASSWORD_FAILURE:
        draft.actions.changePasswordByCurrPassword.errors = action.payload.errors;
        draft.actions.changePasswordByCurrPassword.loading = false;
        break;

      case actionTypes.SEND_SUPPORT_EMAIL:
        draft.actions.sendSupportEmail.errors = null;
        draft.actions.sendSupportEmail.loading = true;
        draft.actions.sendSupportEmail.success = false;
        break;
      case actionTypes.SEND_SUPPORT_EMAIL_SUCCESS:
        draft.actions.sendSupportEmail.errors = null;
        draft.actions.sendSupportEmail.loading = false;
        draft.actions.sendSupportEmail.success = true;
        break;
      case actionTypes.SEND_SUPPORT_EMAIL_FAILURE:
        draft.actions.sendSupportEmail.errors = action.payload.errors;
        draft.actions.sendSupportEmail.loading = false;
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

      case actionTypes.JOIN_MAILCHIMP_AUDIENCE:
        draft.actions.joinMailchimpAudience.errors = null;
        draft.actions.joinMailchimpAudience.loading = true;
        break;
      case actionTypes.JOIN_MAILCHIMP_AUDIENCE_SUCCESS:
        draft.actions.joinMailchimpAudience.errors = null;
        draft.actions.joinMailchimpAudience.loading = false;
        draft.actions.joinMailchimpAudience.success = true;
        break;
      case actionTypes.JOIN_MAILCHIMP_AUDIENCE_FAILURE:
        draft.actions.joinMailchimpAudience.errors = action.payload.errors;
        draft.actions.joinMailchimpAudience.loading = false;
        draft.actions.joinMailchimpAudience.success = false;
        break;

      /* UI actions */

      default:
        break;
    }
  },
  RootReducerInitialState,
);
