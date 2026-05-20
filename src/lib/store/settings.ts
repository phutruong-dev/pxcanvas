import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DEFAULT_SETTINGS, type AIProvider, type Settings } from "@/lib/types/settings"

type SettingsStore = Settings & {
  setProvider: (provider: AIProvider) => void
  setApiKey: (key: string) => void
  setOutputFolder: (path: string) => void
  setAiModel: (model: string) => void
  setDebugLogging: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setProvider: (provider) => set({ provider }),
      setApiKey: (apiKey) => set({ apiKey }),
      setOutputFolder: (outputFolder) => set({ outputFolder }),
      setAiModel: (aiModel) => set({ aiModel }),
      setDebugLogging: (debugLogging) => set({ debugLogging }),
    }),
    { name: "pxcanvas:settings" }
  )
)
