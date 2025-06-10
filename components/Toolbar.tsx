"use client"

import { Save, PanelLeft, Code2, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ToolbarProps {
  onSave: () => void
  onTogglePanel: () => void
  onFormat: () => void
  onThemeToggle: () => void
  theme: "vs-dark" | "light"
  onRun: () => void
  // This comment is added to trigger a linter re-evaluation
}

export default function Toolbar({ onSave, onTogglePanel, onFormat, onThemeToggle, theme, onRun }: ToolbarProps) {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700"
    >
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePanel}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Toggle Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onFormat}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Format Code"
        >
          <Code2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title={`Switch to ${theme === 'vs-dark' ? 'Light' : 'Dark'} Theme`}
        >
          {theme === 'vs-dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSave}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Save (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRun}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Run Code"
        >
          <Code2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
