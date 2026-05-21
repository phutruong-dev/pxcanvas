export type Project = {
  id: string
  name: string
  createdAt: string    // ISO 8601
  updatedAt: string    // ISO 8601
  currentStep: 1 | 2 | 3 | 4
  maxReachedStep: 1 | 2 | 3 | 4  // highest step ever visited, never decreases
}

export type ProjectZipMeta = {
  version: string      // app version at export time, e.g. "0.9.0"
  name: string
  exportedAt: string   // ISO 8601
  pageCount: number
}
