import { afterEach, describe, expect, it, vi } from 'vitest';

import { GitHubModelsPromptModel } from '../src/github-models';
import { getRuleById } from '../src/rules';

describe('GitHubModelsPromptModel', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('normalizes model findings into scanner findings', async () => {
    const rule = getRuleById('confirm-shaming');
    if (!rule) {
      throw new Error('Missing confirm-shaming rule in test setup.');
    }

    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify([
                {
                  ruleId: 'confirm-shaming',
                  message: 'This opt-out copy shames the user.',
                  evidence: 'No thanks, I hate saving money',
                },
              ]),
            },
          },
        ],
      }),
      status: 200,
    }));
    vi.stubGlobal('fetch', fetchMock);
    const model = new GitHubModelsPromptModel({ token: 'test-token' });

    const findings = await model.reviewFile({
      filePath: '/tmp/checkout.html',
      content: '<button>\nNo thanks, I hate saving money\n</button>',
      rules: [rule],
    });

    expect(findings).toEqual([
      {
        ruleId: 'confirm-shaming',
        title: rule.title,
        severity: rule.severity,
        filePath: '/tmp/checkout.html',
        line: 2,
        column: 1,
        message: 'This opt-out copy shames the user.',
        excerpt: 'No thanks, I hate saving money',
        recommendation: rule.recommendation,
        evidence: 'No thanks, I hate saving money',
      },
    ]);
  });

  it('uses the configured GitHub Models model ID and ignores unsupported rule ids', async () => {
    const rule = getRuleById('hidden-costs');
    if (!rule) {
      throw new Error('Missing hidden-costs rule in test setup.');
    }

    let requestedBody = '';
    const fetchMock = vi.fn(async (...args: unknown[]) => {
      requestedBody = String((args[1] as RequestInit | undefined)?.body ?? '');

      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify([
                  {
                    ruleId: 'not-a-real-rule',
                    message: 'ignore me',
                    evidence: 'ghost',
                  },
                ]),
              },
            },
          ],
        }),
        status: 200,
      };
    });
    vi.stubGlobal('fetch', fetchMock);
    const model = new GitHubModelsPromptModel({
      token: 'test-token',
      model: 'openai/gpt-4.1-mini',
    });

    const findings = await model.reviewFile({
      filePath: '/tmp/pricing.html',
      content: '<div>Additional charges may apply</div>',
      rules: [rule],
    });

    expect(findings).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(requestedBody)).toMatchObject({
      model: 'openai/gpt-4.1-mini',
    });
  });

  it('surfaces GitHub Models API failures without exposing tokens', async () => {
    const rule = getRuleById('hidden-costs');
    if (!rule) {
      throw new Error('Missing hidden-costs rule in test setup.');
    }

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        json: async () => ({
          error: {
            message: 'Unauthorized',
          },
        }),
        status: 401,
      })),
    );
    const model = new GitHubModelsPromptModel({ token: 'super-secret-token' });

    await expect(
      model.reviewFile({
        filePath: '/tmp/pricing.html',
        content: '<div>Additional charges may apply</div>',
        rules: [rule],
      }),
    ).rejects.toThrow('GitHub Models request failed with status 401: Unauthorized');
  });

  it('accepts fenced JSON objects with findings and explicit coordinates', async () => {
    const rule = getRuleById('hidden-costs');
    if (!rule) {
      throw new Error('Missing hidden-costs rule in test setup.');
    }

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content:
                  '```json\n{"findings":[{"ruleId":"hidden-costs","excerpt":"fees apply at checkout","line":3,"column":9}]}\n```',
              },
            },
          ],
        }),
        status: 200,
      })),
    );
    const model = new GitHubModelsPromptModel({ token: 'test-token' });

    const findings = await model.reviewFile({
      filePath: '/tmp/pricing.html',
      content: '<div>Displayed price</div>',
      rules: [rule],
    });

    expect(findings).toEqual([
      {
        ruleId: 'hidden-costs',
        title: rule.title,
        severity: rule.severity,
        filePath: '/tmp/pricing.html',
        line: 3,
        column: 9,
        message: 'Model flagged content that may match the hidden cost disclosure rule.',
        excerpt: 'fees apply at checkout',
        recommendation: rule.recommendation,
        evidence: 'fees apply at checkout',
      },
    ]);
  });

  it('returns no findings for empty model content and invalid rule ids', async () => {
    const rule = getRuleById('countdown-urgency');
    if (!rule) {
      throw new Error('Missing countdown-urgency rule in test setup.');
    }

    const fetchMock = vi
      .fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: '',
              },
            },
          ],
        }),
        status: 200,
      }))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify([
                  {
                    message: 'Missing rule id should be ignored',
                  },
                ]),
              },
            },
          ],
        }),
        status: 200,
      });
    vi.stubGlobal('fetch', fetchMock);
    const model = new GitHubModelsPromptModel({ token: 'test-token' });

    await expect(
      model.reviewFile({
        filePath: '/tmp/offer.html',
        content: '<div>Offer expires in 10:00</div>',
        rules: [rule],
      }),
    ).resolves.toEqual([]);

    await expect(
      model.reviewFile({
        filePath: '/tmp/offer.html',
        content: '<div>Offer expires in 10:00</div>',
        rules: [rule],
      }),
    ).resolves.toEqual([]);
  });

  it('reports malformed or unsupported GitHub Models payloads', async () => {
    const rule = getRuleById('forced-continuity');
    if (!rule) {
      throw new Error('Missing forced-continuity rule in test setup.');
    }

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({ unexpected: [] }),
              },
            },
          ],
        }),
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: 'not json',
              },
            },
          ],
        }),
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: [{ type: 'text', text: JSON.stringify([]) }],
              },
            },
          ],
        }),
        status: 200,
      });
    vi.stubGlobal('fetch', fetchMock);
    const model = new GitHubModelsPromptModel({ token: 'test-token' });

    await expect(
      model.reviewFile({
        filePath: '/tmp/subscription.html',
        content: '<div>Subscription renews automatically</div>',
        rules: [rule],
      }),
    ).rejects.toThrow('GitHub Models returned an unsupported findings payload.');

    await expect(
      model.reviewFile({
        filePath: '/tmp/subscription.html',
        content: '<div>Subscription renews automatically</div>',
        rules: [rule],
      }),
    ).rejects.toThrow('GitHub Models returned invalid JSON findings');

    await expect(
      model.reviewFile({
        filePath: '/tmp/subscription.html',
        content: '<div>Subscription renews automatically</div>',
        rules: [rule],
      }),
    ).resolves.toEqual([]);
  });
});
