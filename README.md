# vscode-asl-validator

Validate AWS Step Function State Machines.

Based on [asl-validator](https://github.com/airware/asl-validator) by AirWare (https://www.airware.com/).

## Features

Perform validation of your AWS Step Function State Machines.

## Commands

The validation can be run on the current editor by keybinding/running:
> extension.vscode-asl-validator.validate

## Acknowledgements

Not enough credit can go to [AirWare](https://www.airware.com/) for [asl-validator](https://github.com/airware/asl-validator).  Basically all I did was transform the schemas and validations to TypeScript.

Additionally, credit belongs to Microsoft for making available the [JSON Language Service](https://github.com/Microsoft/vscode-json-languageservice) as an independent package.

## Known Issues

The messages produced from schema failures only include the error itself.  The messages are a little difficult to read.  I'm working on making the errors returned by Ajv display details in an easier to understand format.

## Release Notes

### 0.1.0

Initial release.