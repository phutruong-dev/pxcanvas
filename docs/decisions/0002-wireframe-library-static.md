# ADR 0002 — Wireframe Library is a Static Build-Once Asset

Date: 2026-05-21
Status: Accepted

## Context

V1.0 introduces a wireframe library: hundreds of HTML section templates
(feature-section, hero, footer, etc.) that the project app composes into
full-page wireframes. Two questions had to be settled before any code:

1. Is the library built per project, or once and shared?
2. Where does the library live — repo, npm, CDN?

## Decision

**Build once. Commit to repo.**

- The library is regenerated only when (a) a new section type is being
  added, (b) the slot schema changes (breaking), or (c) a template is
  deliberately unfrozen for redesign.
- The library folder `wireframe-library/` is committed to the same repo
  as the app for v1.x.
- Each variation is frozen after approval (`frozen: true` in `meta.json`)
  and protected from accidental regeneration.

## Consequences

### Positive

- **Zero AI cost during normal user flow.** Track B (project app) never
  calls vision/HTML-generation models. It loads `library.json`, reads HTML,
  fills slots — all deterministic.
- **Predictable user experience.** Same project + same library version =
  same output every time. No layout drift between renders.
- **Reviewable diffs.** Changes to templates appear in `git log` and can be
  PR-reviewed.
- **Offline-capable.** No CDN dependency; cloning the repo is sufficient.

### Negative

- **Repo size grows with library.** 800+ variations × ~5KB each ≈ 4MB +
  preview thumbnails. Acceptable for v1.x. If it becomes painful, migrate
  to an npm package (`@pxcanvas/wireframe-library`) — the static-asset
  contract doesn't change, only the distribution mechanism.
- **Updates require redeploy.** Bumping a template means publishing the
  app. Acceptable because template changes are rare and intentional.

## Alternatives considered

### B. Publish library as npm package

Cleaner separation, versioned independently. Postponed: adds publishing
overhead with no immediate payoff while we have one consumer (this app).
Migration path: extract `wireframe-library/` + `src/lib/wireframes/` later.

### C. Serve from CDN, fetch at runtime

Smaller repo, dynamic updates. Rejected for v1.x: requires online access,
introduces caching complexity, and a runtime failure mode that has no
analog in the build-once model.

### Generate per project at runtime

Originally considered. Rejected because (a) AI Vision is too slow and
expensive to be on the critical path of every project, (b) nondeterminism
in layout undermines the "designer in control" premise of the app.

## Notes on `source.jpg`

Variations reference their source image via a relative path back into
`wireframe-design/<type>/`. We do **not** copy or symlink the JPG into
`wireframe-library/`. Reason: keeps the library lean; the source is
already in the repo and only needed for QA tools.

## Related

- `version-1.md` — v1.0 plan, Track A vs Track B
- `docs/wireframe-library.md` — slot contract + folder layout
- `src/lib/types/wireframe.ts` — `SectionType` enum + library types
- `src/lib/wireframes/slot-schema.ts` — slot definitions per type
