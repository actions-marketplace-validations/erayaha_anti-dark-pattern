import type { AnalysisEngine, ScanSummary } from './types';
export interface AnalyzeOptions {
    paths: readonly string[];
    ruleIds?: readonly string[];
    engine?: AnalysisEngine;
}
export declare function analyzePaths(options: AnalyzeOptions): Promise<ScanSummary>;
