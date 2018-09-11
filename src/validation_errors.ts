import { ValidatorError, BadStateReference, ValidatorResult } from "./asl_validator/validator_types";
import { ErrorObject } from 'ajv';
import { Position, Range } from "vscode";

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
  console.log(valError);
  return valError.message || "";
}

function mapError(valError : ValidatorError) : object {
  if (convertErrorObject(valError)) {
    return <ValidationError>{
      error: valError.schemaPath,
      message: extractErrorMessageFromSchemaFailure(valError),
      sourceLocation: null
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

export function mapResult(valResult : ValidatorResult) : ValidationResult {
  return <ValidationResult>{
    isValid: valResult.isValid,
    errors: valResult.errors.map(mapError)
  };
}

interface HasSourceLocation {
  lineNumber: number;
  columnNumber: number;
}

function checkSyntaxErrorHasLocation(e : any) : e is HasSourceLocation {
  return true;
}

export function mapSyntaxError(e: any) {
  if (e instanceof SyntaxError) {
    var lineNumber = 1;
    var colNumber = 1;
    if (checkSyntaxErrorHasLocation(e)) {
      lineNumber = e.lineNumber;
      colNumber = e.lineNumber;
    }
    return <ValidationResult>({
      isValid: false,
      errors: [ 
        <ValidationError>{
          error: e.name,
          message: e.message,
          sourceLocation: new Range(new Position(lineNumber, colNumber), new Position(lineNumber, colNumber))
        }
      ]
    });
  } else {
    throw e;
  }
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