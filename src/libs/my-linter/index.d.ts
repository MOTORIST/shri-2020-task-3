declare module 'my-linter' {
  export interface LinterError {
    code: string;
    error: string;
    location: LinterErrorLocation;
  }

  export interface LinterErrorLocation {
    start: Position;
    end: Position;
  }

  interface Position {
    column: number;
    line: number;
  }

  export default function linter(json: string): LinterError[];
}
