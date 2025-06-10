"use client"

import type React from "react"

import { useState } from "react"
import { Search, Settings, User, Code2, Save, Download, Terminal, FilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface TopBarProps {
  onMenuAction: (action: string) => void
  onSearch: (query: string) => void
  onExport: () => void
}

export default function TopBar({ onMenuAction, onSearch, onExport }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between p-3 border-b bg-gray-800 border-gray-700"
    >
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-blue-500" />
        <h1 className="text-lg font-semibold text-white">WebIDE X</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onMenuAction("search")
            onSearch("")
          }}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Search (Ctrl+F)"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onExport}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Download Project (Zip)"
        >
          <Download className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
              title="More Actions"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-700 border border-gray-600 text-white">
            <DropdownMenuItem 
              onClick={() => onMenuAction("new-file")}
              className="hover:bg-gray-600 focus:bg-gray-600"
            >
              <FilePlus className="h-4 w-4 mr-2 text-gray-400" />
              New File
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onMenuAction("save")}
              className="hover:bg-gray-600 focus:bg-gray-600"
            >
              <Save className="h-4 w-4 mr-2 text-gray-400" />
              Save
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem 
              onClick={() => onMenuAction("toggle-terminal")}
              className="hover:bg-gray-600 focus:bg-gray-600"
            >
              <Terminal className="h-4 w-4 mr-2 text-gray-400" />
              Toggle Terminal
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onMenuAction("toggle-sidebar")}
              className="hover:bg-gray-600 focus:bg-gray-600"
            >
              <Code2 className="h-4 w-4 mr-2 text-gray-400" />
              Toggle Sidebar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}
