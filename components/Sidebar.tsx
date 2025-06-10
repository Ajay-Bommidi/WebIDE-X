"use client"

import { useState } from "react"
import { 
  Files, 
  MessageSquare, 
  Search, 
  GitBranch, 
  Package, 
  Settings2, 
  Code2,
  FolderTree,
  Terminal,
  LayoutGrid,
  X,
  Keyboard
} from "lucide-react"
import FileExplorer from "./FileExplorer"
import AIAssistant from "./AIAssistant"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface SidebarProps {
  isVisible: boolean
  files: any[]
  activeFile: string
  onFileSelect: (file: string) => void
  onFileCreate: (parentPath: string, name: string, type: "file" | "folder") => void
  onFileDelete: (path: string) => void
  onFileRename: (oldPath: string, newPath: string) => void
  onSearch: (query: string) => void
  editorFontSize: number
  setEditorFontSize: (size: number) => void
  editorTabSize: number
  setEditorTabSize: (size: number) => void
  editorWordWrap: "on" | "off"
  setEditorWordWrap: (wrap: "on" | "off") => void
  terminalFontFamily: string
  setTerminalFontFamily: (font: string) => void
  isExplorerOpen: boolean
  setIsExplorerOpen: (isOpen: boolean) => void
}

type SidebarPanel = "files" | "search" | "terminal" | "shortcuts" | "settings"

interface SidebarItem {
  id: SidebarPanel
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export default function Sidebar({
  isVisible,
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onSearch,
  editorFontSize,
  setEditorFontSize,
  editorTabSize,
  setEditorTabSize,
  editorWordWrap,
  setEditorWordWrap,
  terminalFontFamily,
  setTerminalFontFamily,
  isExplorerOpen,
  setIsExplorerOpen,
}: SidebarProps) {
  const [activePanel, setActivePanel] = useState<SidebarPanel>("files")
  const [searchQuery, setSearchQuery] = useState("")

  const sidebarItems: SidebarItem[] = [
    { id: "files", label: "Explorer", icon: FolderTree },
    { id: "search", label: "Search", icon: Search },
    { id: "terminal", label: "Terminal", icon: Terminal },
    { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
    { id: "settings", label: "Settings", icon: Settings2 },
  ]

  const renderPanel = () => {
    switch (activePanel) {
      case "files":
        return (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-border">
              <Input
                type="text"
                value={searchQuery}
                placeholder="Search files..."
                className="h-8"
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch(e.target.value)
                }}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
          <FileExplorer
            files={files}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            onFileCreate={onFileCreate}
            onFileDelete={onFileDelete}
            onFileRename={onFileRename}
          />
            </div>
          </div>
        )
      case "search":
        return (
          <div className="flex flex-col h-full">
            <div className="p-2 border-b border-border">
                <Input
                  value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch(e.target.value)
                }}
                placeholder="Search in active file..."
                className="h-8"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="text-sm text-muted-foreground">
                Type to highlight matches in the editor.
              </div>
            </div>
          </div>
        )
      case "terminal":
        return <AIAssistant />
      case "shortcuts":
        return (
          <div className="p-4 text-gray-400 text-sm">
            <h3 className="text-white font-medium mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Save Project</span>
                <kbd className="bg-gray-700 text-white px-2 py-1 rounded">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Toggle Sidebar</span>
                <kbd className="bg-gray-700 text-white px-2 py-1 rounded">Ctrl + B</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Toggle Terminal</span>
                <kbd className="bg-gray-700 text-white px-2 py-1 rounded">Ctrl + `</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Search in Editor</span>
                <kbd className="bg-gray-700 text-white px-2 py-1 rounded">Ctrl + F</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Command Palette</span>
                <kbd className="bg-gray-700 text-white px-2 py-1 rounded">Ctrl + P</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Format Code</span>
                <kbd className="bg-gray-700 text-white px-2 py-1 rounded">Shift + Alt + F</kbd>
              </div>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="p-4 text-gray-400 text-sm">
            <h3 className="text-white font-medium mb-4">Settings</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-gray-300 mb-2">Editor</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Font Size</span>
                    <select
                      className="bg-gray-700 border border-gray-600 rounded text-sm p-1"
                      value={editorFontSize}
                      onChange={(e) => setEditorFontSize(Number(e.target.value))}
                    >
                      <option value={12}>12px</option>
                      <option value={14}>14px</option>
                      <option value={16}>16px</option>
                      <option value={18}>18px</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tab Size</span>
                    <select
                      className="bg-gray-700 border border-gray-600 rounded text-sm p-1"
                      value={editorTabSize}
                      onChange={(e) => setEditorTabSize(Number(e.target.value))}
                    >
                      <option value={2}>2</option>
                      <option value={4}>4</option>
                      <option value={8}>8</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Word Wrap</span>
                    <input
                      type="checkbox"
                      className="bg-gray-700 border border-gray-600 rounded"
                      checked={editorWordWrap === "on"}
                      onChange={(e) => setEditorWordWrap(e.target.checked ? "on" : "off")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-300 mb-2">Terminal</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Font Family</span>
                    <select
                      className="bg-gray-700 border border-gray-600 rounded text-sm p-1"
                      value={terminalFontFamily}
                      onChange={(e) => setTerminalFontFamily(e.target.value)}
                    >
                      <option>JetBrains Mono</option>
                      <option>Fira Code</option>
                      <option>Consolas</option>
                      <option>Courier New</option>
                      <option>Monospace</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-4 text-gray-400 text-sm">
            <p>{sidebarItems.find((item) => item.id === activePanel)?.label} panel</p>
            <p className="mt-2">This feature is coming soon!</p>
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: isVisible ? 0 : -200 }}
      exit={{ x: -200 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col border-r border-border bg-sidebar-background text-sidebar-foreground"
    >
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <span className="font-semibold">Explorer</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExplorerOpen(false)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 flex">
        <div className="w-12 border-r border-border flex flex-col items-center py-2 gap-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${activePanel === item.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
              onClick={() => setActivePanel(item.id)}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <div className="flex-1">
          {renderPanel()}
        </div>
      </div>
    </motion.div>
  )
}
