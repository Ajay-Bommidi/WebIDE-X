"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Plus, Edit2, Trash2, FileJson, MoreVertical } from "lucide-react"
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

interface FileItem {
  id: string
  name: string
  path: string
  type: "file" | "folder"
  children?: FileItem[]
  isOpen?: boolean
  isActive?: boolean
}

interface FileExplorerProps {
  files: FileItem[]
  activeFile: string
  onFileSelect: (path: string) => void
  onFileCreate: (parentPath: string, name: string, type: "file" | "folder") => void
  onFileDelete: (path: string) => void
  onFileRename: (oldPath: string, newPath: string) => void
}

interface FileItemProps {
  file: FileItem
  level?: number
  onSelect: (path: string) => void
  onDelete: (path: string) => void
  onRename: (oldPath: string, newPath: string) => void
  onCreate: (parentPath: string, name: string, type: "file" | "folder") => void
}

const FileIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case "folder":
      return <FolderOpen className={className} />
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return <FileText className={className} />
    case "css":
    case "scss":
      return <FileText className={className} />
    case "html":
      return <FileText className={className} />
    case "json":
      return <FileText className={className} />
    default:
      return <FileText className={className} />
  }
}

const FileItem = ({ file, level = 0, onSelect, onDelete, onRename, onCreate }: FileItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <div>
      <div
        className={`group flex items-center px-2 py-1 hover:bg-accent/50 cursor-pointer ${
          file.isActive ? "bg-accent text-accent-foreground" : ""
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {file.type === "folder" && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-accent rounded-sm"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        <div
          className="flex items-center flex-1 min-w-0"
          onClick={() => file.type === "file" && onSelect(file.path)}
        >
          <FileIcon type={file.type} className="h-4 w-4 mr-2 flex-shrink-0" />
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border border-input rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          ) : (
            <span className="truncate text-sm">{file.name}</span>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex items-center">
          {file.type === "folder" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                onCreate(file.path, "", "file")
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              {file.type === "folder" && (
                <DropdownMenuItem
                  onClick={() => onCreate(file.path, "", "folder")}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(file.path)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {file.type === "folder" && isOpen && file.children && (
        <div>
          {file.children.map((child) => (
            <FileItem
              key={child.path}
              file={child}
              level={level + 1}
              onSelect={onSelect}
              onDelete={onDelete}
              onRename={onRename}
              onCreate={onCreate}
            />
          ))}
        </div>
      )}
    </div>
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
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newItemParentPath, setNewItemParentPath] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleRename = (oldPath: string, newName: string) => {
    if (newName && newName !== oldPath.split("/").pop()) {
      onFileRename(oldPath, newName)
    }
    setEditingFile(null)
    setNewFileName("")
  }

  const handleCreateNewFile = () => {
    if (newItemName) {
      onFileCreate(newItemParentPath, newItemName, "file")
      setShowNewFileDialog(false)
      setNewItemName("")
    }
  }

  const handleCreateNewFolder = () => {
    if (newItemName) {
      onFileCreate(newItemParentPath, newItemName, "folder")
      setShowNewFolderDialog(false)
      setNewItemName("")
    }
  }

  const openNewFileDialog = (parentPath: string) => {
    setNewItemParentPath(parentPath)
    setNewItemName("")
    setShowNewFileDialog(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const openNewFolderDialog = (parentPath: string) => {
    setNewItemParentPath(parentPath)
    setNewItemName("")
    setShowNewFolderDialog(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <span className="text-sm font-medium text-gray-300">EXPLORER</span>
        <div className="flex space-x-1">
          <button onClick={() => openNewFileDialog("")} className="p-1 hover:bg-gray-700 rounded" title="New File">
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => openNewFolderDialog("")} className="p-1 hover:bg-gray-700 rounded" title="New Folder">
            <Folder className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <FileItem
            key={file.path}
            file={file}
            level={0}
            onSelect={onFileSelect}
            onDelete={onFileDelete}
            onRename={onFileRename}
            onCreate={onFileCreate}
          />
        ))}
      </div>

      {/* New File Dialog */}
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="filename" className="text-gray-300">
              File Name
            </Label>
            <Input
              ref={inputRef}
              id="filename"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. index.html"
              className="mt-2 bg-gray-700 border-gray-600 text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateNewFile()
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="foldername" className="text-gray-300">
              Folder Name
            </Label>
            <Input
              ref={inputRef}
              id="foldername"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. components"
              className="mt-2 bg-gray-700 border-gray-600 text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateNewFolder()
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
