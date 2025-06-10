"use client"

import { CheckCircle, AlertCircle, Zap, GitBranch, Lightbulb, Code, TextSelect } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileTreeNode, FileType } from "../utils/defaultCode"

interface StatusBarProps {
  activeFile: FileTreeNode | null
  lineNumber: number
  columnNumber: number
  language: FileType | string
  hasErrors: boolean
  theme: "vs-dark" | "light"
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
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-7 bg-gray-700 text-gray-300 flex items-center justify-between px-3 text-xs border-t border-gray-600"
    >
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors">
                <GitBranch className="w-3 h-3" />
                <span>main</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-600">
              <p>Current Git Branch</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors"
                initial={false}
                animate={{ color: hasErrors ? "#ef4444" : "#22c55e" }}
              >
                {hasErrors ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                <span>{hasErrors ? "Errors" : "No Issues"}</span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-600">
              <p>Project Issues Status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {activeFile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors truncate max-w-[150px]">
                  <Lightbulb className="w-3 h-3 text-yellow-400" />
                  <span className="font-medium">{activeFile.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white border-gray-600">
                <p>Active File: {activeFile.path}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Center Section - Designed by Credit */}
      <div className="text-center flex-1 hidden sm:block">
        <span className="text-gray-400">Built with ❤️ by </span>
        <span className="font-bold text-blue-400">Ajay Bommidi</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <TextSelect className="w-3 h-3" />
                <span>
                  Ln {lineNumber}, Col {columnNumber}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-600">
              <p>Current Cursor Position</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors">
                <Code className="w-3 h-3" />
                <span>{language.toUpperCase()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-600">
              <p>Current File Language</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onThemeChange} 
                className="flex items-center space-x-1 hover:bg-gray-600 px-2 py-0.5 rounded transition-colors"
              >
                <Lightbulb className={`w-3 h-3 ${theme === 'vs-dark' ? 'text-yellow-400' : 'text-gray-400'}`} />
                <span>{theme === "vs-dark" ? "Dark" : "Light"}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-600">
              <p>Toggle Theme</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors">
                <Zap className="w-3 h-3 text-green-400" />
                <span>Live</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-600">
              <p>Live Preview Status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}
