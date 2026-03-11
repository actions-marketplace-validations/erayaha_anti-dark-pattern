import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, describe, expect, it } from 'vitest';

import { runCli } from '../src/cli';

const temporaryDirectories: string[] = [];

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const directory = temporaryDirectories.pop();
    if (directory) {
      rmSync(directory, { force: true, recursive: true });
    }
  }
});

function createProjectFile(filename: string, content: string): string {
  const projectDirectory = mkdtempSync(join(tmpdir(), 'anti-dark-pattern-cli-'));
  temporaryDirectories.push(projectDirectory);
  const filePath = join(projectDirectory, filename);
  mkdirSync(join(filePath, '..'), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

function createIoCapture() {
  const stdout: string[] = [];
  const stderr: string[] = [];

  return {
    io: {
      stdout: (message: string) => stdout.push(message),
      stderr: (message: string) => stderr.push(message),
    },
    stderr,
    stdout,
  };
}

describe('runCli', () => {
  it('prints help text', async () => {
    const capture = createIoCapture();

    const exitCode = await runCli(['--help'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout.join('')).toContain('Usage: anti-dark-pattern');
  });

  it('lists available rules', async () => {
    const capture = createIoCapture();

    const exitCode = await runCli(['--list-rules'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout.join('')).toContain('confirm-shaming');
    expect(capture.stdout.join('')).toContain('obstructive-consent');
  });

  it('returns a failing exit code and JSON output when issues are found', async () => {
    const filePath = createProjectFile(
      'checkout.html',
      '<button>No thanks, I hate saving money</button>',
    );
    const capture = createIoCapture();

    const exitCode = await runCli([filePath, '--format', 'json'], capture.io);
    const summary = JSON.parse(capture.stdout.join('')) as { findings: Array<{ ruleId: string }> };

    expect(exitCode).toBe(1);
    expect(summary.findings).toHaveLength(1);
    expect(summary.findings[0]?.ruleId).toBe('confirm-shaming');
  });

  it('writes GitHub annotations', async () => {
    const filePath = createProjectFile(
      'checkout.html',
      '<div>Only 2 spots remaining and this deal ends in 10:00.</div>',
    );
    const capture = createIoCapture();

    const exitCode = await runCli([filePath, '--format=github'], capture.io);

    expect(exitCode).toBe(1);
    expect(capture.stdout.join('')).toContain('::error file=');
    expect(capture.stdout.join('')).toContain('countdown-urgency');
  });

  it('writes a GitHub notice when a scan is clean', async () => {
    const filePath = createProjectFile(
      'clean.html',
      '<button>Accept</button><button>Decline</button>',
    );
    const capture = createIoCapture();

    const exitCode = await runCli([filePath, '--format=github'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout.join('')).toContain('::notice::Scanned 1 file(s)');
  });

  it('supports rule filtering and default path selection', async () => {
    const projectDirectory = mkdtempSync(join(tmpdir(), 'anti-dark-pattern-cli-project-'));
    temporaryDirectories.push(projectDirectory);
    writeFileSync(
      join(projectDirectory, 'checkout.html'),
      '<div>Additional charges may apply. No thanks, I hate saving money.</div>',
    );
    const originalCwd = process.cwd();
    const capture = createIoCapture();

    process.chdir(projectDirectory);
    try {
      const exitCode = await runCli(['--rules', 'confirm-shaming'], capture.io);

      expect(exitCode).toBe(1);
      expect(capture.stdout.join('')).toContain('[error] confirm-shaming');
      expect(capture.stdout.join('')).not.toContain('hidden-costs');
    } finally {
      process.chdir(originalCwd);
    }
  });

  it('reports invalid arguments', async () => {
    const capture = createIoCapture();

    const exitCode = await runCli(['--format', 'xml'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stderr.join('')).toContain('Unsupported format');
  });

  it('reports missing rule values and scan errors', async () => {
    const missingRuleValue = createIoCapture();
    const missingFile = createIoCapture();

    const missingRuleValueExitCode = await runCli(['--rules'], missingRuleValue.io);
    const missingFileExitCode = await runCli(['/tmp/does-not-exist.html'], missingFile.io);

    expect(missingRuleValueExitCode).toBe(2);
    expect(missingRuleValue.stderr.join('')).toContain('Missing value for --rules');
    expect(missingFileExitCode).toBe(2);
    expect(missingFile.stderr.join('')).toContain('ENOENT');
  });

  it('returns success when no patterns are found', async () => {
    const filePath = createProjectFile(
      'clean.html',
      '<button>Accept</button><button>Decline</button><p>Displayed price includes fees.</p>',
    );
    const capture = createIoCapture();

    const exitCode = await runCli([filePath], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout.join('')).toContain('found no dark patterns');
  });
});
