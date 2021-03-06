export const task = {
  "$id": "http://asl-validator.cloud/task#",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "Type": {
      "type": "string",
      "pattern": "^Task$"
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
    "Resource": {
      "type": "string",
      "pattern": "^arn:aws:([a-z]|-)+:([a-z]|[0-9]|-)+:[0-9]+:([a-z]|-)+:.+$"
    },
    "ResultPath": {
      "type": ["string", "null"]
    },
    "Retry": {
      "type": "array",
      "items": {
        "types": "object",
        "properties": {
          "ErrorEquals": {
            "type": "array",
            "items": {
              "types": "string"
            }
          },
          "IntervalSeconds": {
            "type": "number",
            "minimum": 0
          },
          "MaxAttempts": {
            "type": "number",
            "minimum": 0
          },
          "BackoffRate": {
            "type": "number",
            "minimum": 0
          }
        },
        "required": ["ErrorEquals"]
      }
    },
    "Catch": {
      "type": "array",
      "items": {
        "types": "object",
        "properties": {
          "ErrorEquals": {
            "type": "array",
            "items": {
              "types": "string"
            }
          },
          "Next": {
            "type": "string"
          }
        },
        "required": ["ErrorEquals", "Next"]
      }
    },
    "TimeoutSeconds": {
      "type": "number",
      "minimum": 1
    },
    "HeartbeatSeconds": {
      "type": "number",
      "minimum": 1
    }
  },
  "oneOf": [{
    "required": ["Next"]
  }, {
    "required": ["End"]
  }],
  "required": ["Type", "Resource"],
  "additionalProperties": false
}
