"use client"

import { FileText, Palette, Code, X } from "lucide-react"
import type { FileType } from "../utils/defaultCode"

interface FileTabsProps {
  activeFile: FileType
  onFileSelect: (file: FileType) => void
  openFiles: FileType[]
  onCloseFile: (file: FileType) => void
}

const fileConfig = {
  html: { name: "index.html", icon: FileText, color: "text-orange-500" },
  css: { name: "style.css", icon: Palette, color: "text-blue-500" },
  js: { name: "script.js", icon: Code, color: "text-yellow-500" },
}

export default function FileTabs({ activeFile, onFileSelect, openFiles, onCloseFile }: FileTabsProps) {
  return (
    <div className="flex bg-gray-800 border-b border-gray-700">
      {openFiles.map((fileType) => {
        const config = fileConfig[fileType]
        const Icon = config.icon
        const isActive = activeFile === fileType

        return (
          <div
            key={fileType}
            className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-gray-700 transition-colors ${
              isActive
                ? "bg-gray-900 text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <button onClick={() => onFileSelect(fileType)} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${config.color}`} />
              {config.name}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCloseFile(fileType)
              }}
              className="ml-2 p-1 hover:bg-gray-700 rounded opacity-50 hover:opacity-100"
              aria-label={`Close ${config.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
