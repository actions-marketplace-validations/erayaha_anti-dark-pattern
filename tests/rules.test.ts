import { describe, expect, it } from 'vitest';

import { DARK_PATTERN_RULES, getRuleById, selectRules } from '../src/rules';

function findRule(ruleId: string) {
  const rule = DARK_PATTERN_RULES.find((candidate) => candidate.id === ruleId);
  if (!rule) {
    throw new Error(`Rule ${ruleId} not found in test setup.`);
  }

  return rule;
}

describe('dark pattern rules', () => {
  it('detects confirm shaming language', () => {
    const findings = findRule('confirm-shaming').detect(
      '<button>No thanks, I hate saving money</button>',
      '/tmp/confirm-shaming.html',
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.line).toBe(1);
  });

  it('detects forced continuity copy', () => {
    const findings = findRule('forced-continuity').detect(
      '<div>Your subscription renews automatically after the trial ends and you will be charged monthly.</div>',
      '/tmp/forced-continuity.html',
    );

    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding.ruleId === 'forced-continuity')).toBe(
      true,
    );
  });

  it('detects hidden fees language', () => {
    const findings = findRule('hidden-costs').detect(
      '<span>Additional charges may apply at checkout, including a service fee.</span>',
      '/tmp/hidden-costs.html',
    );

    expect(findings).toHaveLength(2);
  });

  it('detects countdown urgency patterns', () => {
    const findings = findRule('countdown-urgency').detect(
      '<div>Only 2 spots remaining. Deal ends in 00:05:00.</div>',
      '/tmp/countdown-urgency.html',
    );

    expect(findings).toHaveLength(2);
  });

  it('detects obstructive consent patterns', () => {
    const findings = findRule('obstructive-consent').detect(
      `<button>Accept all</button>
       <button style="display:none">Reject</button>
       <input type="checkbox" name="newsletter" checked />`,
      '/tmp/obstructive-consent.html',
    );

    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding.ruleId === 'obstructive-consent')).toBe(
      true,
    );
  });

  it('detects aria-hidden reject paths', () => {
    const findings = findRule('obstructive-consent').detect(
      '<button>Allow all</button><button aria-hidden="true">Decline</button>',
      '/tmp/aria-hidden-consent.html',
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain('rejection appears hidden');
  });

  it('ignores neutral UI copy', () => {
    const findings = DARK_PATTERN_RULES.flatMap((rule) =>
      rule.detect(
        `<div>
           <button>Accept</button>
           <button>Decline</button>
           <p>Price shown includes taxes and shipping.</p>
         </div>`,
        '/tmp/clean.html',
      ),
    );

    expect(findings).toHaveLength(0);
  });

  it('looks up and filters rules by id', () => {
    expect(getRuleById('hidden-costs')?.title).toBe('Hidden cost disclosure');
    expect(selectRules(['hidden-costs']).map((rule) => rule.id)).toEqual(['hidden-costs']);
    expect(selectRules().length).toBe(DARK_PATTERN_RULES.length);
  });

  it('throws when selecting an unknown rule', () => {
    expect(() => selectRules(['does-not-exist'])).toThrow('Unknown rule: does-not-exist');
  });
});
