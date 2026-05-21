// Slot schemas per SectionType.
//
// This is the contract between Library (template, static) and Project App (content, dynamic).
// Changing a slot key here = breaking change → bump library MAJOR version.
//
// Each section type declares the slots that ALL variations of that type must support.
// AI Vision (Track A) reads these to know what data-slot keys to emit.
// Content generation (Track B / Phase 16b) reads these to constrain markdown output.

import type { SectionType, WireframeSlot } from "@/lib/types/wireframe"

// Common slot keys reused across many section types.
// Variations may include a subset; required vs optional is per-type below.
const COMMON_SLOTS = {
  eyebrow: {
    key: "eyebrow",
    type: "text",
    required: false,
    description: "Short ALL-CAPS tagline above headline (2-5 words)",
    maxChars: 40,
  } satisfies WireframeSlot,
  headline: {
    key: "headline",
    type: "text",
    required: true,
    description: "Main heading (5-12 words)",
    maxChars: 90,
  } satisfies WireframeSlot,
  description: {
    key: "description",
    type: "text",
    required: false,
    description: "Body paragraph below headline (1-2 sentences, 20-40 words)",
    maxChars: 240,
  } satisfies WireframeSlot,
  ctaPrimary: {
    key: "cta-primary",
    type: "button",
    required: false,
    description: "Primary call-to-action button label (≤4 words)",
    maxChars: 30,
  } satisfies WireframeSlot,
  ctaSecondary: {
    key: "cta-secondary",
    type: "button",
    required: false,
    description: "Secondary call-to-action button label (≤4 words)",
    maxChars: 30,
  } satisfies WireframeSlot,
}

// Per-type slot schemas.
// For v1.0 only feature-section is fully defined. Others are stubs to satisfy the enum.
export const SLOT_SCHEMAS: Record<SectionType, WireframeSlot[]> = {
  "feature-section": [
    COMMON_SLOTS.eyebrow,
    COMMON_SLOTS.headline,
    COMMON_SLOTS.description,
    COMMON_SLOTS.ctaPrimary,
    COMMON_SLOTS.ctaSecondary,
    // Repeat group "feature" — variations may have 2/3/4/6 items.
    // Slot schema declares the MAX. Specific variations declare which N apply via meta.json slots[].
    ...flattenFeatureGroup(6),
    { key: "image-1", type: "image", required: false, description: "Hero/feature image (16:9 placeholder)" },
    { key: "image-2", type: "image", required: false, description: "Second feature image (optional)" },
  ],

  hero: [
    COMMON_SLOTS.eyebrow,
    COMMON_SLOTS.headline,
    COMMON_SLOTS.description,
    COMMON_SLOTS.ctaPrimary,
    COMMON_SLOTS.ctaSecondary,
    { key: "image-1", type: "image", required: false, description: "Hero image" },
  ],

  cta: [
    COMMON_SLOTS.eyebrow,
    COMMON_SLOTS.headline,
    COMMON_SLOTS.description,
    COMMON_SLOTS.ctaPrimary,
    COMMON_SLOTS.ctaSecondary,
  ],

  // Stubs — fleshed out when each type's library is built (Phase 15)
  header: [],
  footer: [],
  faq: [
    COMMON_SLOTS.eyebrow,
    COMMON_SLOTS.headline,
    COMMON_SLOTS.description,
    ...flattenFaqGroup(8),
  ],
  testimonials: [],
  blog: [],
  pricing: [],
  "logo-cloud": [],
  stats: [],
  team: [],
  contact: [],
  gallery: [],
}

function flattenFeatureGroup(maxItems: number): WireframeSlot[] {
  const out: WireframeSlot[] = []
  for (let i = 1; i <= maxItems; i++) {
    out.push(
      {
        key: `feature-${i}-icon`,
        type: "icon",
        required: false,
        description: `Icon for feature item ${i}`,
        repeatGroup: "feature",
        repeatIndex: i,
      },
      {
        key: `feature-${i}-title`,
        type: "text",
        required: false,
        description: `Feature ${i} title (≤6 words)`,
        maxChars: 60,
        repeatGroup: "feature",
        repeatIndex: i,
      },
      {
        key: `feature-${i}-body`,
        type: "text",
        required: false,
        description: `Feature ${i} body (≤20 words)`,
        maxChars: 140,
        repeatGroup: "feature",
        repeatIndex: i,
      },
    )
  }
  return out
}

function flattenFaqGroup(maxItems: number): WireframeSlot[] {
  const out: WireframeSlot[] = []
  for (let i = 1; i <= maxItems; i++) {
    out.push(
      {
        key: `faq-${i}-question`,
        type: "text",
        required: false,
        description: `FAQ ${i} question`,
        maxChars: 160,
        repeatGroup: "faq",
        repeatIndex: i,
      },
      {
        key: `faq-${i}-answer`,
        type: "text",
        required: false,
        description: `FAQ ${i} answer`,
        maxChars: 400,
        repeatGroup: "faq",
        repeatIndex: i,
      },
    )
  }
  return out
}

// Public lookup helpers
export function getSlotSchema(type: SectionType): WireframeSlot[] {
  return SLOT_SCHEMAS[type] ?? []
}

export function getRequiredSlots(type: SectionType): WireframeSlot[] {
  return getSlotSchema(type).filter((s) => s.required)
}

export function isKnownSlot(type: SectionType, key: string): boolean {
  return getSlotSchema(type).some((s) => s.key === key)
}
