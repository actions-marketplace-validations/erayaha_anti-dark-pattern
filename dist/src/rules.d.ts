import type { DarkPatternRule } from './types';
export declare const DARK_PATTERN_RULES: readonly DarkPatternRule[];
export declare function getRuleById(ruleId: string): DarkPatternRule | undefined;
export declare function selectRules(ruleIds?: readonly string[]): readonly DarkPatternRule[];
