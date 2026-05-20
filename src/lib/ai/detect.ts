import { execSync } from "child_process"

export function detectClaudeCode(): boolean {
  try {
    execSync("claude --version", { timeout: 3000, stdio: "pipe" })
    return true
  } catch {
    return false
  }
}
