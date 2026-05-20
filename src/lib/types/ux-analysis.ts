export type UxImprovement = {
  id: string
  problem: string     // the UX issue identified
  reason: string      // why it's a problem
  suggestion: string  // specific improvement proposal
  checked: boolean    // default true — user unchecks to exclude
}

export type SiteType =
  | "villa-hotel"
  | "saas"
  | "landing-page"
  | "ecommerce"
  | "other"

export type FormInput = {
  siteType: SiteType
  goals: string       // website objectives
  targetUser: string  // target audience description
  tones: string[]     // selected tone chips, e.g. ["Warm", "Minimal"]
}
