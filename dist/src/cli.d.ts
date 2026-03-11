export type OutputFormat = 'github' | 'json' | 'text';
export interface CliIo {
    stdout(message: string): void;
    stderr(message: string): void;
}
export declare function runCli(argv: readonly string[], io?: CliIo): Promise<number>;
