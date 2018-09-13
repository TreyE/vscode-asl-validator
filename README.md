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

Big thanks also to [epoberezkin](https://github.com/epoberezkin) for [json-source-map](https://github.com/epoberezkin/json-source-map).  This powers the JSON Pointer to source-code lookup.

Finally, credit belongs to Microsoft for making available the [JSON Language Service](https://github.com/Microsoft/vscode-json-languageservice) as an independent package.

## Release Notes

### 0.1.1

Clean up Problems on each validation run.
Better vaildation failure messages.

### 0.1.0

Initial release.