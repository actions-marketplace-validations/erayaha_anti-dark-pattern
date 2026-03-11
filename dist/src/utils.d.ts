import type { AnalysisFinding, DarkPatternRule, ScannableFile } from './types';
export declare function collectScannableFiles(inputPaths: readonly string[]): ScannableFile[];
export declare function findLineAndColumn(content: string, index: number): {
    line: number;
    column: number;
};
export declare function createFinding(rule: DarkPatternRule, filePath: string, content: string, matchIndex: number, matchText: string, message: string, evidence?: string): AnalysisFinding;
export declare function collectRegexFindings(rule: DarkPatternRule, filePath: string, content: string, regex: RegExp, message: string): AnalysisFinding[];
