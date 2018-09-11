import { ValidatorFunction } from "./asl_validator/validator_types"
import { mapNoJSONProvided, ValidationResult, mapResult } from './validation_errors';

var aslValidator : ValidatorFunction  = require('asl-validator');

export class Validator {
  static validate(source: string | null) : ValidationResult {
    if (source == null) {
      return mapNoJSONProvided();
    }
    var obj = JSON.parse(source);
    return mapResult(aslValidator(obj));
  }
}