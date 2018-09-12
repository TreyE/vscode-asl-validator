import { ValidatorResult } from "../asl_validator/validator";
import { ValidationError, mapError } from './validation_error';

import { JSONSourceParseResult } from 'json-source-map';

export interface ValidationResult {
  isValid: boolean,
  errors: Array<ValidationError>
}

export function mapResult(valResult : ValidatorResult, sourceMap : JSONSourceParseResult) : ValidationResult {
  return <ValidationResult>{
    isValid: valResult.isValid,
    errors: valResult.errors.map((valErr) => mapError(valErr, sourceMap))
  };
}

export function mapNoJSONProvided() {
  return <ValidationResult>({
    isValid: false,
    errors: [
      <ValidationError>{
        error: "NoJSONError",
        message: "A null was provided for the JSON source.",
        sourceLocation: null
      }
    ]
  });
}