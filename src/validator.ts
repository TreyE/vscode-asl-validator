import { validator as aslValidator } from "./asl_validator/validator";
import { mapNoJSONProvided, ValidationResult, mapResult } from './validations/validation_result';
import { parse as parseSourceMap } from "json-source-map"

export class Validator {
  static validate(source: string | null) : ValidationResult {
    if (source == null) {
      return mapNoJSONProvided();
    }
    var obj = JSON.parse(source);
    var sourceMap = parseSourceMap(source);
    return mapResult(aslValidator(obj), sourceMap);
  }
}