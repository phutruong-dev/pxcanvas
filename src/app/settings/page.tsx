"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AIProviderSection,
  OutputFolderSection,
  PromptFilesSection,
} from "@/components/settings"

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure AI provider, output folder, and prompt files.
          </p>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to projects
          </Button>
        </Link>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>AI Provider</CardTitle>
            <CardDescription>
              Choose between Claude Code SDK (local CLI) or direct Anthropic API key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIProviderSection />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output Folder</CardTitle>
            <CardDescription>
              Where Step 4 writes the generated <code>.md</code> files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OutputFolderSection />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Files</CardTitle>
            <CardDescription>
              5 prompts under <code>prompts/</code> drive each AI call. Edit them with any editor; the app reads each one fresh.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PromptFilesSection />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
