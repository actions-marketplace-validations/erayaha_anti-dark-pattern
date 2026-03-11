import { runCli } from './cli';

export function buildActionArgs(env: NodeJS.ProcessEnv = process.env): string[] {
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

export function runAction(env: NodeJS.ProcessEnv = process.env): Promise<number> {
  return runCli(buildActionArgs(env));
}

function normalizeInput(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

if (require.main === module) {
  void runAction().then((exitCode) => {
    process.exitCode = exitCode;
  });
}
