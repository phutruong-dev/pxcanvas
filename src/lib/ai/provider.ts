import fs from "fs/promises"
import path from "path"
import { loadPrompt, type PromptKey } from "./prompt-loader"
import { callClaudeAgent } from "./claude-agent"
import { callAnthropicApi } from "./anthropic-api"
import type { AIProvider } from "@/lib/types/settings"

type CallOptions = {
  provider: AIProvider
  apiKey: string
  model: string
  debugLogging?: boolean
}

/**
 * Single entry point for all AI calls.
 * Reads prompt file, replaces vars, dispatches to the active provider.
 */
export async function callAI(
  promptKey: PromptKey,
  vars: Record<string, string>,
  options: CallOptions
): Promise<string> {
  const prompt = await loadPrompt(promptKey, vars)

  let result: string

  if (options.provider === "sdk") {
    result = await callClaudeAgent(prompt, options.model)
  } else {
    if (!options.apiKey) throw new Error("API key is required for Mode B")
    result = await callAnthropicApi(prompt, options.model, options.apiKey)
  }

  if (options.debugLogging) {
    await writeAILog(promptKey, prompt, result)
  }

  return result
}

async function writeAILog(key: string, prompt: string, response: string): Promise<void> {
  try {
    const logsDir = path.join(process.cwd(), "logs")
    await fs.mkdir(logsDir, { recursive: true })
    const logPath = path.join(logsDir, "ai-calls.jsonl")
    const entry = JSON.stringify({ timestamp: new Date().toISOString(), key, prompt, response })
    await fs.appendFile(logPath, entry + "\n", "utf-8")
  } catch {
    // logging is best-effort, never block the main flow
  }
}
