# AGENTS.md

## Mission

Build and maintain an automated CI/CD dark pattern linter that blocks legally risky front-end UX patterns before merge.

## Architecture

- `/src/index.ts` is the CLI entry point.
- `/src/cli.ts` parses arguments and renders text, JSON, or GitHub annotation output.
- `/src/analyzer.ts` orchestrates directory scanning and rule selection.
- `/src/rules.ts` contains the built-in deterministic compliance rules.
- `/src/engine.ts` defines the pluggable analysis engine contract:
  - `HeuristicAnalysisEngine` is the offline default for reliable CI.
  - `ModelBackedAnalysisEngine` accepts any prompt-driven model adapter so the scanner can use any LLM without changing the rest of the pipeline.

## Automation guarantees

- No human review is required for the scan itself.
- The default engine is deterministic and network-free, which keeps CI reproducible.
- The CLI exits with a failing status when findings are detected, making it safe to gate pull requests automatically.

## Adding a new dark-pattern rule

1. Add a new `DarkPatternRule` to `/src/rules.ts`.
2. Give the rule:
   - a stable `id`
   - a clear title and description
   - a remediation recommendation
   - deterministic detection logic
3. Add focused tests in `/tests/rules.test.ts` or a new nearby test file.
4. Add CLI or analyzer coverage if the new rule changes output shape or filtering behavior.
5. Run:

```bash
yarn lint
yarn typecheck
yarn test
yarn build
```

## Integrating an LLM

Implement this contract from `/src/engine.ts`:

```ts
interface PromptDrivenModel {
  reviewFile(input: {
    filePath: string;
    content: string;
    rules: readonly DarkPatternRule[];
  }): Promise<AnalysisFinding[]>;
}
```

Then wrap it with:

```ts
new ModelBackedAnalysisEngine(model)
```

This preserves the same testable analyzer and CLI surface while allowing enterprise teams to plug in their preferred model provider.

## Testing philosophy

- Prefer deterministic tests that validate exact findings and exit codes.
- Keep scan fixtures small and purpose-built.
- Maintain high coverage thresholds so the tool remains reliable as rules evolve.
