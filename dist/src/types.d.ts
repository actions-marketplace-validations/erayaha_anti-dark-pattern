export type Severity = 'error' | 'warning';
export interface AnalysisFinding {
    ruleId: string;
    title: string;
    severity: Severity;
    filePath: string;
    line: number;
    column: number;
    message: string;
    excerpt: string;
    recommendation: string;
    evidence: string;
}
export interface DarkPatternRule {
    id: string;
    title: string;
    description: string;
    severity: Severity;
    recommendation: string;
    detect(content: string, filePath: string): AnalysisFinding[];
}
export interface ScannableFile {
    path: string;
    content: string;
}
export interface ScanSummary {
    fileCount: number;
    scannedFiles: string[];
    findings: AnalysisFinding[];
}
export interface AnalysisEngine {
    analyzeFile(file: ScannableFile, rules: readonly DarkPatternRule[]): Promise<AnalysisFinding[]>;
}
