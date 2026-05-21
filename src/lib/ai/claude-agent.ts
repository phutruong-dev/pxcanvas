import { spawn } from "child_process"

// Default: 2 minutes. Override via env: CLAUDE_AGENT_TIMEOUT_MS=180000
const DEFAULT_TIMEOUT_MS = 120_000

function getTimeout(): number {
  const raw = process.env.CLAUDE_AGENT_TIMEOUT_MS
  const n = raw ? Number(raw) : NaN
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_TIMEOUT_MS
}

/**
 * Mode A — calls the local `claude` CLI subprocess using Claude Code auth.
 * Pipes prompt via stdin, reads response from stdout.
 */
export async function callClaudeAgent(
  prompt: string,
  model: string,
  timeoutMs?: number,
): Promise<string> {
  const limit = timeoutMs ?? getTimeout()
  return new Promise((resolve, reject) => {
    const proc = spawn("claude", ["--print", "--model", model], {
      stdio: ["pipe", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""

    proc.stdout.on("data", (d: Buffer) => (stdout += d.toString()))
    proc.stderr.on("data", (d: Buffer) => (stderr += d.toString()))

    const timer = setTimeout(() => {
      proc.kill("SIGTERM")
      const seconds = Math.round(limit / 1000)
      reject(
        new Error(
          `Claude Code SDK timed out after ${seconds}s. ` +
            `If this keeps happening, try: (1) Settings → switch to Anthropic API key mode, ` +
            `(2) skip the reference URL on Step 1, or (3) set CLAUDE_AGENT_TIMEOUT_MS in .env.local.`,
        ),
      )
    }, limit)

    proc.on("close", (code) => {
      clearTimeout(timer)
      if (code === 0) {
        resolve(stdout.trim())
      } else {
        reject(new Error(stderr.trim() || `claude CLI exited with code ${code}`))
      }
    })

    proc.on("error", (err) => {
      clearTimeout(timer)
      reject(err)
    })

    proc.stdin.write(prompt)
    proc.stdin.end()
  })
}

export async function testClaudeAgent(): Promise<void> {
  // Test call uses a short prompt + Haiku, so cap timeout at 30s
  await callClaudeAgent("Reply with only the word: ok", "claude-haiku-4-5-20251001", 30_000)
}
