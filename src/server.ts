import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocument,
  Diagnostic,
  DiagnosticSeverity,
  DidChangeConfigurationParams,
  InitializeResult,
  TextDocumentSyncKind,
} from 'vscode-languageserver';

import { basename } from 'path';

import * as jsonToAst from 'json-to-ast';

import { ExampleConfiguration, Severity, RuleKeys } from './configuration';
import { makeLint, LinterProblem } from './linter';

let conn = createConnection(ProposedFeatures.all);
let docs = new TextDocuments();
let conf: ExampleConfiguration | undefined = undefined;

conn.onInitialize(
  (): InitializeResult => {
    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Full,
      },
    };
  },
);

function getSeverity(key: RuleKeys): DiagnosticSeverity | undefined {
  if (!conf || !conf.severity) {
    return undefined;
  }

  const severity: Severity = conf.severity[key];

  switch (severity) {
    case Severity.Error:
      return DiagnosticSeverity.Error;
    case Severity.Warning:
      return DiagnosticSeverity.Warning;
    case Severity.Information:
      return DiagnosticSeverity.Information;
    case Severity.Hint:
      return DiagnosticSeverity.Hint;
    default:
      return undefined;
  }
}

function getMessage(key: RuleKeys): string {
  if (key === RuleKeys.BlockNameIsRequired) {
    return 'Field named \'block\' is required!';
  }

  if (key === RuleKeys.UppercaseNamesIsForbidden) {
    return 'Uppercase properties are forbidden!';
  }

  return `Unknown problem type '${key}'`;
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  const source = basename(textDocument.uri);
  const json = textDocument.getText();

  const validateObject = (obj: jsonToAst.AstObject): LinterProblem<RuleKeys>[] =>
    obj.children.some(p => p.key.value.toLowerCase() === 'block')
      ? []
      : [{ key: RuleKeys.BlockNameIsRequired, loc: obj.loc }];

  const validateProperty = (property: jsonToAst.AstProperty): LinterProblem<RuleKeys>[] =>
    /^[A-Z]+$/.test(property.key.value)
      ? [
          {
            key: RuleKeys.UppercaseNamesIsForbidden,
            loc: property.loc,
          },
        ]
      : [];

  const diagnostics: Diagnostic[] = makeLint(
    json,
    validateProperty,
    validateObject,
  ).reduce((list: Diagnostic[], problem: LinterProblem<RuleKeys>): Diagnostic[] => {
    const severity = getSeverity(problem.key);

    if (severity) {
      const message = getMessage(problem.key);

      let diagnostic: Diagnostic = {
        range: {
          start: textDocument.positionAt(problem.loc.start.offset),
          end: textDocument.positionAt(problem.loc.end.offset),
        },
        severity,
        message,
        source,
      };

      list.push(diagnostic);
    }

    return list;
  }, []);

  conn.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

async function validateAll() {
  for (const document of docs.all()) {
    await validateTextDocument(document);
  }
}

docs.onDidChangeContent(change => {
  validateTextDocument(change.document);
});

conn.onDidChangeConfiguration(({ settings }: DidChangeConfigurationParams) => {
  conf = settings.example;
  validateAll();
});

docs.listen(conn);
conn.listen();
