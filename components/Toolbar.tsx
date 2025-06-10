"use client"

import { FileType, FileTreeNode } from "../utils/defaultCode"
import { Save, PanelLeft, Share2, Play, Settings2, Terminal, Fullscreen, FullscreenExit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ToolbarProps {
  activeFile: FileTreeNode | null
  onSave: () => void
  onExport: () => void
  onRun: () => void
  onShare: () => void
  onToggleTerminal: () => void
  onToggleSidebar: () => void
  onTogglePreviewFullScreen: () => void
  triggerEditorFormat: boolean
  onEditorFormatDone: () => void
  isSidebarVisible: boolean
  isPreviewFullScreen: boolean
}

export default function Toolbar({
  activeFile,
  onSave,
  onExport,
  onRun,
  onShare,
  onToggleTerminal,
  onToggleSidebar,
  onTogglePreviewFullScreen,
  triggerEditorFormat,
  onEditorFormatDone,
  isSidebarVisible,
  isPreviewFullScreen,
}: ToolbarProps) {
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
          onClick={onToggleSidebar}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Toggle Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRun}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Run Code"
        >
          <Play className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePreviewFullScreen}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Toggle Full Screen Preview"
        >
          {isPreviewFullScreen ? (
            <FullscreenExit className="h-4 w-4" />
          ) : (
            <Fullscreen className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">
          {activeFile ? activeFile.name : "No file open"}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
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
          onClick={onToggleTerminal}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Toggle Terminal"
        >
          <Terminal className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {}}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Settings"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
