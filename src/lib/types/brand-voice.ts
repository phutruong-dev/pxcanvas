export type BrandVoice = {
  toneKeywords: [string, string, string]  // exactly 3
  principles: string                       // 3–5 lines, plain text
  doExamples: string[]                    // 3–5 example sentences in correct tone
  dontExamples: string[]                  // 3–5 example sentences in wrong tone
  blacklist: string[]                     // forbidden words, lowercase
}
