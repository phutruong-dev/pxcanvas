import Anthropic from "@anthropic-ai/sdk"

/**
 * Mode B — calls Anthropic API using the user's API key.
 */
export async function callAnthropicApi(
  prompt: string,
  model: string,
  apiKey: string
): Promise<string> {
  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model,
    max_tokens: 8096,
    messages: [{ role: "user", content: prompt }],
  })

  const block = message.content[0]
  if (block.type !== "text") throw new Error("Unexpected response type from Anthropic API")
  return block.text
}

export type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp"

/**
 * Multimodal call: sends image (base64) + text prompt.
 * Used by Track A Vision pipeline (wireframe-generate CLI).
 */
export async function callAnthropicApiWithImage(
  prompt: string,
  imageBase64: string,
  mimeType: ImageMediaType,
  model: string,
  apiKey: string,
): Promise<string> {
  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model,
    max_tokens: 8096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  })

  const block = message.content[0]
  if (block.type !== "text") throw new Error("Unexpected response type from Anthropic API (multimodal)")
  return block.text
}

export async function testAnthropicApi(apiKey: string, model: string): Promise<void> {
  await callAnthropicApi("Reply with only the word: ok", model, apiKey)
}
