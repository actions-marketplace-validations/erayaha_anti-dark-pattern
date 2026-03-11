import { HeuristicAnalysisEngine } from './engine';
import { selectRules } from './rules';
import type { AnalysisEngine, ScanSummary } from './types';
import { collectScannableFiles } from './utils';

export interface AnalyzeOptions {
  paths: readonly string[];
  ruleIds?: readonly string[];
  engine?: AnalysisEngine;
}

export async function analyzePaths(options: AnalyzeOptions): Promise<ScanSummary> {
  const rules = selectRules(options.ruleIds);
  const files = collectScannableFiles(options.paths.length > 0 ? options.paths : ['.']);
  const engine = options.engine ?? new HeuristicAnalysisEngine();
  const findings = (
    await Promise.all(files.map((file) => engine.analyzeFile(file, rules)))
  )
    .flat()
    .sort((left, right) => {
      return (
        left.filePath.localeCompare(right.filePath) ||
        left.line - right.line ||
        left.column - right.column ||
        left.ruleId.localeCompare(right.ruleId)
      );
    });

  return {
    fileCount: files.length,
    scannedFiles: files.map((file) => file.path),
    findings,
  };
}
