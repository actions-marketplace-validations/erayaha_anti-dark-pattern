import type { PromptDrivenModel } from './engine';
import type { AnalysisFinding, DarkPatternRule } from './types';
import { findLineAndColumn } from './utils';

const DEFAULT_ENDPOINT = 'https://models.github.ai/inference/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-5-mini';

interface GitHubModelsResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string; type?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

interface ModelFindingPayload {
  ruleId?: unknown;
  message?: unknown;
  evidence?: unknown;
  excerpt?: unknown;
  line?: unknown;
  column?: unknown;
}

export interface GitHubModelsPromptModelOptions {
  token: string;
  model?: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
}

export class GitHubModelsPromptModel implements PromptDrivenModel {
  private readonly endpoint: string;

  private readonly fetchImpl: typeof fetch;

  private readonly model: string;

  constructor(private readonly options: GitHubModelsPromptModelOptions) {
    this.endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.model = options.model ?? DEFAULT_MODEL;
  }

  async reviewFile(input: {
    filePath: string;
    content: string;
    rules: readonly DarkPatternRule[];
  }): Promise<AnalysisFinding[]> {
    const response = await this.fetchImpl(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.options.token}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: [
              'You detect deceptive UX dark patterns in front-end source files.',
              'Return JSON only.',
              'Use only the provided rule IDs.',
              'Return an array of objects shaped like:',
              '[{"ruleId":"rule-id","message":"why it is risky","evidence":"exact supporting text","line":1,"column":1}]',
              'Return [] when no provided rule is present.',
            ].join(' '),
          },
          {
            role: 'user',
            content: JSON.stringify({
              filePath: input.filePath,
              rules: input.rules.map((rule) => ({
                id: rule.id,
                title: rule.title,
                description: rule.description,
                recommendation: rule.recommendation,
              })),
              content: input.content,
            }),
          },
        ],
      }),
    });
    const payload = (await response.json()) as GitHubModelsResponse;

    if (!response.ok) {
      const errorMessage = payload.error?.message;
      throw new Error(
        errorMessage
          ? `GitHub Models request failed with status ${response.status}: ${errorMessage}`
          : `GitHub Models request failed with status ${response.status}.`,
      );
    }

    const modelContent = extractMessageContent(payload);
    if (!modelContent) {
      return [];
    }

    return normalizeModelFindings(modelContent, input);
  }
}

function extractMessageContent(payload: GitHubModelsResponse): string {
  const messageContent = payload.choices?.[0]?.message?.content;
  if (typeof messageContent === 'string') {
    return messageContent.trim();
  }

  if (Array.isArray(messageContent)) {
    return messageContent
      .map((part) => (part.type === 'text' && typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim();
  }

  return '';
}

function normalizeModelFindings(
  rawContent: string,
  input: {
    filePath: string;
    content: string;
    rules: readonly DarkPatternRule[];
  },
): AnalysisFinding[] {
  const findings = parseModelFindings(rawContent);
  const rulesById = new Map(input.rules.map((rule) => [rule.id, rule]));

  return findings.flatMap((finding) => {
    if (typeof finding.ruleId !== 'string') {
      return [];
    }

    const rule = rulesById.get(finding.ruleId);
    if (!rule) {
      return [];
    }

    const evidence = firstNonEmptyString(finding.evidence, finding.excerpt, finding.message) ?? rule.title;
    const excerpt = firstNonEmptyString(finding.excerpt, finding.evidence) ?? evidence;
    const explicitLine = toPositiveInteger(finding.line);
    const explicitColumn = toPositiveInteger(finding.column);
    const indexedPosition =
      typeof evidence === 'string' ? resolvePositionFromEvidence(input.content, evidence) : undefined;
    const line = indexedPosition?.line ?? explicitLine ?? 1;
    const column = indexedPosition?.column ?? explicitColumn ?? 1;

    return [
      {
        ruleId: rule.id,
        title: rule.title,
        severity: rule.severity,
        filePath: input.filePath,
        line,
        column,
        message:
          firstNonEmptyString(finding.message) ??
          `Model flagged content that may match the ${rule.title.toLowerCase()} rule.`,
        excerpt,
        recommendation: rule.recommendation,
        evidence,
      },
    ];
  });
}

function parseModelFindings(rawContent: string): ModelFindingPayload[] {
  const normalizedContent = stripCodeFences(rawContent);

  try {
    const parsed = JSON.parse(normalizedContent) as unknown;
    if (Array.isArray(parsed)) {
      return parsed as ModelFindingPayload[];
    }

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'findings' in parsed &&
      Array.isArray((parsed as { findings?: unknown }).findings)
    ) {
      return (parsed as { findings: ModelFindingPayload[] }).findings;
    }
  } catch (error) {
    throw new Error(
      `GitHub Models returned invalid JSON findings: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  throw new Error('GitHub Models returned an unsupported findings payload.');
}

function stripCodeFences(content: string): string {
  const trimmed = content.trim();
  if (!trimmed.startsWith('```')) {
    return trimmed;
  }

  return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
}

function resolvePositionFromEvidence(
  content: string,
  evidence: string,
): { line: number; column: number } | undefined {
  const matchIndex = content.indexOf(evidence);
  if (matchIndex < 0) {
    return undefined;
  }

  return findLineAndColumn(content, matchIndex);
}

function firstNonEmptyString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function toPositiveInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined;
}
