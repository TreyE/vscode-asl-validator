import * as Ajv from 'ajv'

import { choice } from './schemas/choice';
import { fail } from './schemas/fail';
import { parallel } from './schemas/parallel';
import { pass } from './schemas/pass';
import { state_machine } from './schemas/state-machine';
import { state } from './schemas/state';
import { succeed } from './schemas/succeed';
import { task } from './schemas/task';
import { wait } from './schemas/wait';

import { ErrorObject } from 'ajv';

var jp : any = require('jsonpath');

function missingTransitionTarget(definition: any) : Array<any> {
  // retrieve all states
  var machineStates = <Array<any>>[];
  jp.query(definition, '$..[\'States\']')
    .forEach((s : any) => {
      machineStates = machineStates.concat(Object.keys(s));
    });

  // retrieve all reachable states
  var reachableStates = jp.query(definition, '$..[\'StartAt\',\'Next\',\'Default\']')
    .filter((path : any) => typeof path === 'string')
    .filter((path :any , pos: any, array: any) => array.indexOf(path) === pos);

  // check if all states are reachable
  var unreachable = machineStates.filter(state => reachableStates.indexOf(state) === -1)
    .map(state => ({
      'Error code': 'MISSING_TRANSITION_TARGET',
      Message: `State ${state} is not reachable`,
    }));

  // check if all 'Next', 'StartAt' and 'Default' states exist
  var inexistant = reachableStates.filter((state : any) => machineStates.indexOf(state) === -1)
    .map((state : any) => ({
      'Error code': 'MISSING_TRANSITION_TARGET',
      Message: `Missing 'StartAt'|'Next'|'Default' target: ${state}`,
    }));

  return unreachable.concat(inexistant);
};

function checkJsonPath(definition : any) : object[] {
  return jp.query(definition, '$..[\'InputPath\',\'OutputPath\',\'ResultPath\']')
  .filter((path : any) => (typeof path === 'string'))
  .map((path : any) => {
    try {
      jp.parse(path);
      return null;
    } catch (e) {
      return e;
    }
  })
  .filter((parsed : any | null) => parsed ); // remove null values to keep only errors
}

export interface BadStateReference {
  'Error code': String,
  Message : String
}

export type ValidatorError = ErrorObject | BadStateReference | object;

export interface ValidatorResult {
  isValid: boolean,
  errors: Array<ValidatorError>
}

export function validator(definition : object) : ValidatorResult {
  var ajv = new Ajv({
    schemas: [
      choice,
      fail,
      parallel,
      pass,
      state_machine,
      state,
      succeed,
      task,
      wait
    ],
    jsonPointers: true
  });

  // Validating JSON paths
  var jsonPathErrors = checkJsonPath(definition);

  // Check unreachable states
  var missingTransitionTargetErrors = missingTransitionTarget(definition);

  // Validating JSON schemas
  var isJsonSchemaValid = ajv.validate('http://asl-validator.cloud/state-machine#', definition);

  return {
    isValid: isJsonSchemaValid && !jsonPathErrors.length && !missingTransitionTargetErrors.length,
    errors: jsonPathErrors.concat(ajv.errors || []).concat(missingTransitionTargetErrors || []),
  };
}