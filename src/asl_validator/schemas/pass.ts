export const pass = {
  "$id": "http://asl-validator.cloud/pass#",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "Type": {
      "type": "string",
      "pattern": "^Pass$"
    },
    "Next": {
      "type": "string"
    },
    "End": {
      "enum": [true]
    },
    "Comment": {
      "type": "string"
    },
    "OutputPath": {
      "type": ["string", "null"]
    },
    "InputPath": {
      "type": ["string", "null"]
    },
    "ResultPath": {
      "type": "string"
    },
    "Result": {}
  },
  "oneOf": [{
    "required": ["Next"]
  }, {
    "required": ["End"]
  }],
  "required": ["Type"],
  "additionalProperties": false
}
