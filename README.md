# Anti-Dark Pattern Linter

Anti-Dark Pattern is a production-oriented CI/CD linter for front-end codebases. It scans UI source files for legally risky dark pattern signals and fails pull requests before deceptive flows ship.

[![CI](https://github.com/erayaha/anti-dark-pattern/actions/workflows/ci.yml/badge.svg)](https://github.com/erayaha/anti-dark-pattern/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/Linting-ESLint-4B32C3?logo=eslint&logoColor=white)
![Yarn](https://img.shields.io/badge/Package%20Manager-Yarn-2C8EBB?logo=yarn&logoColor=white)

## Recommended README badges

For a project like this, badges are most useful when they communicate trust, maintenance status, package availability, and compliance automation readiness. The list below separates badges that can be added immediately from badges that are ideal but require additional setup first.

### Badges that can be included right now

These already work for `/home/runner/work/anti-dark-pattern/anti-dark-pattern` without adding any new infrastructure.

| Badge | Why it fits this project | Source | Example snippet |
| --- | --- | --- | --- |
| CI workflow status | Shows whether the scanner, tests, and build are passing on GitHub Actions. | GitHub Actions badge | `[![CI](https://github.com/erayaha/anti-dark-pattern/actions/workflows/ci.yml/badge.svg)](https://github.com/erayaha/anti-dark-pattern/actions/workflows/ci.yml)` |
| Repository stars | Useful social proof for an open-source developer tool. | shields.io / GitHub | `![GitHub Repo stars](https://img.shields.io/github/stars/erayaha/anti-dark-pattern?style=social)` |
| Repository forks | Shows adoption and contribution interest. | shields.io / GitHub | `![GitHub forks](https://img.shields.io/github/forks/erayaha/anti-dark-pattern?style=social)` |
| Open issues | Indicates current maintenance load. | shields.io / GitHub | `![GitHub issues](https://img.shields.io/github/issues/erayaha/anti-dark-pattern)` |
| Open pull requests | Signals review activity for contributors. | shields.io / GitHub | `![GitHub pull requests](https://img.shields.io/github/issues-pr/erayaha/anti-dark-pattern)` |
| Last commit | Helps readers see how actively the project is maintained. | shields.io / GitHub | `![GitHub last commit](https://img.shields.io/github/last-commit/erayaha/anti-dark-pattern)` |
| Commit activity | Good for showing sustained maintenance over time. | shields.io / GitHub | `![GitHub commit activity](https://img.shields.io/github/commit-activity/m/erayaha/anti-dark-pattern)` |
| Repository size | Helpful but optional operational metadata. | shields.io / GitHub | `![GitHub repo size](https://img.shields.io/github/repo-size/erayaha/anti-dark-pattern)` |
| Top language | Lightweight project metadata badge. | shields.io / GitHub | `![GitHub top language](https://img.shields.io/github/languages/top/erayaha/anti-dark-pattern)` |
| Code size / language count | Helpful metadata for a TypeScript-first codebase. | shields.io / GitHub | `![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/erayaha/anti-dark-pattern)` and `![GitHub language count](https://img.shields.io/github/languages/count/erayaha/anti-dark-pattern)` |
| TypeScript badge | Clearly communicates the implementation language. | shields.io static badge | `![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)` |
| Vitest badge | Communicates the current test stack. | shields.io static badge | `![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)` |
| ESLint badge | Communicates linting discipline. | shields.io static badge | `![ESLint](https://img.shields.io/badge/Linting-ESLint-4B32C3?logo=eslint&logoColor=white)` |
| Yarn badge | Matches the repository tooling instructions. | shields.io static badge | `![Yarn](https://img.shields.io/badge/Package%20Manager-Yarn-2C8EBB?logo=yarn&logoColor=white)` |
| Node runtime badge | Appropriate because CI runs on Node 20. | shields.io static badge | `![Node.js](https://img.shields.io/badge/Node.js-20-5FA04E?logo=node.js&logoColor=white)` |
| CLI / CI-CD purpose badge | Useful as a quick one-line product descriptor. | shields.io static badge | `![CI/CD Linter](https://img.shields.io/badge/Tool-CI%2FCD%20Dark%20Pattern%20Linter-111827)` |
| PRs welcome badge | Good if you want to encourage outside contribution. | shields.io / badgegen | `![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)` |

### Badges that should ideally be there, but require extra setup

These are valuable for a project like this, but they are only accurate after enabling the corresponding system, account, publication flow, or policy file.

| Badge | Why it is valuable here | What extra step is required first |
| --- | --- | --- |
| License badge | Open-source tooling should usually display its license prominently. | Add a real license file such as `LICENSE` and then use `https://img.shields.io/github/license/erayaha/anti-dark-pattern`. |
| npm version badge | Important if the linter is published as a package for CI reuse. | Publish the package to npm, then add Badge Fury or shields.io npm badges such as `https://badge.fury.io/js/anti-dark-pattern.svg` or `https://img.shields.io/npm/v/anti-dark-pattern`. |
| npm downloads badge | Shows real-world adoption of the package. | Publish to npm first, then use `https://img.shields.io/npm/dm/anti-dark-pattern`. |
| Coverage badge | Especially useful for a compliance-sensitive scanner. | Push coverage to Codecov, Coveralls, or another service, then embed their badge. |
| Release badge | Helpful once versioned releases are part of the workflow. | Start publishing GitHub Releases, then use `https://img.shields.io/github/v/release/erayaha/anti-dark-pattern`. |
| Dependabot / dependency health badge | Useful for a security-focused repository. | Enable Dependabot or a dependency service like Snyk, Socket, or Libraries.io. |
| Security scan badge | Strong fit for a compliance and trust-oriented tool. | Enable a service such as Snyk, CodeQL status surfacing, OpenSSF Scorecard, or OSSAR, then use the generated badge URL. |
| OpenSSF Scorecard badge | Great trust signal for security-conscious adopters. | Add the Scorecard workflow and publish the result badge from the OpenSSF project. |
| CodeQL badge | Good to display secure development posture. | Expose CodeQL through a badge-producing workflow or a third-party status badge service. |
| Docs status badge | Helpful once docs are generated or published elsewhere. | Publish docs to GitHub Pages, Read the Docs, Mintlify, Docusaurus, etc. |
| Docker image badge | Useful if the scanner is distributed as a container. | Publish images to Docker Hub or GHCR first. |
| Homebrew / package manager badge | Valuable if the CLI becomes installable outside npm. | Publish a tap/formula or package in the relevant ecosystem. |
| FOSSA / license compliance badge | Strong fit for enterprise adoption. | Enable FOSSA or a similar compliance service. |
| Renovate status badge | Good if automated dependency maintenance is enabled. | Add Renovate and use its dashboard/status badge. |
| CLA / DCO badge | Helpful once contributor policy is enforced. | Add CLA Assistant, DCO checks, or contribution policy enforcement. |

### Suggested badge set for this repository right now

If you want a concise and useful badge row today, this is a strong default:

```md
[![CI](https://github.com/erayaha/anti-dark-pattern/actions/workflows/ci.yml/badge.svg)](https://github.com/erayaha/anti-dark-pattern/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/Linting-ESLint-4B32C3?logo=eslint&logoColor=white)
![Yarn](https://img.shields.io/badge/Package%20Manager-Yarn-2C8EBB?logo=yarn&logoColor=white)
```

### Best next badges to unlock

For this specific project, the highest-value follow-up badges are:

1. **License badge** by adding a `LICENSE` file.
2. **npm version + downloads badges** once `/home/runner/work/anti-dark-pattern/anti-dark-pattern/package.json` is published.
3. **Coverage badge** by wiring coverage uploads to Codecov or Coveralls.
4. **Security posture badge** via OpenSSF Scorecard and/or a published CodeQL status badge.

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
