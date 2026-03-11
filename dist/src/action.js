"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildActionArgs = buildActionArgs;
exports.runAction = runAction;
const cli_1 = require("./cli");
function buildActionArgs(env = process.env) {
    const path = normalizeInput(env.INPUT_PATH) ?? '.';
    const format = normalizeInput(env.INPUT_FORMAT) ?? 'github';
    const rules = normalizeInput(env.INPUT_RULES);
    const model = normalizeInput(env.INPUT_MODEL);
    const githubModel = normalizeInput(env.INPUT_GITHUB_MODEL);
    const args = [path, '--format', format];
    if (rules) {
        args.push('--rules', rules);
    }
    if (model) {
        args.push('--model', model);
    }
    if (githubModel) {
        args.push('--github-model', githubModel);
    }
    return args;
}
function runAction(env = process.env) {
    return (0, cli_1.runCli)(buildActionArgs(env));
}
function normalizeInput(value) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}
if (require.main === module) {
    void runAction().then((exitCode) => {
        process.exitCode = exitCode;
    });
}
