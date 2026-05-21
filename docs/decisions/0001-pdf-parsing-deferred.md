# 0001 — PDF parsing deferred for Brand Voice input

**Status:** Accepted · **Date:** 2026-05-21 · **Phase:** 8

## Context

US-004 (Brand Voice) lists `.md`, `.txt`, and `.pdf` as accepted upload formats. We need to extract text from uploaded files to send to the AI.

## Decision

MVP supports only `.md` and `.txt`. PDF support is deferred to post-MVP.

## Rationale

- `pdf-parse` (the most common Node lib) has an import-time side effect that reads a hardcoded test fixture, which breaks Next.js bundling unless we deep-import `pdf-parse/lib/pdf-parse.js` and add it to `serverExternalPackages`. Fragile in App Router.
- `pdfjs-dist` works but adds ~500 KB to the client bundle for a low-signal feature; PDFs are often image-only and yield poor brand voice signal anyway.
- Brand voice extraction is highest-quality from prose (web copy, brand guidelines as `.md`). Users can paste PDF text into the free-text textarea instead — same outcome, no parsing risk.

## Consequences

- `BrandVoiceInput` accept list: `.md, .txt, text/plain, text/markdown` only; PDF triggers a toast hint.
- Drop the "max 10 MB" cap rationale's PDF clause; 10 MB still applies to `.md`/`.txt`.
- When we revisit (likely Phase 11+ or feedback-driven), prefer FormData multipart + server-side parse via a maintained fork or `pdf2json`. Keep client lib out of the bundle.
