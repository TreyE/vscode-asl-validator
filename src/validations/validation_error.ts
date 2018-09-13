import { Range, Position, Diagnostic, DiagnosticSeverity } from 'vscode';
import { ErrorObject } from 'ajv';
import { ValidatorError, BadStateReference } from "../asl_validator/validator";
import { JSONSourceParseResult } from 'json-source-map';
import { uniqWith } from "lodash";

export interface ValidationError {
  error: string;
  message: string;
  sourceLocation: Range | null;
}

function compareValidationErrors(currentVE : ValidationError, otherVE: ValidationError) : boolean {
  if (!(currentVE.message === otherVE.message)) {
    return false;
  }
  if (currentVE.sourceLocation) {
    if (otherVE.sourceLocation) {
      return currentVE.sourceLocation.isEqual(otherVE.sourceLocation);
    } else {
      return false;
    }
  } else {
    return !!otherVE.sourceLocation;
  }
}

export function uniqueValidationErrors(inErrs: Array<ValidationError>) : Array<ValidationError> {
  return uniqWith(inErrs, compareValidationErrors);
}

export function diagnosticFromValidationError(err: ValidationError) {
  var codeRange = err.sourceLocation || new Range(new Position(0,0), new Position(0,0));
  var diag = new Diagnostic(
    codeRange,
    err.message,
    DiagnosticSeverity.Error
  );
  diag.code = err.error;
  return diag;
}

class BadStateReferenceError implements ValidationError {
  error: string;
  message: string;
  sourceLocation : Range | null = null;

  constructor(valError : BadStateReference) {
    this.error = valError["Error code"];
    this.message = valError.Message;
  }
}

class SchemaFailureError implements ValidationError {
  error : string;
  message : string;
  sourceLocation: Range | null;

  constructor(schemaError : ErrorObject, sourceMap : JSONSourceParseResult) {
    this.error = schemaError.dataPath;
    this.message = this.extractErrorMessageFromSchemaFailure(schemaError);
    this.sourceLocation = this.sourceLocationFromSchemaError(schemaError, sourceMap);
  }

  private extractErrorMessageFromSchemaFailure(valError : ErrorObject) : string {
    var messageVal = valError.message || "";
    if (valError.propertyName) {
      return `${valError.propertyName}, ${valError.keyword} - ${messageVal}`;  
    } else if (valError.data) {
      return `${this.extractDataPath(valError)} - ${valError.data} - ${messageVal}`;
    }
    return `${this.extractDataPath(valError)} - ${messageVal}`;
  }

  private extractDataPath(valError : ErrorObject) : String {
    if (valError.dataPath === "") {
      return "/";
    }
    return valError.dataPath;
  }

  private sourceLocationFromSchemaError(val: ErrorObject, sourceMap : JSONSourceParseResult) : Range | null {
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
}

function convertErrorObject(valError : ValidatorError) : valError is ErrorObject {
  return (<ErrorObject>valError).dataPath !== undefined;
}

function convertBadStateReference(valError : ValidatorError) : valError is BadStateReference {
  return (<BadStateReference>valError).Message !== undefined;
}

export function mapError(valError : ValidatorError, sourceMap : JSONSourceParseResult) : object {
  if (convertErrorObject(valError)) {
    return new SchemaFailureError(valError, sourceMap);
  } else if (convertBadStateReference(valError)) {
    return new BadStateReferenceError(valError);
  } else {
    return <ValidationError>{
      error: "Exception",
      message: valError.toString(),
      sourceLocation: null
    };
  }
}
