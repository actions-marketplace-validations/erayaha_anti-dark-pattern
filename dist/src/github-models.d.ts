import type { PromptDrivenModel } from './engine';
import type { AnalysisFinding, DarkPatternRule } from './types';
export interface GitHubModelsPromptModelOptions {
    token: string;
    model?: string;
    endpoint?: string;
    fetchImpl?: typeof fetch;
}
export declare class GitHubModelsPromptModel implements PromptDrivenModel {
    private readonly options;
    private readonly endpoint;
    private readonly fetchImpl;
    private readonly model;
    constructor(options: GitHubModelsPromptModelOptions);
    reviewFile(input: {
        filePath: string;
        content: string;
        rules: readonly DarkPatternRule[];
    }): Promise<AnalysisFinding[]>;
}
