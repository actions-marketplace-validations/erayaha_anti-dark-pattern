"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePaths = analyzePaths;
const engine_1 = require("./engine");
const rules_1 = require("./rules");
const utils_1 = require("./utils");
async function analyzePaths(options) {
    const rules = (0, rules_1.selectRules)(options.ruleIds);
    const files = (0, utils_1.collectScannableFiles)(options.paths.length > 0 ? options.paths : ['.']);
    const engine = options.engine ?? new engine_1.HeuristicAnalysisEngine();
    const findings = (await Promise.all(files.map((file) => engine.analyzeFile(file, rules))))
        .flat()
        .sort((left, right) => {
        return (left.filePath.localeCompare(right.filePath) ||
            left.line - right.line ||
            left.column - right.column ||
            left.ruleId.localeCompare(right.ruleId));
    });
    return {
        fileCount: files.length,
        scannedFiles: files.map((file) => file.path),
        findings,
    };
}
