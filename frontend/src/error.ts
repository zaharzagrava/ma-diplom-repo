/**
 * Custom error class
 * @description Should be called when an error happens on backend.
 * Should contain a list of errors (manifested in error codes) that went
 * wrong. Mostly one error code will be enough, but just in case, you can
 * return multiple error coeds, signifying that multiple things have gone wrong
 */
export class Errors extends Error {
  errorCodes;

  constructor(errorCodes: ErrorCodes[]) {
    super();

    this.errorCodes = errorCodes;
  }
}

/**
 * Error codes
 */
export enum ErrorCodes {
  ADMIN_INCORRECT_EMAIL = 'ADMIN_INCORRECT_EMAIL',
  ADMIN_INCORRECT_PASSWORD = 'ADMIN_INCORRECT_PASSWORD',

  ENDUSER_INCORRECT_EMAIL = 'ENDUSER_INCORRECT_EMAIL',
  ENDUSER_INCORRECT_PASSWORD = 'ENDUSER_INCORRECT_PASSWORD',

  PROVIDER_INCORRECT_EMAIL = 'PROVIDER_INCORRECT_EMAIL',
  PROVIDER_INCORRECT_PASSWORD = 'PROVIDER_INCORRECT_PASSWORD',

  NOT_AUTHORIZED_ADMIN = 'NOT_AUTHORIZED_ADMIN',
  NOT_AUTHORIZED_ENDUSER = 'NOT_AUTHORIZED_ENDUSER',
  ENDUSER_EMAIL_TAKEN = 'ENDUSER_EMAIL_TAKEN',
  PROVIDER_EMAIL_TAKEN = 'PROVIDER_EMAIL_TAKEN',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

  MAILCHIMP_ALREADY_SUBSCRIBED = 'MAILCHIMP_ALREADY_SUBSCRIBED',
  RECAPTCHA_FAILED = 'RECAPTCHA_FAILED',

  CONFIRMATION_TOKEN_IS_NOT_FOUND = 'CONFIRMATION_TOKEN_IS_NOT_FOUND',

  PUT_ENDUSER_MUST_HAVE_PROVIDER_ID_WHEN_ADMIN = 'PUT_ENDUSER_MUST_HAVE_PROVIDER_ID_WHEN_ADMIN',
  PUT_ENDUSER_MUST_NOT_HAVE_PASSWORD = 'PUT_ENDUSER_MUST_NOT_HAVE_PASSWORD',
  PUT_ENDUSER_MUST_NOT_HAVE_CONFIRMED_AT = 'PUT_ENDUSER_MUST_NOT_HAVE_CONFIRMED_AT',
  PUT_ENDUSER_MUST_NOT_HAVE_CREATED_AT = 'PUT_ENDUSER_MUST_NOT_HAVE_CREATED_AT',
  PUT_ENDUSER_MUST_NOT_HAVE_ID = 'PUT_ENDUSER_MUST_NOT_HAVE_ID',

  POST_ENDUSER_MUST_NOT_HAVE_CONFIRMED_AT = 'POST_ENDUSER_MUST_NOT_HAVE_CONFIRMED_AT',
  POST_ENDUSER_MUST_NOT_HAVE_CREATED_AT = 'POST_ENDUSER_MUST_NOT_HAVE_CREATED_AT',

  POST_PROVIDER_MUST_NOT_HAVE_CONFIRMED_AT = 'POST_PROVIDER_MUST_NOT_HAVE_CONFIRMED_AT',
  POST_PROVIDER_MUST_NOT_HAVE_CREATED_AT = 'POST_PROVIDER_MUST_NOT_HAVE_CREATED_AT',
  POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_SERVICE_TYPE = 'POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_SERVICE_TYPE',
  POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_DESCRIPTION = 'POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_DESCRIPTION',
  POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_PRICE = 'POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_PRICE',
  POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_CREATED_AT = 'POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_CREATED_AT',

  RELATED_PROVIDER_SERVICE_NOT_FOUND = 'RELATED_PROVIDER_SERVICE_NOT_FOUND',

  ENDUSER_NOT_FOUND = 'ENDUSER_NOT_FOUND',
  ADMIN_NOT_FOUND = 'ADMIN_NOT_FOUND',
  PROVIDER_NOT_FOUND = 'PROVIDER_NOT_FOUND',
  PROVIDER_SERVICE_NOT_FOUND = 'PROVIDER_NOT_FOUND',
  SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',

  /**
   * Front-end specific errors
   */
  INTERNAL_FRONTEND_ERROR = 'INTERNAL_FRONTEND_ERROR',
  SERVER_IS_UNAVAILABLE = 'SERVER_IS_UNAVAILABLE',
}

/**
 *
 */
export const errorCodesToMessage = (errorCodes: ErrorCodes[]) => {
  let str = '';
  let i = 0;
  const l = Object.values(errorCodes).length;

  Object.values(errorCodes).forEach((errorCode) => {
    let errorMessage = '';

    switch (errorCode) {
      case ErrorCodes.ADMIN_INCORRECT_EMAIL: errorMessage = 'There is no admin with this email'; break;
      case ErrorCodes.ADMIN_INCORRECT_PASSWORD: errorMessage = 'Incorrect password'; break;

      case ErrorCodes.ENDUSER_INCORRECT_EMAIL: errorMessage = 'There is no user with this email'; break;
      case ErrorCodes.ENDUSER_INCORRECT_PASSWORD: errorMessage = 'Incorrect password'; break;

      case ErrorCodes.PROVIDER_INCORRECT_EMAIL: errorMessage = 'There is no provider with this email'; break;
      case ErrorCodes.PROVIDER_INCORRECT_PASSWORD: errorMessage = 'Incorrect password'; break;

      case ErrorCodes.MAILCHIMP_ALREADY_SUBSCRIBED: errorMessage = 'You are already subscribed'; break;
      case ErrorCodes.RECAPTCHA_FAILED: errorMessage = 'Automatic Recaptcha failed'; break;

      case ErrorCodes.NOT_AUTHORIZED_ADMIN: errorMessage = 'You are not authorized as admin'; break;
      case ErrorCodes.NOT_AUTHORIZED_ENDUSER: errorMessage = 'You are not authorized as user'; break;
      case ErrorCodes.ENDUSER_EMAIL_TAKEN: errorMessage = 'This email is already taken by a different user'; break;
      case ErrorCodes.PROVIDER_EMAIL_TAKEN: errorMessage = 'This email is already taken by a different service provider'; break;
      case ErrorCodes.INTERNAL_SERVER_ERROR: errorMessage = 'Unexpected error has happened on the backend'; break;

      case ErrorCodes.CONFIRMATION_TOKEN_IS_NOT_FOUND: errorMessage = 'Confirmation token is not found, it is probably expired or already used'; break;

      case ErrorCodes.PUT_ENDUSER_MUST_HAVE_PROVIDER_ID_WHEN_ADMIN: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.PUT_ENDUSER_MUST_NOT_HAVE_PASSWORD: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.PUT_ENDUSER_MUST_NOT_HAVE_CONFIRMED_AT: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.PUT_ENDUSER_MUST_NOT_HAVE_CREATED_AT: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.PUT_ENDUSER_MUST_NOT_HAVE_ID: errorMessage = 'Incorrect input was provided for backend'; break;

      case ErrorCodes.POST_ENDUSER_MUST_NOT_HAVE_CONFIRMED_AT: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.POST_ENDUSER_MUST_NOT_HAVE_CREATED_AT: errorMessage = 'Incorrect input was provided for backend'; break;

      case ErrorCodes.POST_PROVIDER_MUST_NOT_HAVE_CONFIRMED_AT: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.POST_PROVIDER_MUST_NOT_HAVE_CREATED_AT: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_SERVICE_TYPE: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_DESCRIPTION: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_PRICE: errorMessage = 'Incorrect input was provided for backend'; break;
      case ErrorCodes.POST_PROVIDER_MUST_NOT_HAVE_SERVICE_PROVIDED_CREATED_AT: errorMessage = 'Incorrect input was provided for backend'; break;

      case ErrorCodes.RELATED_PROVIDER_SERVICE_NOT_FOUND: errorMessage = 'Related service of this service provider was not found, please create it and / or connect it using Providers-Services record'; break;

      case ErrorCodes.ENDUSER_NOT_FOUND: errorMessage = 'Enduser not found'; break;
      case ErrorCodes.ADMIN_NOT_FOUND: errorMessage = 'Admin not found'; break;
      case ErrorCodes.PROVIDER_NOT_FOUND: errorMessage = 'Provider not found'; break;
      case ErrorCodes.PROVIDER_SERVICE_NOT_FOUND: errorMessage = 'Provider-service not found'; break;
      case ErrorCodes.SERVICE_NOT_FOUND: errorMessage = 'Service not found'; break;

      /**
       * Front-end specific errors
       */
      case ErrorCodes.INTERNAL_FRONTEND_ERROR: errorMessage = 'Unexpected error has happened on the frontend'; break;
      case ErrorCodes.SERVER_IS_UNAVAILABLE: errorMessage = 'Server is unavailable'; break;

      default: errorMessage = 'Unexpected error'; break;
    }

    str += errorMessage;

    if (l > 1) {
      let lastSign = '';

      if (i === l - 1) lastSign = '.';
      else lastSign = ',';

      str += lastSign;
    }

    i++;
  });

  return str;
};

