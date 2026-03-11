import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, describe, expect, it } from 'vitest';

import { getRuleById } from '../src/rules';
import {
  collectRegexFindings,
  collectScannableFiles,
  createFinding,
  findLineAndColumn,
} from '../src/utils';

const temporaryDirectories: string[] = [];

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const directory = temporaryDirectories.pop();
    if (directory) {
      rmSync(directory, { force: true, recursive: true });
    }
  }
});

function createFixtureDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), 'anti-dark-pattern-utils-'));
  temporaryDirectories.push(directory);
  mkdirSync(join(directory, 'src'));
  mkdirSync(join(directory, 'dist'));
  writeFileSync(join(directory, 'src', 'component.tsx'), '<div>Only 1 left</div>');
  writeFileSync(join(directory, 'src', 'notes.txt'), 'not a scannable file');
  writeFileSync(join(directory, 'dist', 'bundle.js'), 'ignored build file');
  return directory;
}

describe('utils', () => {
  it('collects supported source files and ignores duplicates and generated folders', () => {
    const directory = createFixtureDirectory();
    const filePath = join(directory, 'src', 'component.tsx');

    const files = collectScannableFiles([directory, filePath, filePath]);

    expect(files).toHaveLength(1);
    expect(files[0]?.path).toBe(filePath);
    expect(files[0]?.content).toContain('Only 1 left');
  });

  it('computes line and column positions correctly', () => {
    expect(findLineAndColumn('first line\nsecond line', 11)).toEqual({ line: 2, column: 1 });
  });

  it('creates findings with default evidence and trims excerpts', () => {
    const rule = getRuleById('confirm-shaming');
    if (!rule) {
      throw new Error('Missing confirm-shaming rule in test setup.');
    }

    const finding = createFinding(
      rule,
      '/tmp/file.html',
      '<button> No thanks, I hate saving money </button>',
      8,
      ' No thanks, I hate saving money ',
      'Detected manipulative copy.',
    );

    expect(finding.excerpt).toBe('No thanks, I hate saving money');
    expect(finding.evidence).toBe(' No thanks, I hate saving money ');
    expect(finding.line).toBe(1);
  });

  it('collects regex findings even when the input regex is not global', () => {
    const rule = getRuleById('hidden-costs');
    if (!rule) {
      throw new Error('Missing hidden-costs rule in test setup.');
    }

    const findings = collectRegexFindings(
      rule,
      '/tmp/checkout.html',
      '<div>service fee and another service fee</div>',
      /service fee/i,
      'Fee disclosure found.',
    );

    expect(findings).toHaveLength(2);
    expect(findings[1]?.column).toBeGreaterThan(findings[0]?.column ?? 0);
  });
});
