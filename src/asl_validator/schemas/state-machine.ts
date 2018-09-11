export const state_machine = {
  "$id": "http://asl-validator.cloud/state-machine#",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "Comment": {
      "type": "string"
    },
    "StartAt": {
      "type": "string"
    },
    "States": {
      "type": "object",
      "patternProperties": {
        "^.{1,128}$": {
          "$ref": "http://asl-validator.cloud/state#"
        }
      },
      "additionalProperties": false
    },
    "Version": {
      "type": "string"
    },
    "TimeoutSeconds": {
      "type": "integer",
      "minimum": 0
    }
  },
  "additionalProperties": false,
  "required": ["StartAt", "States"]
}
