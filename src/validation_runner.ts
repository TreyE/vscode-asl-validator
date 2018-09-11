import * as vscode from "vscode";
import { Validator } from './validator';
import { ValidationResult, ValidationError } from "./validation_errors";
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
          vscode.window.showErrorMessage("Invalid Workflow", "Click for details").then(
            (selection) => {
              if (selection == "Click for details") {
                ValidationRunner.createDiagnostics(document.uri, results);
              }
            }
          )
        }
      } catch (e) {
        vscode.commands.executeCommand("workbench.action.problems.focus").then(() => {
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
            },
          (err: any) => { 
            console.log(err.toString());
            if (err instanceof Error) {
              console.log(err.stack);
            }
          }
          
          );
        });
      }
    }
  }

  private static createDiagnostics(uri: vscode.Uri, results: ValidationResult) {
    vscode.commands.executeCommand("workbench.action.problems.focus").then(() => {
      var dc = vscode.languages.createDiagnosticCollection("Invalid Workflow");
      dc.set(uri,
        results.errors.map(ValidationRunner.diagnosticFromValidationError)
      )
    });
  }

  private static diagnosticFromValidationError(err: ValidationError) {
    var codeRange = err.sourceLocation || new vscode.Range(new vscode.Position(0,0), new vscode.Position(0,0));
    var diag = new vscode.Diagnostic(
      codeRange,
      err.message,
      vscode.DiagnosticSeverity.Error
    );
    diag.code = err.error;
    return diag;
  }
}