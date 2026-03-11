"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectScannableFiles = collectScannableFiles;
exports.findLineAndColumn = findLineAndColumn;
exports.createFinding = createFinding;
exports.collectRegexFindings = collectRegexFindings;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
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
function collectScannableFiles(inputPaths) {
    const visited = new Set();
    const files = [];
    for (const inputPath of inputPaths) {
        const absolutePath = (0, node_path_1.resolve)(inputPath);
        walkPath(absolutePath, visited, files);
    }
    return files.sort((left, right) => left.path.localeCompare(right.path));
}
function walkPath(absolutePath, visited, files) {
    if (visited.has(absolutePath)) {
        return;
    }
    visited.add(absolutePath);
    const stats = (0, node_fs_1.statSync)(absolutePath);
    if (stats.isDirectory()) {
        for (const entry of (0, node_fs_1.readdirSync)(absolutePath, { withFileTypes: true })) {
            if (IGNORED_DIRECTORIES.has(entry.name)) {
                continue;
            }
            walkPath((0, node_path_1.resolve)(absolutePath, entry.name), visited, files);
        }
        return;
    }
    if (!DEFAULT_EXTENSIONS.has((0, node_path_1.extname)(absolutePath).toLowerCase())) {
        return;
    }
    files.push({
        path: absolutePath,
        content: (0, node_fs_1.readFileSync)(absolutePath, 'utf8'),
    });
}
function findLineAndColumn(content, index) {
    const beforeMatch = content.slice(0, index);
    const line = beforeMatch.split('\n').length;
    const column = beforeMatch.length - beforeMatch.lastIndexOf('\n');
    return { line, column };
}
function createFinding(rule, filePath, content, matchIndex, matchText, message, evidence = matchText) {
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
function collectRegexFindings(rule, filePath, content, regex, message) {
    const normalizedRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
    return Array.from(content.matchAll(normalizedRegex), (match) => createFinding(rule, filePath, content, match.index ?? 0, match[0], message, match[0]));
}
