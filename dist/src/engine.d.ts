import type { AnalysisEngine, AnalysisFinding, DarkPatternRule, ScannableFile } from './types';
export interface PromptDrivenModel {
    reviewFile(input: {
        filePath: string;
        content: string;
        rules: readonly DarkPatternRule[];
    }): Promise<AnalysisFinding[]>;
}
export declare class HeuristicAnalysisEngine implements AnalysisEngine {
    analyzeFile(file: ScannableFile, rules: readonly DarkPatternRule[]): Promise<AnalysisFinding[]>;
}
export declare class ModelBackedAnalysisEngine implements AnalysisEngine {
    private readonly model;
    constructor(model: PromptDrivenModel);
    analyzeFile(file: ScannableFile, rules: readonly DarkPatternRule[]): Promise<AnalysisFinding[]>;
}
