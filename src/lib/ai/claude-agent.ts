import { spawn } from "child_process"

const TIMEOUT_MS = 30_000

/**
 * Mode A — calls the local `claude` CLI subprocess using Claude Code auth.
 * Pipes prompt via stdin, reads response from stdout.
 */
export async function callClaudeAgent(prompt: string, model: string): Promise<string> {
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
      reject(new Error("Claude Code SDK timeout (30s)"))
    }, TIMEOUT_MS)

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
  await callClaudeAgent("Reply with only the word: ok", "claude-haiku-4-5-20251001")
}
