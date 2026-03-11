import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';

import type { AnalysisFinding, DarkPatternRule, ScannableFile } from './types';

const DEFAULT_EXTENSIONS = new Set([
  '.astro',
  '.html',
  '.htm',
  '.js',
  '.jsx',
  '.liquid',
  '.mdx',
  '.svelte',
  '.ts',
  '.tsx',
  '.vue',
]);

const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.next',
  'coverage',
  'dist',
  'node_modules',
]);

export function collectScannableFiles(inputPaths: readonly string[]): ScannableFile[] {
  const visited = new Set<string>();
  const files: ScannableFile[] = [];

  for (const inputPath of inputPaths) {
    const absolutePath = resolve(inputPath);
    walkPath(absolutePath, visited, files);
  }

  return files.sort((left, right) => left.path.localeCompare(right.path));
}

function walkPath(
  absolutePath: string,
  visited: Set<string>,
  files: ScannableFile[],
): void {
  if (visited.has(absolutePath)) {
    return;
  }

  visited.add(absolutePath);
  const stats = statSync(absolutePath);

  if (stats.isDirectory()) {
    for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      walkPath(resolve(absolutePath, entry.name), visited, files);
    }

    return;
  }

  if (!DEFAULT_EXTENSIONS.has(extname(absolutePath).toLowerCase())) {
    return;
  }

  files.push({
    path: absolutePath,
    content: readFileSync(absolutePath, 'utf8'),
  });
}

export function findLineAndColumn(
  content: string,
  index: number,
): { line: number; column: number } {
  const beforeMatch = content.slice(0, index);
  const line = beforeMatch.split('\n').length;
  const column = beforeMatch.length - beforeMatch.lastIndexOf('\n');
  return { line, column };
}

export function createFinding(
  rule: DarkPatternRule,
  filePath: string,
  content: string,
  matchIndex: number,
  matchText: string,
  message: string,
  evidence = matchText,
): AnalysisFinding {
  const { line, column } = findLineAndColumn(content, matchIndex);
  return {
    ruleId: rule.id,
    title: rule.title,
    severity: rule.severity,
    filePath,
    line,
    column,
    message,
    excerpt: matchText.trim(),
    recommendation: rule.recommendation,
    evidence,
  };
}

export function collectRegexFindings(
  rule: DarkPatternRule,
  filePath: string,
  content: string,
  regex: RegExp,
  message: string,
): AnalysisFinding[] {
  const normalizedRegex = new RegExp(
    regex.source,
    regex.flags.includes('g') ? regex.flags : `${regex.flags}g`,
  );

  return Array.from(content.matchAll(normalizedRegex), (match) =>
    createFinding(
      rule,
      filePath,
      content,
      match.index ?? 0,
      match[0],
      message,
      match[0],
    ),
  );
}
