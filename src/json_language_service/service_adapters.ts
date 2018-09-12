import * as vscode from "vscode";
import { TextDocument as JSONTextDocument, Diagnostic as JSONDiagnostic } from "vscode-json-languageservice";
import { DiagnosticRelatedInformation as JSONDiagnosticRelatedInformation, Range as JSONRange } from 'vscode-languageserver-types'

export class TextDocumentAdapter implements JSONTextDocument {

  constructor(private document : vscode.TextDocument) {
  }

  get uri() : string {
      return this.document.uri.toString();
  }

  get languageId() : string {
    return this.document.languageId;
  }

  positionAt(offset: number) : vscode.Position {
    return this.document.positionAt(offset);
  }

  get version() : number {
    return this.document.version;
  }

  getText(range? : vscode.Range | undefined) {
    if (range) {
      return this.document.getText(range);
    } else {
      return this.document.getText();
    }
  }

  offsetAt(position : vscode.Position) {
    return this.document.offsetAt(position);
  }

  get lineCount() {
    return this.document.lineCount;
  }
}

export function mapJsonDiagnostic(diag: JSONDiagnostic) : vscode.Diagnostic {
  var new_range = mapRange(diag.range);
  var new_diagnostic = new vscode.Diagnostic(
    new_range,
    diag.message
  );
  if (diag.code) {
    new_diagnostic.code = diag.code;
  }
  if (diag.severity) {
    new_diagnostic.severity = diag.severity;
  }
  if (diag.source) {
    new_diagnostic.source = new_diagnostic.source;
  }
  if (diag.relatedInformation) {
    new_diagnostic.relatedInformation = diag.relatedInformation.map(mapRelatedInformation)
  }
  return new_diagnostic;
}

function mapRelatedInformation(rel_info: JSONDiagnosticRelatedInformation) : vscode.DiagnosticRelatedInformation {
  var new_location = new vscode.Location(vscode.Uri.parse(rel_info.location.uri), mapRange(rel_info.location.range))
  return new vscode.DiagnosticRelatedInformation(new_location, rel_info.message);
}

function mapRange(range : JSONRange) : vscode.Range {
  var start_pos = new vscode.Position(range.start.line, range.start.character);
  var end_pos = new vscode.Position(range.end.line, range.end.character);
  return new vscode.Range(start_pos, end_pos);
}
