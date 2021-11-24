/* eslint-disable max-classes-per-file */
class ApiValidationError extends Error {
  constructor(errors, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiValidationError);
    }
    this.errors = errors;
    this.name = 'ApiValidationError';
  }
}

class AuthorizationError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthorizationError);
    }
    this.name = 'AuthorizationError';
  }
}

class RequestError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthorizationError);
    }
    this.name = 'RequestError';
  }
}

module.exports = { ApiValidationError, AuthorizationError, RequestError };
