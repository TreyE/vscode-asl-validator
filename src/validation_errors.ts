import { ValidatorError, BadStateReference, ValidatorResult } from "./asl_validator/validator";
import { ErrorObject } from 'ajv';
import { Range, Position } from "vscode";
import { JSONSourceParseResult } from 'json-source-map';

export interface ValidationError {
  error: string;
  message: string;
  sourceLocation: Range | null;
}

export interface ValidationResult {
  isValid: boolean,
  errors: Array<ValidationError>
}

function convertErrorObject(valError : ValidatorError) : valError is ErrorObject {
  return true;
}

function convertBadStateReference(valError : ValidatorError) : valError is BadStateReference {
  return true;
}

function convertObject(valError : ValidatorError) : valError is object {
  return true;
}

function extractErrorMessageFromSchemaFailure(valError : ErrorObject) : String {
  return valError.message || "";
}

function mapError(valError : ValidatorError, sourceMap : JSONSourceParseResult) : object {
  if (convertErrorObject(valError)) {
    return <ValidationError>{
      error: valError.dataPath,
      message: extractErrorMessageFromSchemaFailure(valError),
      sourceLocation: sourceLocationFromSchemaError(valError, sourceMap)
    };
  } else if (convertBadStateReference(valError)) {
    return <ValidationError>{
      error: valError["Error code"],
      message: valError.Message,
      sourceLocation: null
    };
  } else if (convertObject(valError)) {
    return <ValidationError>{
      error: "Exception",
      message: valError.toString(),
      sourceLocation: null
    };
  }
  return valError;
}

function sourceLocationFromSchemaError(val: ErrorObject, sourceMap : JSONSourceParseResult) : Range | null {
  var errorPath = val.dataPath;
  var range = sourceMap.pointers[errorPath];
  if (range) {
    return new Range(
      new Position(range.value.line, range.value.column),
      new Position(range.valueEnd.line, range.valueEnd.column)
    )
  }
  return null;
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
        hasLocation: false,
        sourceLocation: null
      }
    ]
  });
}