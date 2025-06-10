"use client"

import { FileText, Palette, Code, FolderOpen } from "lucide-react"
import type { FileType } from "../utils/defaultCode"

interface FileTreeProps {
  activeFile: FileType
  onFileSelect: (file: FileType) => void
}

const files = [
  { name: "index.html", type: "html" as FileType, icon: FileText },
  { name: "style.css", type: "css" as FileType, icon: Palette },
  { name: "script.js", type: "js" as FileType, icon: Code },
]

export default function FileTree({ activeFile, onFileSelect }: FileTreeProps) {
  return (
    <div className="h-full bg-gray-900 text-gray-300 p-2">
      <div className="flex items-center gap-2 mb-4 text-sm font-medium">
        <FolderOpen className="w-4 h-4" />
        PROJECT
      </div>

      <div className="space-y-1">
        {files.map((file) => {
          const Icon = file.icon
          const isActive = activeFile === file.type

          return (
            <button
              key={file.type}
              onClick={() => onFileSelect(file.type)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {file.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
