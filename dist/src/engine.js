"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelBackedAnalysisEngine = exports.HeuristicAnalysisEngine = void 0;
class HeuristicAnalysisEngine {
    async analyzeFile(file, rules) {
        return rules.flatMap((rule) => rule.detect(file.content, file.path));
    }
}
exports.HeuristicAnalysisEngine = HeuristicAnalysisEngine;
class ModelBackedAnalysisEngine {
    constructor(model) {
        this.model = model;
    }
    analyzeFile(file, rules) {
        return this.model.reviewFile({
            filePath: file.path,
            content: file.content,
            rules,
        });
    }
}
exports.ModelBackedAnalysisEngine = ModelBackedAnalysisEngine;
