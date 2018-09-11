export const state = {
  "$id": "http://asl-validator.cloud/state#",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "oneOf": [{
      "$ref": "http://asl-validator.cloud/choice#"
    },
    {
      "$ref": "http://asl-validator.cloud/fail#"
    },
    {
      "$ref": "http://asl-validator.cloud/parallel#"
    },
    {
      "$ref": "http://asl-validator.cloud/pass#"
    },
    {
      "$ref": "http://asl-validator.cloud/succeed#"
    },
    {
      "$ref": "http://asl-validator.cloud/task#"
    },
    {
      "$ref": "http://asl-validator.cloud/wait#"
    }
  ]
}
