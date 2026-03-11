import type {
  AnalysisEngine,
  AnalysisFinding,
  DarkPatternRule,
  ScannableFile,
} from './types';

export interface PromptDrivenModel {
  reviewFile(input: {
    filePath: string;
    content: string;
    rules: readonly DarkPatternRule[];
  }): Promise<AnalysisFinding[]>;
}

export class HeuristicAnalysisEngine implements AnalysisEngine {
  async analyzeFile(
    file: ScannableFile,
    rules: readonly DarkPatternRule[],
  ): Promise<AnalysisFinding[]> {
    return rules.flatMap((rule) => rule.detect(file.content, file.path));
  }
}

export class ModelBackedAnalysisEngine implements AnalysisEngine {
  constructor(private readonly model: PromptDrivenModel) {}

  analyzeFile(
    file: ScannableFile,
    rules: readonly DarkPatternRule[],
  ): Promise<AnalysisFinding[]> {
    return this.model.reviewFile({
      filePath: file.path,
      content: file.content,
      rules,
    });
  }
}
