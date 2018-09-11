import { ErrorObject } from 'ajv';

export interface BadStateReference {
  'Error code': String,
  Message : String
}

export type ValidatorError = ErrorObject | BadStateReference | object;

export interface ValidatorResult {
  isValid: boolean,
  errors: Array<ValidatorError>
}

export type ValidatorFunction = (defintion: any) => ValidatorResult;