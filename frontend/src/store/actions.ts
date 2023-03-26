import { ErrorCodes } from '../error';
import { PostEnduserValues, LoginValues, ServiceType, PutEnduserValues, ChangePasswordByCurrPasswordValues, ProviderViewValues, ContactUsValues, SubscriptionValues } from '../types';
import { Myself, ProviderForEnduser } from './types';

/* Action Types */
export const actionTypes = {
  LOGGED_IN: 'LOGGED_IN' as 'LOGGED_IN',

  //

  GET_MYSELF: 'GET_MYSELF' as 'GET_MYSELF',
  GET_MYSELF_SUCCESS: 'GET_MYSELF_SUCCESS' as 'GET_MYSELF_SUCCESS',
  GET_MYSELF_FAILURE: 'GET_MYSELF_FAILURE' as 'GET_MYSELF_FAILURE',

  GET_PROVIDERS: 'GET_PROVIDERS' as 'GET_PROVIDERS',
  GET_PROVIDERS_SUCCESS: 'GET_PROVIDERS_SUCCESS' as 'GET_PROVIDERS_SUCCESS',
  GET_PROVIDERS_FAILURE: 'GET_PROVIDERS_FAILURE' as 'GET_PROVIDERS_FAILURE',

  POST_ENDUSER: 'POST_ENDUSER' as 'POST_ENDUSER',
  POST_ENDUSER_SUCCESS: 'POST_ENDUSER_SUCCESS' as 'POST_ENDUSER_SUCCESS',
  POST_ENDUSER_FAILURE: 'POST_ENDUSER_FAILURE' as 'POST_ENDUSER_FAILURE',

  PUT_AVATAR_ENDUSER: 'PUT_AVATAR_ENDUSER' as 'PUT_AVATAR_ENDUSER',
  PUT_AVATAR_ENDUSER_SUCCESS: 'PUT_AVATAR_ENDUSER_SUCCESS' as 'PUT_AVATAR_ENDUSER_SUCCESS',
  PUT_AVATAR_ENDUSER_FAILURE: 'PUT_AVATAR_ENDUSER_FAILURE' as 'PUT_AVATAR_ENDUSER_FAILURE',

  DELETE_AVATAR_ENDUSER: 'DELETE_AVATAR_ENDUSER' as 'DELETE_AVATAR_ENDUSER',
  DELETE_AVATAR_ENDUSER_SUCCESS: 'DELETE_AVATAR_ENDUSER_SUCCESS' as 'DELETE_AVATAR_ENDUSER_SUCCESS',
  DELETE_AVATAR_ENDUSER_FAILURE: 'DELETE_AVATAR_ENDUSER_FAILURE' as 'DELETE_AVATAR_ENDUSER_FAILURE',

  PUT_ENDUSER: 'PUT_ENDUSER' as 'PUT_ENDUSER',
  PUT_ENDUSER_SUCCESS: 'PUT_ENDUSER_SUCCESS' as 'PUT_ENDUSER_SUCCESS',
  PUT_ENDUSER_FAILURE: 'PUT_ENDUSER_FAILURE' as 'PUT_ENDUSER_FAILURE',

  CONFIRM_ENDUSER: 'CONFIRM_ENDUSER' as 'CONFIRM_ENDUSER',
  CONFIRM_ENDUSER_SUCCESS: 'CONFIRM_ENDUSER_SUCCESS' as 'CONFIRM_ENDUSER_SUCCESS',
  CONFIRM_ENDUSER_FAILURE: 'CONFIRM_ENDUSER_FAILURE' as 'CONFIRM_ENDUSER_FAILURE',

  CONFIRM_PROVIDER: 'CONFIRM_PROVIDER' as 'CONFIRM_PROVIDER',
  CONFIRM_PROVIDER_SUCCESS: 'CONFIRM_PROVIDER_SUCCESS' as 'CONFIRM_PROVIDER_SUCCESS',
  CONFIRM_PROVIDER_FAILURE: 'CONFIRM_PROVIDER_FAILURE' as 'CONFIRM_PROVIDER_FAILURE',

  SEND_RESTORE_PASSWORD: 'SEND_RESTORE_PASSWORD' as 'SEND_RESTORE_PASSWORD',
  SEND_RESTORE_PASSWORD_SUCCESS: 'SEND_RESTORE_PASSWORD_SUCCESS' as 'SEND_RESTORE_PASSWORD_SUCCESS',
  SEND_RESTORE_PASSWORD_FAILURE: 'SEND_RESTORE_PASSWORD_FAILURE' as 'SEND_RESTORE_PASSWORD_FAILURE',

  CHANGE_PASSWORD_BY_TOKEN: 'CHANGE_PASSWORD_BY_TOKEN' as 'CHANGE_PASSWORD_BY_TOKEN',
  CHANGE_PASSWORD_BY_TOKEN_SUCCESS: 'CHANGE_PASSWORD_BY_TOKEN_SUCCESS' as 'CHANGE_PASSWORD_BY_TOKEN_SUCCESS',
  CHANGE_PASSWORD_BY_TOKEN_FAILURE: 'CHANGE_PASSWORD_BY_TOKEN_FAILURE' as 'CHANGE_PASSWORD_BY_TOKEN_FAILURE',

  CHANGE_PASSWORD_BY_CURR_PASSWORD: 'CHANGE_PASSWORD_BY_CURR_PASSWORD' as 'CHANGE_PASSWORD_BY_CURR_PASSWORD',
  CHANGE_PASSWORD_BY_CURR_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_BY_CURR_PASSWORD_SUCCESS' as 'CHANGE_PASSWORD_BY_CURR_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_BY_CURR_PASSWORD_FAILURE: 'CHANGE_PASSWORD_BY_CURR_PASSWORD_FAILURE' as 'CHANGE_PASSWORD_BY_CURR_PASSWORD_FAILURE',

  SEND_SUPPORT_EMAIL: 'SEND_SUPPORT_EMAIL' as 'SEND_SUPPORT_EMAIL',
  SEND_SUPPORT_EMAIL_SUCCESS: 'SEND_SUPPORT_EMAIL_SUCCESS' as 'SEND_SUPPORT_EMAIL_SUCCESS',
  SEND_SUPPORT_EMAIL_FAILURE: 'SEND_SUPPORT_EMAIL_FAILURE' as 'SEND_SUPPORT_EMAIL_FAILURE',

  LOG_OUT_ENDUSER: 'LOG_OUT_ENDUSER' as 'LOG_OUT_ENDUSER',
  LOG_OUT_ENDUSER_SUCCESS: 'LOG_OUT_ENDUSER_SUCCESS' as 'LOG_OUT_ENDUSER_SUCCESS',
  LOG_OUT_ENDUSER_FAILURE: 'LOG_OUT_ENDUSER_FAILURE' as 'LOG_OUT_ENDUSER_FAILURE',

  JOIN_MAILCHIMP_AUDIENCE: 'JOIN_MAILCHIMP_AUDIENCE' as 'JOIN_MAILCHIMP_AUDIENCE',
  JOIN_MAILCHIMP_AUDIENCE_SUCCESS: 'JOIN_MAILCHIMP_AUDIENCE_SUCCESS' as 'JOIN_MAILCHIMP_AUDIENCE_SUCCESS',
  JOIN_MAILCHIMP_AUDIENCE_FAILURE: 'JOIN_MAILCHIMP_AUDIENCE_FAILURE' as 'JOIN_MAILCHIMP_AUDIENCE_FAILURE',

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

export interface GetProviders {
  type: typeof actionTypes.GET_PROVIDERS;
  payload: {
    serviceType: ServiceType
  }
}

export interface GetProvidersSuccess {
  type: typeof actionTypes.GET_PROVIDERS_SUCCESS;
  payload: {
    providers: ProviderForEnduser[];
  };
}

export interface GetProvidersFailure {
  type: typeof actionTypes.GET_PROVIDERS_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface PostEnduser {
  type: typeof actionTypes.POST_ENDUSER;
  payload: PostEnduserValues
}

export interface PostEnduserSuccess {
  type: typeof actionTypes.POST_ENDUSER_SUCCESS;
  payload: {
    enduser: Myself;
  };
}

export interface PostEnduserFailure {
  type: typeof actionTypes.POST_ENDUSER_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface PutAvatarEnduser {
  type: typeof actionTypes.PUT_AVATAR_ENDUSER;
  payload: {
    avatar: File
  }
}

export interface PutAvatarEnduserSuccess {
  type: typeof actionTypes.PUT_AVATAR_ENDUSER_SUCCESS;
  payload: {
    // url of uploaded avatar
    avatar: string;
  };
}

export interface PutAvatarEnduserFailure {
  type: typeof actionTypes.PUT_AVATAR_ENDUSER_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface DeleteAvatarEnduser {
  type: typeof actionTypes.DELETE_AVATAR_ENDUSER;
}

export interface DeleteAvatarEnduserSuccess {
  type: typeof actionTypes.DELETE_AVATAR_ENDUSER_SUCCESS;
}

export interface DeleteAvatarEnduserFailure {
  type: typeof actionTypes.DELETE_AVATAR_ENDUSER_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface PutEnduser {
  type: typeof actionTypes.PUT_ENDUSER;
  payload: PutEnduserValues
}

export interface PutEnduserSuccess {
  type: typeof actionTypes.PUT_ENDUSER_SUCCESS;
  payload: PutEnduserValues
}

export interface PutEnduserFailure {
  type: typeof actionTypes.PUT_ENDUSER_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface ConfirmEnduser {
  type: typeof actionTypes.CONFIRM_ENDUSER;
  payload: {
    token: string;
  };
}

export interface ConfirmEnduserSuccess {
  type: typeof actionTypes.CONFIRM_ENDUSER_SUCCESS;
}

export interface ConfirmEnduserFailure {
  type: typeof actionTypes.CONFIRM_ENDUSER_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface ConfirmProvider {
  type: typeof actionTypes.CONFIRM_PROVIDER;
  payload: {
    token: string;
  };
}

export interface ConfirmProviderSuccess {
  type: typeof actionTypes.CONFIRM_PROVIDER_SUCCESS;
}

export interface ConfirmProviderFailure {
  type: typeof actionTypes.CONFIRM_PROVIDER_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface ChangePasswordByCurrPassword {
  type: typeof actionTypes.CHANGE_PASSWORD_BY_CURR_PASSWORD;
  payload: ChangePasswordByCurrPasswordValues;
}

export interface ChangePasswordByCurrPasswordSuccess {
  type: typeof actionTypes.CHANGE_PASSWORD_BY_CURR_PASSWORD_SUCCESS;
}

export interface ChangePasswordByCurrPasswordFailure {
  type: typeof actionTypes.CHANGE_PASSWORD_BY_CURR_PASSWORD_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

export interface SendSupportEmail {
  type: typeof actionTypes.SEND_SUPPORT_EMAIL;
  payload: ContactUsValues;
}

export interface SendSupportEmailSuccess {
  type: typeof actionTypes.SEND_SUPPORT_EMAIL_SUCCESS;
}

export interface SendSupportEmailFailure {
  type: typeof actionTypes.SEND_SUPPORT_EMAIL_FAILURE;
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

export interface JoinMailchimpAudience {
  type: typeof actionTypes.JOIN_MAILCHIMP_AUDIENCE;
  payload: SubscriptionValues;
}

export interface JoinMailchimpAudienceSuccess {
  type: typeof actionTypes.JOIN_MAILCHIMP_AUDIENCE_SUCCESS;
}

export interface JoinMailchimpAudienceFailure {
  type: typeof actionTypes.JOIN_MAILCHIMP_AUDIENCE_FAILURE;
  payload: {
    errors: ErrorCodes[];
  };
}

/** UI actions */
export interface SetProviderInitialValues {
  type: typeof actionTypes.SET_PROVIDER_INITIAL_VALUES;
  payload: Partial<ProviderViewValues>;
}

export interface SetProviderValues {
  type: typeof actionTypes.SET_PROVIDER_VALUES;
  payload: Partial<ProviderViewValues>;
}


export interface SetChosenServiceType {
  type: typeof actionTypes.SET_CHOSEN_SERVICE_TYPE;
  payload: ServiceType;
}

export type FailureAppActionTypes =
  typeof actionTypes.GET_MYSELF_FAILURE |
  typeof actionTypes.GET_PROVIDERS_FAILURE |
  typeof actionTypes.POST_ENDUSER_FAILURE |
  typeof actionTypes.PUT_AVATAR_ENDUSER_FAILURE |
  typeof actionTypes.DELETE_AVATAR_ENDUSER_FAILURE |
  typeof actionTypes.PUT_ENDUSER_FAILURE |
  typeof actionTypes.CONFIRM_ENDUSER_FAILURE |
  typeof actionTypes.CONFIRM_PROVIDER_FAILURE |
  typeof actionTypes.SEND_SUPPORT_EMAIL_FAILURE |
  typeof actionTypes.LOG_OUT_ENDUSER_FAILURE |
  typeof actionTypes.JOIN_MAILCHIMP_AUDIENCE_FAILURE;

export type FailureAppAction =
  | GetMyselfFailure
  | GetProvidersFailure
  | PostEnduserFailure
  | PutAvatarEnduserFailure
  | DeleteAvatarEnduserFailure
  | PutEnduserFailure
  | ConfirmEnduserFailure
  | ConfirmProviderFailure
  | ChangePasswordByCurrPasswordFailure
  | SendSupportEmailFailure
  | LogOutEnduserFailure
  | JoinMailchimpAudienceFailure;

export type AppAction =
  | LoggedIn
  // 
  | GetMyself
  | GetMyselfSuccess
  | GetMyselfFailure
  | GetProviders
  | GetProvidersSuccess
  | GetProvidersFailure
  | PostEnduser
  | PostEnduserSuccess
  | PostEnduserFailure
  | PutAvatarEnduser
  | PutAvatarEnduserSuccess
  | PutAvatarEnduserFailure
  | DeleteAvatarEnduser
  | DeleteAvatarEnduserSuccess
  | DeleteAvatarEnduserFailure
  | PutEnduser
  | PutEnduserSuccess
  | PutEnduserFailure
  | ConfirmEnduser
  | ConfirmEnduserSuccess
  | ConfirmEnduserFailure
  | ConfirmProvider
  | ConfirmProviderSuccess
  | ConfirmProviderFailure
  | ChangePasswordByCurrPassword
  | ChangePasswordByCurrPasswordSuccess
  | ChangePasswordByCurrPasswordFailure
  | SendSupportEmail
  | SendSupportEmailSuccess
  | SendSupportEmailFailure
  | LogOutEnduser
  | LogOutEnduserSuccess
  | LogOutEnduserFailure
  | JoinMailchimpAudience
  | JoinMailchimpAudienceFailure
  | JoinMailchimpAudienceSuccess
  | SetProviderInitialValues
  | SetProviderValues
  | SetChosenServiceType;
