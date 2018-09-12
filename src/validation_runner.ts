import * as vscode from "vscode";
import { Validator } from './validator';
import { ValidationResult } from "./validations/validation_result";
import { diagnosticFromValidationError, uniqueValidationErrors } from "./validations/validation_error";
import { getLanguageService, LanguageServiceParams } from "vscode-json-languageservice";
import { TextDocumentAdapter, mapJsonDiagnostic } from './json_language_service/service_adapters'

const languageServiceConfig : LanguageServiceParams = {
};

export class ValidationRunner {
  static runValidations() {
    if (vscode.window.activeTextEditor) {
      var document = vscode.window.activeTextEditor.document;
      var fileText = document.getText();
      try {
        var results = Validator.validate(fileText);
        if (results.isValid) {
          vscode.window.showInformationMessage("Valid Workflow");
        } else {
          var dc = vscode.languages.createDiagnosticCollection("Invalid Workflow");
          dc.set(document.uri,
            uniqueValidationErrors(results.errors).map((ve) => {
              return diagnosticFromValidationError(ve)
            })
          )
          vscode.window.showErrorMessage("Invalid Workflow", "Click for details").then(
            (selection) => {
              if (selection == "Click for details") {
                vscode.commands.executeCommand("workbench.action.problems.focus");
              }
            }
          )
        }
      } catch (e) {
          var lang_serv = getLanguageService(languageServiceConfig);
          lang_serv.doValidation(new TextDocumentAdapter(document), lang_serv.parseJSONDocument(new TextDocumentAdapter(document))).then(
            (diagnostics) => {
              var dc = vscode.languages.createDiagnosticCollection("Invalid Workflow");
              if (diagnostics) {
                dc.set(document.uri,
                  diagnostics.map(mapJsonDiagnostic)
                )
              } else {
                console.log("diagnostics was empty");
              }
              vscode.window.showErrorMessage("Invalid Workflow", "Click for details").then(
                (selection) => {
                  if (selection == "Click for details") {
                    vscode.commands.executeCommand("workbench.action.problems.focus");
                  }
                }
              )
            },
          (err: any) => { 
            console.log(err.toString());
            if (err instanceof Error) {
              console.log(err.stack);
            }
          }
          );
      }
    }
  }
}