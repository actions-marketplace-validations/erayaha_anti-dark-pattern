import { describe, expect, it } from 'vitest';

import { HeuristicAnalysisEngine, ModelBackedAnalysisEngine } from '../src/engine';
import { getRuleById } from '../src/rules';

describe('analysis engines', () => {
  it('uses the heuristic engine to apply selected rules', async () => {
    const rule = getRuleById('countdown-urgency');
    if (!rule) {
      throw new Error('Missing countdown-urgency rule in test setup.');
    }

    const engine = new HeuristicAnalysisEngine();
    const findings = await engine.analyzeFile(
      {
        path: '/tmp/offer.html',
        content: '<div>Offer expires in 00:10:00</div>',
      },
      [rule],
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.ruleId).toBe('countdown-urgency');
  });

  it('delegates model-backed analysis to the injected adapter', async () => {
    const model = {
      reviewFile: async () => [],
    };
    const engine = new ModelBackedAnalysisEngine(model);

    const findings = await engine.analyzeFile(
      {
        path: '/tmp/clean.html',
        content: '<div>Neutral experience</div>',
      },
      [],
    );

    expect(findings).toEqual([]);
  });
});
