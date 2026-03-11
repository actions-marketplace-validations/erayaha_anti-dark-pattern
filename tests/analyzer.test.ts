import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { analyzePaths } from '../src/analyzer';
import { ModelBackedAnalysisEngine } from '../src/engine';
import type { AnalysisFinding } from '../src/types';

const temporaryDirectories: string[] = [];

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const directory = temporaryDirectories.pop();
    if (directory) {
      rmSync(directory, { force: true, recursive: true });
    }
  }
});

function createFixtureProject(): string {
  const projectDirectory = mkdtempSync(join(tmpdir(), 'anti-dark-pattern-'));
  temporaryDirectories.push(projectDirectory);
  mkdirSync(join(projectDirectory, 'src'));
  mkdirSync(join(projectDirectory, 'node_modules'));

  writeFileSync(
    join(projectDirectory, 'src', 'checkout.tsx'),
    '<div>Additional charges may apply at checkout and the service fee appears later.</div>',
  );
  writeFileSync(
    join(projectDirectory, 'src', 'consent.html'),
    '<button>Accept all</button><button style="display:none">Reject</button>',
  );
  writeFileSync(join(projectDirectory, 'node_modules', 'ignored.ts'), 'Only 1 left');

  return projectDirectory;
}

describe('analyzePaths', () => {
  it('scans directories, ignores generated folders, and sorts findings', async () => {
    const projectDirectory = createFixtureProject();

    const summary = await analyzePaths({ paths: [projectDirectory] });

    expect(summary.fileCount).toBe(2);
    expect(summary.scannedFiles.every((filePath) => !filePath.includes('node_modules'))).toBe(
      true,
    );
    expect(summary.findings.map((finding) => finding.ruleId)).toEqual([
      'hidden-costs',
      'hidden-costs',
      'obstructive-consent',
    ]);
  });

  it('supports filtering by rule id', async () => {
    const projectDirectory = createFixtureProject();

    const summary = await analyzePaths({
      paths: [projectDirectory],
      ruleIds: ['obstructive-consent'],
    });

    expect(summary.findings).toHaveLength(1);
    expect(summary.findings[0]?.ruleId).toBe('obstructive-consent');
  });

  it('supports plugging in a model-backed analysis engine', async () => {
    const projectDirectory = createFixtureProject();
    const findings: AnalysisFinding[] = [
      {
        ruleId: 'external-model',
        title: 'External model finding',
        severity: 'warning',
        filePath: join(projectDirectory, 'src', 'checkout.tsx'),
        line: 1,
        column: 1,
        message: 'Model flagged a risky purchase flow.',
        excerpt: '<div>',
        recommendation: 'Review the checkout UX.',
        evidence: 'synthetic finding',
      },
    ];
    const reviewFile = vi.fn(async () => findings);

    const summary = await analyzePaths({
      paths: [join(projectDirectory, 'src', 'checkout.tsx')],
      engine: new ModelBackedAnalysisEngine({ reviewFile }),
    });

    expect(summary.findings).toEqual(findings);
    expect(reviewFile).toHaveBeenCalledTimes(1);
  });
});
