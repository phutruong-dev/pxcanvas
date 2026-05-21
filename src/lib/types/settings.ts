export type AIProvider = "sdk" | "api-key"

export type Settings = {
  provider: AIProvider
  apiKey: string        // plain text — local-only, acceptable per PRD §⑥
  outputFolder: string  // absolute path to generated .md output folder
  aiModel: string       // default: "claude-sonnet-4-6"
  debugLogging: boolean // write AI calls to logs/ai-calls.jsonl when true
  dismissedFirstRun: boolean  // user closed first-run wizard
}

export const DEFAULT_SETTINGS: Settings = {
  provider: "sdk",
  apiKey: "",
  outputFolder: "",
  aiModel: "claude-sonnet-4-6",
  debugLogging: false,
  dismissedFirstRun: false,
}
