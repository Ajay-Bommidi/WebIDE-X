"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Plus, Edit2, Trash2, FileJson, MoreVertical, FileCode } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuPortal,
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
  const { id, name, type, path, children, isOpen } = file
  const isSelected = activeFile?.path === path
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleRenameClick = useCallback(() => {
    setIsRenaming(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }, [])

  const handleRenameSubmit = useCallback(() => {
    if (newName.trim() !== "" && newName !== name) {
      onRename(path, newName)
    }
    setIsRenaming(false)
  }, [newName, name, path, onRename])

  const handleDeleteClick = useCallback(() => {
    onDelete(path)
  }, [path, onDelete])

  const handleNewFileClick = useCallback(() => {
    onCreate(path, `new-file.${type === "folder" ? "txt" : type}`, "file")
  }, [path, type, onCreate])

  const handleNewFolderClick = useCallback(() => {
    onCreate(path, "New Folder", "folder")
  }, [path, onCreate])

  const indentation = level * 16 // 16px per level

  return (
    <div className="w-full">
      <ContextMenu>
        <ContextMenuTrigger className="w-full">
          <div
            className={`flex items-center py-1 pr-2 rounded-md cursor-pointer hover:bg-gray-700/50 transition-colors ${isSelected ? "bg-blue-600/30 hover:bg-blue-600/40" : ""}`}
            style={{ paddingLeft: `${indentation + 8}px` }}
            onClick={() => type === "folder" ? onSelect(path) : onSelect(path)}
          >
            {type === "folder" ? (
              isOpen ? (
                <ChevronDown size={16} className="flex-shrink-0 text-gray-400 mr-1" />
              ) : (
                <ChevronRight size={16} className="flex-shrink-0 text-gray-400 mr-1" />
              )
            ) : (
              <span style={{ marginLeft: "17px" }} /> // Spacer for file icon
            )}
            {type === "folder" ? (
              <Folder size={16} className="flex-shrink-0 text-blue-400 mr-1" />
            ) : (
              <FileText size={16} className="flex-shrink-0 text-gray-400 mr-1" />
            )}
            {isRenaming ? (
              <Input
                ref={inputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameSubmit()
                  } else if (e.key === "Escape") {
                    setNewName(name) // Revert on escape
                    setIsRenaming(false)
                  }
                }}
                className="flex-1 bg-gray-800 text-white h-6 px-1 py-0 text-sm focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <span className="flex-1 text-sm text-gray-300 truncate">{name}</span>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {type !== "folder" && (
              <ContextMenuItem
                onClick={() => onSelect(path)}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                Open File
              </ContextMenuItem>
            )}
            {type === "folder" && (
              <ContextMenuItem
                onClick={() => onSelect(path)}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                {isOpen ? "Collapse Folder" : "Expand Folder"}
              </ContextMenuItem>
            )}
            <ContextMenuItem
              onClick={handleRenameClick}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              onClick={handleNewFileClick}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              New File
            </ContextMenuItem>
            <ContextMenuItem
              onClick={handleNewFolderClick}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              New Folder
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-border -mx-1 my-1 h-px" />
            <ContextMenuItem
              onClick={handleDeleteClick}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-500"
            >
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuPortal>
      </ContextMenu>

      <AnimatePresence>
        {type === "folder" && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 border-l border-gray-700 ml-2">
              {children?.map((childFile) => (
                <FileItem
                  key={childFile.id}
                  file={childFile}
                  level={level + 1}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  onRename={onRename}
                  onCreate={onCreate}
                  activeFile={activeFile}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
