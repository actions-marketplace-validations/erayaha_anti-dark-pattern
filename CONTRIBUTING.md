# Contributing

Thanks for helping improve Anti-Dark Pattern.

## Reporting issues

If you hit a false positive, false negative, or usability problem, please open an issue with:

- the rule ID involved, if known
- a small code sample that reproduces the behavior
- the expected result
- the actual result

## Development setup

```bash
yarn install --frozen-lockfile
yarn lint
yarn typecheck
yarn test
yarn build
```

## Adding or updating a rule

1. Update `src/rules.ts`.
2. Add focused tests in `tests/rules.test.ts` or a nearby test file.
3. Run the validation commands above.
4. Open a pull request with a clear explanation of the rule intent and tradeoffs.

## Design principles

- Keep the default scanner deterministic and network-free.
- Prefer focused fixtures and exact assertions in tests.
- Avoid broad pattern matching that would create noisy findings in CI.
