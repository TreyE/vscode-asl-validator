export const succeed = {
  "$id": "http://asl-validator.cloud/succeed#",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "Type": {
      "type": "string",
      "pattern": "^Succeed$"
    },
    "Comment": {
      "type": "string"
    }
  },
  "required": ["Type"],
  "additionalProperties": false
}
