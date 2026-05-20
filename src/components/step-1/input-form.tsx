"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FormInput, SiteType } from "@/lib/types/ux-analysis"

const TONE_OPTIONS = ["Warm", "Formal", "Playful", "Minimal", "Bold", "Professional", "Friendly", "Sophisticated"]

const SITE_TYPES: { value: SiteType; label: string }[] = [
  { value: "villa-hotel", label: "Villa / Hotel" },
  { value: "saas", label: "SaaS" },
  { value: "landing-page", label: "Landing Page" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "other", label: "Other" },
]

type Props = {
  initialValues?: { url?: string; formInput?: Partial<FormInput> }
  loading: boolean
  onSubmit: (url: string, formInput: FormInput) => void
  onSkip: () => void
}

export default function InputForm({ initialValues, loading, onSubmit, onSkip }: Props) {
  const [url, setUrl] = useState(initialValues?.url ?? "")
  const [siteType, setSiteType] = useState<SiteType>(initialValues?.formInput?.siteType ?? "other")
  const [goals, setGoals] = useState(initialValues?.formInput?.goals ?? "")
  const [targetUser, setTargetUser] = useState(initialValues?.formInput?.targetUser ?? "")
  const [tones, setTones] = useState<string[]>(initialValues?.formInput?.tones ?? [])
  const [urlError, setUrlError] = useState("")

  const hasInput = url.trim() || goals.trim() || targetUser.trim()

  function validateUrl(value: string) {
    if (!value.trim()) { setUrlError(""); return true }
    try { new URL(value.trim()); setUrlError(""); return true }
    catch { setUrlError("Please enter a valid URL (e.g. https://example.com)"); return false }
  }

  function toggleTone(tone: string) {
    setTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
    )
  }

  function handleSubmit() {
    if (!validateUrl(url)) return
    onSubmit(url.trim(), { siteType, goals, targetUser, tones })
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="ref-url">Reference website URL</Label>
        <Input
          id="ref-url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => { setUrl(e.target.value); if (urlError) validateUrl(e.target.value) }}
          onBlur={() => validateUrl(url)}
        />
        {urlError && <p className="text-xs text-destructive">{urlError}</p>}
        <p className="text-xs text-muted-foreground">
          Optional. AI will read the site to extract navigation structure.
        </p>
      </div>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t" />
        <span className="text-xs text-muted-foreground">and / or</span>
        <div className="flex-1 border-t" />
      </div>

      {/* Form description */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-type">Site type</Label>
          <Select value={siteType} onValueChange={(v) => setSiteType(v as SiteType)}>
            <SelectTrigger id="site-type" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SITE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Website goals</Label>
          <Textarea
            id="goals"
            placeholder="What should visitors do on this site? (e.g. book a villa, sign up for a trial...)"
            rows={3}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-user">Target audience</Label>
          <Textarea
            id="target-user"
            placeholder="Who is the main visitor? (e.g. couples looking for a private villa in Croatia...)"
            rows={3}
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Tone / Style</Label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((tone) => (
              <button key={tone} type="button" onClick={() => toggleTone(tone)}>
                <Badge
                  variant={tones.includes(tone) ? "default" : "outline"}
                  className={cn("cursor-pointer select-none transition-colors", !tones.includes(tone) && "hover:bg-muted")}
                >
                  {tone}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      {!hasInput && (
        <p className="text-xs text-destructive">
          At least one input is required — enter a URL or fill in the description.
        </p>
      )}

      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={!hasInput || !!urlError || loading}>
          {loading ? "Analyzing…" : "Analyze"}
        </Button>
        <Button variant="outline" onClick={onSkip} disabled={loading}>
          Skip analysis
        </Button>
      </div>
    </div>
  )
}
