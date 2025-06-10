"use client"

import { FileText, Palette, Code, X } from "lucide-react"
import type { FileType, FileTreeNode } from "../utils/defaultCode"
import { motion, AnimatePresence } from "framer-motion";

interface FileTabsProps {
  activeFile: FileTreeNode | null;
  onFileSelect: (file: FileTreeNode) => void;
  openFiles: FileTreeNode[];
  onCloseFile: (file: FileTreeNode) => void;
}

const fileConfig: Record<FileType, { name: string; icon: any; color: string }> = {
  html: { name: "index.html", icon: FileText, color: "text-orange-500" },
  css: { name: "style.css", icon: Palette, color: "text-blue-500" },
  js: { name: "script.js", icon: Code, color: "text-yellow-500" },
}

export default function FileTabs({ activeFile, onFileSelect, openFiles, onCloseFile }: FileTabsProps) {
  return (
    <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto custom-scrollbar">
      <AnimatePresence mode="popLayout" initial={false}>
        {openFiles.map((file) => {
          const config = file.type !== "folder" ? fileConfig[file.type] : null
          const Icon = config?.icon || FileText
          const isActive = activeFile?.path === file.path

        return (
            <motion.div
              key={file.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                duration: 0.15,
                ease: "easeInOut",
                layout: { duration: 0.15 }
              }}
              layout
              className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-gray-700 transition-colors duration-150 ease-in-out cursor-pointer ${
              isActive
                ? "bg-gray-900 text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
              <button 
                onClick={() => onFileSelect(file)} 
                className="flex items-center gap-2 min-w-0"
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${config?.color || "text-gray-400"}`} />
                <span className="truncate">{file.name}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                  onCloseFile(file)
              }}
                className="ml-2 p-1 hover:bg-gray-700 rounded opacity-50 hover:opacity-100 flex-shrink-0"
                aria-label={`Close ${file.name}`}
            >
              <X className="w-3 h-3" />
            </button>
            </motion.div>
        )
      })}
      </AnimatePresence>
    </div>
  )
}
