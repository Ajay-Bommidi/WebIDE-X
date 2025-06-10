"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Plus, Edit2, Trash2, FileJson, MoreVertical, FileCode } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { FileTreeNode, FileType } from "../utils/defaultCode"

interface FileExplorerProps {
  files: FileTreeNode[]
  activeFile: FileTreeNode | null
  onFileSelect: (path: string) => void
  onFileCreate: (parentPath: string, name: string, type: "file" | "folder") => void
  onFileDelete: (path: string) => void
  onFileRename: (oldPath: string, newPath: string) => void
}

interface FileItemProps {
  file: FileTreeNode
  level?: number
  onSelect: (path: string) => void
  onDelete: (path: string) => void
  onRename: (oldPath: string, newPath: string) => void
  onCreate: (parentPath: string, name: string, type: "file" | "folder") => void
  activeFile: FileTreeNode | null
}

const fileIconMap: Record<FileType, React.ElementType> = {
  html: FileCode,
  css: FileCode,
  js: FileCode,
}

const FileIcon = ({ file, className }: { file: FileTreeNode; className?: string }) => {
  if (file.type === "folder") {
    return file.isOpen ? <FolderOpen className={className} /> : <Folder className={className} />
  }
  const Icon = fileIconMap[file.type] || FileText
  return <Icon className={className} />
}

const FileItem = ({
  file,
  level = 0,
  onSelect,
  onDelete,
  onRename,
  onCreate,
  activeFile,
}: FileItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleRename = () => {
    if (newName && newName !== file.name) {
      onRename(file.path, newName)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setNewName(file.name)
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const isActive = activeFile?.path === file.path

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      layout
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={`group flex items-center px-2 py-1 cursor-pointer transition-colors duration-150 ease-in-out ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300 hover:text-white"
            }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => {
              if (file.type !== "folder") {
                onSelect(file.path)
              } else {
                // Toggle folder open/closed
                onSelect(file.path)
              }
            }}
          >
            {file.type === "folder" && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(file.path)
                }}
                className="p-1 -ml-1 mr-1 rounded-sm hover:bg-gray-600 transition-colors"
              >
                {file.isOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>
            )}
            <div className="flex items-center flex-1 min-w-0">
              <FileIcon file={file} className="h-4 w-4 mr-2 flex-shrink-0" />
              {isEditing ? (
                <Input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-gray-900 border border-gray-600 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                />
              ) : (
                <span className="truncate text-sm font-medium">{file.name}</span>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-auto">
              {file.type === "folder" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreate(file.path, "", "file")
                  }}
                  title="New File"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-800 border border-gray-700 text-white">
                  <ContextMenuItem 
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Rename
                  </ContextMenuItem>
                  {file.type === "folder" && (
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onCreate(file.path, "", "folder")
                      }}
                      className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      New Folder
                    </ContextMenuItem>
                  )}
                  <ContextMenuItem 
                    className="text-red-400 focus:text-red-400 hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(file.path)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </ContextMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 bg-gray-800 border border-gray-700 text-white">
          <ContextMenuItem 
            onClick={(e) => {
              e.stopPropagation()
              if (file.type !== "folder") {
                onSelect(file.path)
              } else {
                onSelect(file.path) // Toggle folder on right click as well
              }
            }}
            className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          >
            {file.type !== "folder" ? (
              <FileText className="h-4 w-4 mr-2" />
            ) : file.isOpen ? (
              <FolderOpen className="h-4 w-4 mr-2" />
            ) : (
              <Folder className="h-4 w-4 mr-2" />
            )}
            {file.type !== "folder" ? "Open" : file.isOpen ? "Close Folder" : "Open Folder"}
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
          {file.type === "folder" && (
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onCreate(file.path, "", "file")
              }}
              className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            >
              <FileCode className="h-4 w-4 mr-2" />
              New File
            </ContextMenuItem>
          )}
          {file.type === "folder" && (
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onCreate(file.path, "", "folder")
              }}
              className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              New Folder
            </ContextMenuItem>
          )}
          <ContextMenuSeparator className="bg-gray-700" />
          <ContextMenuItem 
            className="text-red-400 focus:text-red-400 hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(file.path)
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AnimatePresence>
        {file.type === "folder" && file.isOpen && file.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {file.children.map((child) => (
              <FileItem
                key={child.path}
                file={child}
                level={level + 1}
                onSelect={onSelect}
                onDelete={onDelete}
                onRename={onRename}
                onCreate={onCreate}
                activeFile={activeFile}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
}: FileExplorerProps) {
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newItemParentPath, setNewItemParentPath] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCreateNewFile = () => {
    if (newItemName) {
      onFileCreate(newItemParentPath || "src", newItemName, "file") // Default to 'src' if no parent path
      setShowNewFileDialog(false)
      setNewItemName("")
    }
  }

  const handleCreateNewFolder = () => {
    if (newItemName) {
      onFileCreate(newItemParentPath || "src", newItemName, "folder") // Default to 'src' if no parent path
      setShowNewFolderDialog(false)
      setNewItemName("")
    }
  }

  const openNewFileDialog = (parentPath: string) => {
    setNewItemParentPath(parentPath)
    setNewItemName("new-file.js") // Pre-fill with a default name
    setShowNewFileDialog(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const openNewFolderDialog = (parentPath: string) => {
    setNewItemParentPath(parentPath)
    setNewItemName("new-folder") // Pre-fill with a default name
    setShowNewFolderDialog(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800">
        <span className="text-sm font-medium text-gray-300">EXPLORER</span>
        <div className="flex space-x-1">
          <Button 
            onClick={() => openNewFileDialog("")}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            title="New File"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => openNewFolderDialog("")}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            title="New Folder"
          >
            <Folder className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        <AnimatePresence initial={false}>
          {files.map((file) => (
            <FileItem
              key={file.path}
              file={file}
              level={0}
              onSelect={onFileSelect}
              onDelete={onFileDelete}
              onRename={onFileRename}
              onCreate={onFileCreate}
              activeFile={activeFile}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* New File Dialog */}
      <AnimatePresence>
        {showNewFileDialog && (
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border border-gray-700">
          <DialogHeader>
                <DialogTitle className="text-white">Create New File</DialogTitle>
          </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newFileName" className="text-right text-gray-400">
                    Name
            </Label>
            <Input
                    id="newFileName"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
          </div>
          <DialogFooter>
                <Button 
                  onClick={() => setShowNewFileDialog(false)}
                  variant="outline"
                  className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                >
              Cancel
            </Button>
                <Button 
                  onClick={handleCreateNewFile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create
                </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        )}
      </AnimatePresence>

      {/* New Folder Dialog */}
      <AnimatePresence>
        {showNewFolderDialog && (
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border border-gray-700">
          <DialogHeader>
                <DialogTitle className="text-white">Create New Folder</DialogTitle>
          </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newFolderName" className="text-right text-gray-400">
                    Name
            </Label>
            <Input
                    id="newFolderName"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
          </div>
          <DialogFooter>
                <Button 
                  onClick={() => setShowNewFolderDialog(false)}
                  variant="outline"
                  className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                >
              Cancel
            </Button>
                <Button 
                  onClick={handleCreateNewFolder}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create
                </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
