import { afterEach, describe, expect, it, vi } from 'vitest';

describe('action entrypoint', () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.unmock('../src/cli');
  });

  it('builds default GitHub Action arguments', async () => {
    const { buildActionArgs } = await import('../src/action');

    expect(buildActionArgs({})).toEqual(['.', '--format', 'github']);
  });

  it('maps GitHub Action inputs to CLI arguments', async () => {
    const { buildActionArgs } = await import('../src/action');

    expect(
      buildActionArgs({
        INPUT_PATH: 'src',
        INPUT_FORMAT: 'json',
        INPUT_RULES: 'confirm-shaming,hidden-costs',
        INPUT_MODEL: 'github',
        INPUT_GITHUB_MODEL: 'openai/gpt-5-mini',
      }),
    ).toEqual([
      'src',
      '--format',
      'json',
      '--rules',
      'confirm-shaming,hidden-costs',
      '--model',
      'github',
      '--github-model',
      'openai/gpt-5-mini',
    ]);
  });

  it('forwards normalized action inputs to runCli', async () => {
    const runCli = vi.fn(async () => 1);
    vi.doMock('../src/cli', () => ({ runCli }));

    const { runAction } = await import('../src/action');
    const exitCode = await runAction({
      INPUT_PATH: ' src ',
      INPUT_FORMAT: ' github ',
      INPUT_RULES: ' confirm-shaming ',
      INPUT_MODEL: ' github ',
      INPUT_GITHUB_MODEL: ' openai/gpt-5-mini ',
    });

    expect(exitCode).toBe(1);
    expect(runCli).toHaveBeenCalledWith([
      'src',
      '--format',
      'github',
      '--rules',
      'confirm-shaming',
      '--model',
      'github',
      '--github-model',
      'openai/gpt-5-mini',
    ]);
  });
});
