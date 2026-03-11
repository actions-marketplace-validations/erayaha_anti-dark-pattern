import type { AnalysisFinding, DarkPatternRule } from './types';
import { collectRegexFindings, createFinding } from './utils';

function keywordRule(config: {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  regexes: readonly { pattern: RegExp; message: string }[];
  severity?: 'error' | 'warning';
}): DarkPatternRule {
  return {
    id: config.id,
    title: config.title,
    description: config.description,
    recommendation: config.recommendation,
    severity: config.severity ?? 'error',
    detect(content, filePath) {
      return config.regexes.flatMap(({ pattern, message }) =>
        collectRegexFindings(this, filePath, content, pattern, message),
      );
    },
  };
}

export const DARK_PATTERN_RULES: readonly DarkPatternRule[] = [
  keywordRule({
    id: 'confirm-shaming',
    title: 'Confirm shaming copy',
    description:
      'Flags manipulative opt-out language that guilts a user into accepting an offer.',
    recommendation:
      'Replace guilt-based copy with neutral opt-in and opt-out language.',
    regexes: [
      {
        pattern:
          /no thanks,?\s*i\s+(hate|prefer to miss|love paying|don'?t care about|do not care about)[^<\n]*/gi,
        message:
          'Detected opt-out copy that attempts to shame the user into accepting.',
      },
    ],
  }),
  keywordRule({
    id: 'forced-continuity',
    title: 'Forced continuity messaging',
    description:
      'Flags copy that hides or normalizes automatic renewal and post-trial charging.',
    recommendation:
      'Make renewal and cancellation terms explicit, prominent, and easy to understand.',
    regexes: [
      {
        pattern:
          /(renews automatically|auto[- ]?renew|subscription continues unless cancelled|trial ends[^.\n]*charged)/gi,
        message:
          'Detected automatic renewal or post-trial charging language that warrants review.',
      },
    ],
  }),
  keywordRule({
    id: 'hidden-costs',
    title: 'Hidden cost disclosure',
    description:
      'Flags language commonly used to reveal mandatory fees only late in the purchase flow.',
    recommendation:
      'Surface mandatory fees and charges up front in the primary price presentation.',
    regexes: [
      {
        pattern:
          /(service fee|processing fee|mandatory add-?on|fees apply at checkout|additional charges may apply)/gi,
        message:
          'Detected fee disclosure language that may indicate hidden or delayed costs.',
      },
    ],
  }),
  keywordRule({
    id: 'countdown-urgency',
    title: 'Artificial urgency or scarcity',
    description:
      'Flags countdown and scarcity claims that can pressure a user into a rushed choice.',
    recommendation:
      'Remove unsubstantiated urgency claims or provide verifiable context for scarcity messaging.',
    regexes: [
      {
        pattern:
          /(only\s+\d+\s+(spots|left|remaining)|deal ends in|offer expires in|countdown)/gi,
        message:
          'Detected urgency or scarcity messaging that may pressure users unfairly.',
      },
    ],
  }),
  {
    id: 'obstructive-consent',
    title: 'Obstructive consent UI',
    description:
      'Flags consent experiences where acceptance is emphasized but rejection is hidden or preselected.',
    severity: 'error',
    recommendation:
      'Give users a visible reject path and avoid pre-selecting marketing or tracking consent.',
    detect(content, filePath): AnalysisFinding[] {
      const findings: AnalysisFinding[] = [];
      const rejectHiddenPattern =
        /(accept all|allow all)[\s\S]{0,240}(display\s*:\s*none[\s\S]{0,120}(reject|decline)|aria-hidden\s*=\s*["']true["'][\s\S]{0,120}(reject|decline))/gi;
      const precheckedMarketingPattern =
        /<(input|button)[^>]*(newsletter|marketing|tracking|personalized ads)[^>]*checked[^>]*>/gi;

      for (const match of content.matchAll(rejectHiddenPattern)) {
        findings.push(
          createFinding(
            this,
            filePath,
            content,
            match.index ?? 0,
            match[0],
            'Detected consent UI where acceptance is visible but rejection appears hidden.',
          ),
        );
      }

      for (const match of content.matchAll(precheckedMarketingPattern)) {
        findings.push(
          createFinding(
            this,
            filePath,
            content,
            match.index ?? 0,
            match[0],
            'Detected a pre-checked marketing or tracking choice that should require explicit consent.',
          ),
        );
      }

      return findings;
    },
  },
];

export function getRuleById(ruleId: string): DarkPatternRule | undefined {
  return DARK_PATTERN_RULES.find((rule) => rule.id === ruleId);
}

export function selectRules(ruleIds?: readonly string[]): readonly DarkPatternRule[] {
  if (!ruleIds || ruleIds.length === 0) {
    return DARK_PATTERN_RULES;
  }

  const selectedRules = ruleIds.map((ruleId) => {
    const rule = getRuleById(ruleId);
    if (!rule) {
      throw new Error(`Unknown rule: ${ruleId}`);
    }

    return rule;
  });

  return selectedRules;
}
