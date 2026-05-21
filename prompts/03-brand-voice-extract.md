# Brand Voice Extraction Prompt

You are a brand strategist. Extract the brand voice from the provided input (website content, documents, or description).

## Input

The input below may include any combination of: a pre-fetched website content block, an uploaded document, and a free-text brand description. Use whatever signal is available.

{{brand_input}}

## Task

Analyze the input and extract the brand voice. Return a JSON object with exactly these fields:

- toneKeywords: exactly 3 single-word adjectives that capture the brand's tone (e.g. ["Effortless", "Curated", "Warm"])
- principles: 3–5 writing principles as a single string, separated by newlines (e.g. "Use specific details over labels.\nWrite short, active sentences.\nSpeak directly: 'you' and 'we', not 'guests' and 'the team'.")
- doExamples: array of 3–5 example sentences that match the brand voice
- dontExamples: array of 3–5 example sentences that violate the brand voice
- blacklist: array of words/phrases to avoid, lowercase (e.g. ["luxury", "amazing", "5-star"])

## Output format

Return ONLY valid JSON, no markdown fences, no extra text:

{
  "toneKeywords": ["Word1", "Word2", "Word3"],
  "principles": "Principle one.\nPrinciple two.\nPrinciple three.",
  "doExamples": ["Example sentence one.", "Example sentence two.", "Example sentence three."],
  "dontExamples": ["Bad example one.", "Bad example two.", "Bad example three."],
  "blacklist": ["word1", "word2", "word3"]
}
