"use client"

import { Save, Download, Sun, Moon, Share2, Code2, Play, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToolbarProps {
  theme: "vs-dark" | "light"
  onThemeToggle: () => void
  onSave: () => void
  onExport: () => void
  onShare: () => void
  lastSaved?: number
}

export default function Toolbar({
  theme,
  onThemeToggle,
  onSave,
  onExport,
  onShare,
  lastSaved,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button variant="ghost" size="icon" onClick={onThemeToggle} className="hover:bg-accent">
        {theme === "vs-dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={onSave} className="hover:bg-accent">
        <Save className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onExport} className="hover:bg-accent">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onShare} className="hover:bg-accent">
        <Share2 className="h-4 w-4" />
      </Button>
      <div className="flex-1" />
      <Button variant="ghost" size="icon" className="hover:bg-accent">
        <Code2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="hover:bg-accent">
        <Play className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="hover:bg-accent">
        <Settings2 className="h-4 w-4" />
      </Button>
      {lastSaved && (
        <span className="text-xs text-muted-foreground ml-2">
          Last saved: {new Date(lastSaved).toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}
