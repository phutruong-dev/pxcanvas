/**
 * Strip markdown fences and extract JSON from AI response text.
 * AI sometimes wraps output in ```json ... ``` blocks.
 */
export function extractJSON(text: string): unknown {
  const stripped = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
  return JSON.parse(stripped)
}
