export type SupportedLanguage = "cpp" | "java" | "python" | "javascript";

export interface CodeExecutionResult {
  stdout: string;
  stderr?: string;
  executionTimeMs?: number;
  memoryMb?: number;
}
