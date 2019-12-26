export enum RuleKeys {
  UppercaseNamesIsForbidden = 'uppercaseNamesIsForbidden',
  BlockNameIsRequired = 'blockNameIsRequired',
  WarningTextSizesShouldBeEqual = 'warningTextSizesShouldBeEqual',
  WarningInvalidButtonSize = 'warningInvalidButtonSize',
  WarningInvalidButtonPosition = 'warningInvalidButtonPosition',
  WarningInvalidPlaceholderSize = 'warningInvalidPlaceholderSize',
  TextSeveralH1 = 'textSeveralH1',
  TextInvalidH2Position = 'textInvalidH2Position',
  TextInvalidH3Position = 'textInvalidH3Position',
  GridTooMuchMarketingBlocks = 'gridTooMuchMarketingBlocks',
}

export enum Severity {
  Error = 'Error',
  Warning = 'Warning',
  Information = 'Information',
  Hint = 'Hint',
  None = 'None',
}

export interface SeverityConfiguration {
  [RuleKeys.BlockNameIsRequired]: Severity;
  [RuleKeys.UppercaseNamesIsForbidden]: Severity;
  [RuleKeys.WarningTextSizesShouldBeEqual]: Severity;
  [RuleKeys.WarningInvalidButtonSize]: Severity;
  [RuleKeys.WarningInvalidButtonPosition]: Severity;
  [RuleKeys.WarningInvalidPlaceholderSize]: Severity;
  [RuleKeys.TextSeveralH1]: Severity;
  [RuleKeys.TextInvalidH2Position]: Severity;
  [RuleKeys.TextInvalidH3Position]: Severity;
  [RuleKeys.GridTooMuchMarketingBlocks]: Severity;
}

export const MyLinterErrorCodsMap = new Map([
  ['WARNING.TEXT_SIZES_SHOULD_BE_EQUAL', RuleKeys.WarningTextSizesShouldBeEqual],
  ['WARNING.INVALID_BUTTON_SIZE', RuleKeys.WarningInvalidButtonSize],
  ['WARNING.INVALID_BUTTON_POSITION', RuleKeys.WarningInvalidButtonPosition],
  ['WARNING.INVALID_PLACEHOLDER_SIZE', RuleKeys.WarningInvalidPlaceholderSize],
  ['TEXT.SEVERAL_H1', RuleKeys.TextSeveralH1],
  ['TEXT.INVALID_H2_POSITION', RuleKeys.TextInvalidH2Position],
  ['TEXT.INVALID_H3_POSITION', RuleKeys.TextInvalidH3Position],
  ['GRID.TOO_MUCH_MARKETING_BLOCKS', RuleKeys.GridTooMuchMarketingBlocks],
]);

export interface ExampleConfiguration {
  enable: boolean;

  severity: SeverityConfiguration;
}
