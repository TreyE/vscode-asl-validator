declare module "json-source-map" {
  export interface JSONSourceParseResult {
    data: any;
    pointers: SourcePointerSet;
  }

  export interface SourcePointerSet {
    [key : string] : SourceMapping | undefined
  }

  export interface SourceMapping {
    key: SourceLocation | null;
    keyEnd: SourceLocation | null;
    value: SourceLocation;
    valueEnd: SourceLocation;
  }

  export interface SourceLocation {
    line: number;
    column: number;
    pos: number;
  }

  export function parse(source: string) : JSONSourceParseResult;
}