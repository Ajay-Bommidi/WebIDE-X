"use client"

import { CheckCircle, AlertCircle, Zap, GitBranch } from "lucide-react"

interface StatusBarProps {
  activeFile: string
  lineNumber: number
  columnNumber: number
  language: string
  hasErrors: boolean
  theme: string
  onThemeChange: () => void
}

export default function StatusBar({
  activeFile,
  lineNumber,
  columnNumber,
  language,
  hasErrors,
  theme,
  onThemeChange,
}: StatusBarProps) {
  return (
    <div className="h-6 bg-blue-600 text-white flex items-center justify-between px-2 text-xs">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>

        <div className="flex items-center space-x-1">
          {hasErrors ? (
            <AlertCircle className="w-3 h-3 text-red-300" />
          ) : (
            <CheckCircle className="w-3 h-3 text-green-300" />
          )}
          <span>{hasErrors ? "Errors" : "No Issues"}</span>
        </div>
      </div>

      {/* Center Section - Designed by Credit */}
      <div className="text-center flex-1">
        <span className="text-gray-300">Designed and Developed by </span>
        <span className="font-bold text-primary">Ajay Bommidi</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <span>
          Ln {lineNumber}, Col {columnNumber}
        </span>
        <span>{language.toUpperCase()}</span>
        <button onClick={onThemeChange} className="hover:bg-blue-700 px-2 py-1 rounded">
          {theme === "vs-dark" ? "Dark" : "Light"}
        </button>
        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3" />
          <span>Live</span>
        </div>
      </div>
    </div>
  )
}
