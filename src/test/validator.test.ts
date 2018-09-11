import * as assert from 'assert';
import { Validator } from '../validator';

var empty_json_object : object = {

};

var null_start_at_object : object = {
  "StartAt" : null
};

suite("Validator Tests", function () {
  test("Attempt to validate a null value", function() {
    var validatorResult = Validator.validate(null);
    assert(!validatorResult.isValid);
  });

  test("Attempt to validate an empty JSON object", function() {
    var validatorResult = Validator.validate(JSON.stringify(empty_json_object));

    assert(!validatorResult.isValid);
  });

  test("Attempt to validate a null 'StartAt'", function() {
    var validatorResult = Validator.validate(JSON.stringify(null_start_at_object));
    assert(!validatorResult.isValid);
  });
});