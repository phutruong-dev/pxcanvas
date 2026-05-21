/** Extract a single ## section block from markdown. Returns "" if not found. */
export function extractSectionFromMd(markdown: string, sectionName: string): string {
  const target = sectionName.trim().toLowerCase()
  const lines = markdown.split("\n")
  let start = -1
  let end = lines.length

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      const heading = lines[i].slice(3).trim().toLowerCase()
      if (start === -1 && (heading === target || heading.includes(target) || target.includes(heading))) {
        start = i
      } else if (start !== -1) {
        end = i
        break
      }
    }
  }

  if (start === -1) return ""
  return lines.slice(start, end).join("\n").trim()
}

/** Replace (or append) a ## section block inside fullMarkdown with newContent. */
export function patchSectionInMd(fullMarkdown: string, sectionName: string, newContent: string): string {
  if (!fullMarkdown.trim()) return newContent
  const target = sectionName.trim().toLowerCase()
  const lines = fullMarkdown.split("\n")
  let start = -1
  let end = lines.length

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      const heading = lines[i].slice(3).trim().toLowerCase()
      if (start === -1 && heading === target) {
        start = i
      } else if (start !== -1) {
        end = i
        break
      }
    }
  }

  if (start === -1) {
    return fullMarkdown.trimEnd() + "\n\n" + newContent
  }
  return [...lines.slice(0, start), newContent, ...lines.slice(end)].join("\n")
}

/** True if a ## section by that name exists in markdown. */
export function sectionExistsInMd(markdown: string, sectionName: string): boolean {
  return extractSectionFromMd(markdown, sectionName) !== ""
}
