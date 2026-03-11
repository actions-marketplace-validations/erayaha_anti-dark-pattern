# Anti-Dark Pattern Linter

Anti-Dark Pattern is a production-oriented CI/CD linter for front-end codebases. It scans UI source files for legally risky dark pattern signals and fails pull requests before deceptive flows ship.

[![CI](https://github.com/erayaha/anti-dark-pattern/actions/workflows/ci.yml/badge.svg)](https://github.com/erayaha/anti-dark-pattern/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/Linting-ESLint-4B32C3?logo=eslint&logoColor=white)
![Yarn](https://img.shields.io/badge/Package%20Manager-Yarn-2C8EBB?logo=yarn&logoColor=white)

## What it does

- Scans HTML, JS, JSX, TS, TSX, Vue, Svelte, Astro, Liquid, and MDX files.
- Detects common dark-pattern signals such as:
  - confirm shaming
  - forced continuity
  - hidden costs
  - artificial urgency or scarcity
  - obstructive consent
- Produces human-readable text, JSON, or GitHub annotation output.
- Exits non-zero when violations are found so it can block CI automatically.
- Uses a deterministic heuristic engine by default, while exposing an engine interface that can be backed by any LLM or model provider.

## Installation

```bash
yarn install
```

## Commands

```bash
yarn lint
yarn typecheck
yarn test
yarn build
```

## CLI usage

Build the CLI and scan a project:

```bash
yarn build
node dist/src/index.js ./src
```

Common options:

```bash
node dist/src/index.js ./src --format text
node dist/src/index.js ./src --format json
node dist/src/index.js ./src --format github
node dist/src/index.js ./src --rules hidden-costs,obstructive-consent
node dist/src/index.js --list-rules
```

Exit codes:

- `0`: no findings
- `1`: one or more dark-pattern findings
- `2`: invalid CLI usage or scan failure

## Rule catalog

| Rule ID | Purpose |
| --- | --- |
| `confirm-shaming` | Detects guilt-based opt-out copy such as “No thanks, I hate saving money.” |
| `forced-continuity` | Detects auto-renew and post-trial charge messaging that needs compliance review. |
| `hidden-costs` | Detects fee disclosures that appear late in the purchase flow. |
| `countdown-urgency` | Detects countdown, scarcity, and urgency prompts. |
| `obstructive-consent` | Detects hidden reject paths and pre-checked marketing/tracking consent. |

## CI/CD integration

This repository includes a GitHub Actions workflow that installs dependencies, validates the codebase, builds the CLI, and runs the scanner during pull requests.

For another repository, a minimal workflow looks like:

```yaml
name: anti-dark-pattern

on:
  pull_request:
  push:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --frozen-lockfile
      - run: yarn build
      - run: node dist/src/index.js src --format github
```

## LLM-ready architecture

The default engine is fully deterministic so tests can run end to end without network access or human review. If you want model-based classification, implement the `PromptDrivenModel` interface from `/src/engine.ts` and pass a `ModelBackedAnalysisEngine` into `analyzePaths()`.

That design keeps CI reproducible while still supporting GitHub Models, Copilot, OpenAI-compatible endpoints, or any other LLM provider in production environments.

## Automated test coverage

The Vitest suite covers:

- every built-in detection rule
- directory scanning and ignore behavior
- CLI help, JSON, GitHub annotation, and success/error paths
- engine pluggability for external model providers

Coverage thresholds are enforced in `/vitest.config.ts` so regressions fail the test run automatically.
