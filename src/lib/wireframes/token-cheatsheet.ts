// pxpace.css token cheatsheet — compact reference for AI Vision (Track A, Phase 12).
//
// This string is injected into prompt `06-wireframe-from-image.md`.
// Goal: AI emits only valid pxpace.css classes, no hallucination.
// Updating pxpace.css → update this file in lockstep.

export const PXPACE_TOKEN_CHEATSHEET = `
PXPACE.CSS UTILITY CLASSES — USE ONLY THESE.

COLORS (background / text / border):
  bg-{primary,secondary,tertiary,base,light,dark,success,error}{,-5,-10,-20,-30,-40,-50,-60,-70,-80,-90}
  bg-{primary,secondary,tertiary,base}-l-{1,2,3,4}        // lighter tints
  bg-primary-d-{1,2,3,4}                                  // darker shades (primary only)
  bg-{body,surface,surface-2,special}                     // semantic backgrounds
  text-{primary,secondary,tertiary,light,dark,success,error}{,-5..-90,-l-{1..4},-d-{1..4}}
  text-{title,body}                                       // semantic text colors
  border-{primary,secondary,tertiary,base,light,dark,success,error}{,-5..-90,-l-{1..4}}
  border-border                                           // default border color

SPACING (use these tokens, not raw px):
  Sizes: 4xs, 3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl   // fluid clamp()
  padding-{size}                                          // all sides
  padding-{left,right,top,bottom}-{size}
  padding-{horizontal,vertical}-{size}
  margin-{size}, margin-{left,right,top,bottom}-{size}, margin-{horizontal,vertical}-{size}
  gap-{size}                                              // grid/flex gap

TYPOGRAPHY:
  text-{xs,s,m,l,xl,2xl,3xl,4xl}                          // fluid font sizes
  font-{100..900}                                         // weight
  italic, bold, underline, uppercase, lowercase
  line-height-{xs,s,m,l,xl}                               // 1, 1.2, 1.3, 1.4, 1.5
  text-{left,center,right}

RADIUS:
  radius-{xs,s,m,l,xl,full}                               // full = 999rem (pill)

LAYOUT — Grid:
  columns-{2,3,4,5,6,7,8}                                 // equal cols
  columns-min-{5,10,20,30,40,50,60,70}                    // auto-fit min Nrem
  col-span-{2..8}, col-start-{1..8}
  row-span-{2..8}, row-start-{1..8}
  row, column                                             // grid-auto-flow row/column

LAYOUT — Flex:
  flex-row, flex-column, flex-wrap, flex-nowrap, flex-{1,2,3}

ALIGNMENT:
  items-{left,center,right}      // justify-items (grid)
  content-{left,center,right}    // justify-content
  items-{top,middle,bottom,stretch}   // align-items
  content-{top,middle,bottom,stretch}
  space-between, space-around
  self-{left,center,right,top,middle,bottom,stretch}

RESPONSIVE (max-width breakpoints): xl=1400px, l=991px, m=767px, s=478px
  column--on-{xl,l,m,s}                                   // collapse to single column
  columns-{2..6}--on-{xl,l,m,s}
  col-span-{1..6}--on-{xl,l,m,s}
  col-start-{1..6}--on-{xl,l,m,s}

SIZE:
  width-{10,20,...,90}, max-width-{10,20,...,140}, max-site-width  // 140rem
  full-width, full-height, screen-width, screen-height, auto-width, auto-height
  aspect-{1,4-3,3-4,3-2,2-3,16-9,9-16}
  fit-{contain,cover,fill}

BORDER:
  border, border-{left,right,top,bottom}                  // 1px solid

SHADOW:
  shadow-{xs,s,m,l,xl}

OTHER:
  opacity-{0,10,20,...,100}
  hidden, display-none, visible
  overflow-{hidden,auto}, overflow-{x,y}-{hidden,auto}
  relative, absolute, sticky, fixed
  inset-0, top-0, right-0, bottom-0, left-0
  z-{-1,0,1,10,100,1000,10000}
  pointer, not-allowed, cursor-auto, no-pointer-events
  transition-global
  white-space-nowrap, list-none

WIREFRAME PLACEHOLDER CONVENTION (grayscale, no brand color for v1.x):
  - Image placeholder:
      <div class="bg-base-10 radius-m aspect-16-9 full-width" data-slot="image-1"></div>
  - Icon placeholder (square):
      <div class="bg-base-10 radius-full" style="width:4rem;height:4rem" data-slot="feature-1-icon"></div>
  - Primary button (filled dark):
      <button class="bg-secondary text-tertiary padding-vertical-2xs padding-horizontal-s radius-s font-500" data-slot="cta-primary">Contact now</button>
  - Secondary button (outlined):
      <button class="border border-border padding-vertical-2xs padding-horizontal-s radius-s font-500 text-title" data-slot="cta-secondary">See more</button>
  - Section root wrapper:
      <section class="padding-vertical-2xl padding-horizontal-l max-site-width margin-horizontal-l"> ... </section>
  - Container card (light gray bg):
      <div class="bg-surface radius-l padding-xl"> ... </div>
  - Eyebrow:
      <span class="text-s text-title font-500" data-slot="eyebrow">TAGLINE</span>
  - Headline H2:
      <h2 class="text-3xl font-700 text-title line-height-s" data-slot="headline">Section headings</h2>
  - Description paragraph:
      <p class="text-m text-body line-height-l" data-slot="description">Body text here...</p>

OUTPUT RULES:
  1. Return ONLY the <section>...</section> fragment. No <html>, <head>, <body>.
  2. Every node carrying user-facing content MUST have data-slot="<key>". Keys come from the slot_schema given.
  3. Required slots from slot_schema MUST appear in the HTML.
  4. Do NOT use inline color/spacing values — use the utility classes above.
  5. Do NOT invent classes. If you need a layout pxpace.css doesn't provide, use minimal inline style (e.g., width:4rem) ONLY for icon sizing.
  6. Wrap repeated items (features, FAQ) in a parent with the same class pattern. Each item must include its data-slot index keys (feature-1-title, feature-1-body, ...).
`.trim()
