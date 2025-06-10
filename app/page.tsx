"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Toaster, toast } from "sonner"
import dynamic from "next/dynamic"
import PreviewPane from "../components/PreviewPane"
import TopBar from "../components/TopBar"
import Sidebar from "../components/Sidebar"
import FileTabs from "../components/FileTabs"
import TerminalPanel from "../components/TerminalPanel"
import StatusBar from "../components/StatusBar"
import SplitPane from "../components/SplitPane"
import { defaultCode, type FileType } from "../utils/defaultCode"
import { saveProject, loadProject, exportProject, type ProjectData } from "../utils/localStorage"
import {
  createFile,
  deleteFile,
  renameFile,
  toggleFolder,
  getDefaultContent,
  findFileByPath,
  FileItem,
  OpenFile,
} from "../utils/fileSystem"

const EditorPane = dynamic(() => import("../components/EditorPane"), { ssr: false })

export default function WebIDEX() {
  const [activeFile, setActiveFile] = useState<string>("src/index.html")
  const [activeFileType, setActiveFileType] = useState<FileType>("html")
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark")
  const [lastSaved, setLastSaved] = useState<number>()
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [logs, setLogs] = useState<string[]>(["Welcome to WebIDE X Terminal"])
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [hasErrors, setHasErrors] = useState(false)
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>("")
  const [triggerEditorFormat, setTriggerEditorFormat] = useState(false)
  const [panelSizes, setPanelSizes] = useState<number[]>([60, 40])

  // User Preferences State
  const [editorFontSize, setEditorFontSize] = useState<number>(14)
  const [editorTabSize, setEditorTabSize] = useState<number>(2)
  const [editorWordWrap, setEditorWordWrap] = useState<"on" | "off">("on")
  const [terminalFontFamily, setTerminalFontFamily] = useState<string>("Consolas")

  // File system state
  const [fileSystem, setFileSystem] = useState<FileItem[]>([
    {
      id: "root",
      name: "src",
      type: "folder",
      path: "src",
      isOpen: true,
      children: [
        {
          id: "html",
          name: "index.html",
          type: "file",
          path: "src/index.html",
          content: defaultCode.html,
          fileType: "html",
        },
        {
          id: "css",
          name: "style.css",
          type: "file",
          path: "src/style.css",
          content: defaultCode.css,
          fileType: "css",
        },
        {
          id: "js",
          name: "script.js",
          type: "file",
          path: "src/script.js",
          content: defaultCode.js,
          fileType: "js",
        },
      ],
    },
  ])

  // Open files state
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([
    { id: "html", path: "src/index.html", type: "html", content: defaultCode.html, isDirty: false },
    { id: "css", path: "src/style.css", type: "css", content: defaultCode.css, isDirty: false },
    { id: "js", path: "src/script.js", type: "js", content: defaultCode.js, isDirty: false },
  ])

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleEditorFormatDone = useCallback(() => {
    setTriggerEditorFormat(false)
  }, [])

  // Load saved project on mount
  useEffect(() => {
    const saved = loadProject()
    if (saved) {
      // Update open files with saved content
      setOpenFiles((prev) =>
        prev.map((file) => {
          if (file.type === "html") return { ...file, content: saved.html }
          if (file.type === "css") return { ...file, content: saved.css }
          if (file.type === "js") return { ...file, content: saved.js }
          return file
        }),
      )

      // Update file system with saved content
      setFileSystem((prev) => {
        const updateContent = (items: FileItem[]): FileItem[] => {
          return items.map((item) => {
            if (item.path === "src/index.html") return { ...item, content: saved.html }
            if (item.path === "src/style.css") return { ...item, content: saved.css }
            if (item.path === "src/script.js") return { ...item, content: saved.js }
            if (item.children) return { ...item, children: updateContent(item.children) }
            return item
          })
        }
        return updateContent(prev)
      })

      setLastSaved(saved.lastModified)

      // Load panel sizes
      const storedPanelSizes = localStorage.getItem("panelSizes")
      if (storedPanelSizes) {
        try {
          const parsedSizes = JSON.parse(storedPanelSizes)
          if (Array.isArray(parsedSizes) && parsedSizes.length === 2) {
            setPanelSizes(parsedSizes)
          }
        } catch (e) {
          console.error("Failed to parse panel sizes from local storage", e)
        }
      }

      // Load preferences
      const storedPreferences = localStorage.getItem("editorPreferences")
      if (storedPreferences) {
        try {
          const preferences = JSON.parse(storedPreferences)
          setEditorFontSize(preferences.editorFontSize || 14)
          setEditorTabSize(preferences.editorTabSize || 2)
          setEditorWordWrap(preferences.editorWordWrap || "on")
          setTerminalFontFamily(preferences.terminalFontFamily || "Consolas")
        } catch (e) {
          console.error("Failed to parse editor preferences from local storage", e)
        }
      }

      toast.success("Project loaded from local storage")
    }
  }, [])

  // Save preferences whenever they change
  useEffect(() => {
    const preferences = {
      editorFontSize,
      editorTabSize,
      editorWordWrap,
      terminalFontFamily,
    }
    localStorage.setItem("editorPreferences", JSON.stringify(preferences))
  }, [editorFontSize, editorTabSize, editorWordWrap, terminalFontFamily])

  // Save panel sizes whenever they change
  useEffect(() => {
    localStorage.setItem("panelSizes", JSON.stringify(panelSizes))
  }, [panelSizes])

  // Setup auto-save
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setInterval(() => {
      const hasUnsavedChanges = openFiles.some((file) => file.isDirty)
      if (hasUnsavedChanges) {
        handleSave()
      }
    }, 30000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [openFiles])

  // Get current file content
  const getCurrentFileContent = useCallback(
    (type: FileType) => {
      const file = openFiles.find((f) => f.type === type)
      return file ? file.content : ""
    },
    [openFiles],
  )

  // Handle file changes
  const handleCodeChange = useCallback((fileType: FileType, value: string) => {
    // Update open files
    setOpenFiles((prev) =>
      prev.map((file) => (file.type === fileType ? { ...file, content: value, isDirty: true } : file)),
    )

    // Update file system
    setFileSystem((prev) => {
      const updateContent = (items: FileItem[]): FileItem[] => {
        return items.map((item) => {
          if (item.fileType === fileType) {
            return { ...item, content: value }
          }
          if (item.children) {
            return { ...item, children: updateContent(item.children) }
          }
          return item
        })
      }
      return updateContent(prev)
    })
  }, [])

  const handleSave = useCallback(() => {
    const htmlContent = getCurrentFileContent("html")
    const cssContent = getCurrentFileContent("css")
    const jsContent = getCurrentFileContent("js")

    const projectData: ProjectData = {
      html: htmlContent,
      css: cssContent,
      js: jsContent,
      lastModified: Date.now(),
    }

    saveProject(projectData)
    setLastSaved(Date.now())

    // Mark all files as not dirty
    setOpenFiles((prev) => prev.map((file) => ({ ...file, isDirty: false })))

    setLogs((prev) => [...prev, `Project saved at ${new Date().toLocaleTimeString()}`])
    toast.success("Project saved!")
  }, [getCurrentFileContent])

  const handleExport = useCallback(() => {
    const htmlContent = getCurrentFileContent("html")
    const cssContent = getCurrentFileContent("css")
    const jsContent = getCurrentFileContent("js")

    const projectData: ProjectData = {
      html: htmlContent,
      css: cssContent,
      js: jsContent,
      lastModified: Date.now(),
    }

    exportProject(projectData)
    toast.success("Project exported!")
  }, [getCurrentFileContent])

  // Handle file operations
  const handleFileCreate = (parentPath: string, name: string, type: "file" | "folder") => {
    // Generate default content based on file extension
    const content = type === "file" ? getDefaultContent(name) : ""

    // Create the file in the file system
    setFileSystem((prev) => createFile(prev, parentPath, name, type, content))

    // If it's a file with a supported type, open it
    if (type === "file") {
      const fileType = name.split(".").pop()?.toLowerCase()
      const supportedTypes = ["html", "css", "js"]

      if (fileType && supportedTypes.includes(fileType)) {
        const newPath = parentPath ? `${parentPath}/${name}` : name
        const newId = `${Date.now()}`

        // Add to open files
        setOpenFiles((prev) => [
          ...prev,
          {
            id: newId,
            path: newPath,
            type: fileType as FileType,
            content,
            isDirty: false,
          },
        ])

        // Set as active file
        setActiveFile(newPath)
        setActiveFileType(fileType as FileType)
      }
    }

    toast.success(`${type === "file" ? "File" : "Folder"} created: ${name}`)
  }

  const handleFileDelete = (path: string) => {
    // Check if file is open and close it
    const openFile = openFiles.find((file) => file.path === path)
    if (openFile) {
      handleCloseFile(openFile.type)
    }

    // Delete the file from the file system
    setFileSystem((prev) => deleteFile(prev, path))
    toast.success(`Deleted: ${path}`)
  }

  const handleFileRename = (oldPath: string, newName: string) => {
    // Get the file before renaming
    const fileToRename = findFileByPath(fileSystem, oldPath)
    if (!fileToRename) return

    // Get parent path and create new path
    const parentPath = oldPath.includes("/") ? oldPath.substring(0, oldPath.lastIndexOf("/")) : ""
    const newPath = parentPath ? `${parentPath}/${newName}` : newName

    // If the file is open, update the open files
    const openFileIndex = openFiles.findIndex((file) => file.path === oldPath)
    if (openFileIndex !== -1) {
      const fileType = newName.split(".").pop()?.toLowerCase() as FileType

      setOpenFiles((prev) => {
        const newFiles = [...prev]
        newFiles[openFileIndex] = {
          ...newFiles[openFileIndex],
          path: newPath,
          type: fileType || newFiles[openFileIndex].type,
        }
        return newFiles
      })

      // If it was the active file, update the active file path
      if (activeFile === oldPath) {
        setActiveFile(newPath)
        setActiveFileType(fileType || activeFileType)
      }
    }

    // Rename the file in the file system
    setFileSystem((prev) => renameFile(prev, oldPath, newName))
    toast.success(`Renamed to: ${newName}`)
  }

  const handleFileSelect = (path: string) => {
    const selectedFile = findFileByPath(fileSystem, path)

    if (!selectedFile) return

    if (selectedFile.type === "folder") {
      // Toggle folder open/closed
      setFileSystem((prev) => toggleFolder(prev, path))
      setCurrentSearchQuery("") // Clear search when navigating folders
      return
    }

    if (selectedFile.type === "file") {
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase()
      const supportedTypes = ["html", "css", "js"]

      if (fileType && supportedTypes.includes(fileType)) {
        // Check if file is already open
        const isOpen = openFiles.some((file) => file.path === path)

        if (!isOpen) {
          // Add to open files
          setOpenFiles((prev) => [
            ...prev,
            {
              id: selectedFile.id,
              path: selectedFile.path,
              type: fileType as FileType,
              content: selectedFile.content || "",
              isDirty: false,
            },
          ])
        }

        // Set as active file
        setActiveFile(path)
        setActiveFileType(fileType as FileType)
        setCurrentSearchQuery("") // Clear search when selecting a new file
      } else {
        toast.info(`File type not supported: ${fileType}`)
      }
    }
  }

  const handleCloseFile = (fileType: FileType) => {
    const fileToClose = openFiles.find((file) => file.type === fileType)

    if (!fileToClose) return

    // Check if file has unsaved changes
    if (fileToClose.isDirty) {
      const confirmClose = window.confirm("This file has unsaved changes. Close anyway?")
      if (!confirmClose) return
    }

    // Remove from open files
    setOpenFiles((prev) => prev.filter((file) => file.type !== fileType))

    // If it was the active file, set a new active file
    if (activeFileType === fileType) {
      const remainingFiles = openFiles.filter((file) => file.type !== fileType)
      if (remainingFiles.length > 0) {
        setActiveFile(remainingFiles[0].path)
        setActiveFileType(remainingFiles[0].type)
      }
    }
  }

  const handleMenuAction = (action: string) => {
    switch (action) {
      case "save":
        handleSave()
        break
      case "export":
        handleExport()
        break
      case "toggle-terminal":
        setTerminalVisible(!terminalVisible)
        break
      case "toggle-sidebar":
        setSidebarVisible(!sidebarVisible)
        break
      case "new-file":
        handleFileCreate("src", "new-file.js", "file")
        break
      case "search":
        setSidebarVisible(true)
        break
    }
  }

  const handleSearch = (query: string) => {
    setCurrentSearchQuery(query)
  }

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"))
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            handleSave()
            break
          case "b":
            e.preventDefault()
            setSidebarVisible(!sidebarVisible)
            break
          case "`":
            e.preventDefault()
            setTerminalVisible(!terminalVisible)
            break
          case "p":
            e.preventDefault()
            // Command palette
            toast.info("Command palette coming soon!")
            break
          case "f":
            e.preventDefault()
            setSidebarVisible(true)
            // Optionally focus the search input in the sidebar
            // This would require a ref to the Sidebar's search input
            // For now, just opening the sidebar is enough.
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSave, sidebarVisible, terminalVisible])

  // Handle errors from preview
  const handleErrorsChange = (errors: string[]) => {
    setHasErrors(errors.length > 0)
    if (errors.length > 0) {
      setLogs((prev) => [...prev, ...errors])
    }
  }

  // Handle cursor position change
  const handleCursorPositionChange = (position: { line: number; column: number }) => {
    setCursorPosition(position)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <TopBar onMenuAction={handleMenuAction} onSearch={handleSearch} />

      <div className="flex-1 flex overflow-hidden">
        {sidebarVisible && (
          <Sidebar
            isVisible={true}
            files={fileSystem}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
            onFileRename={handleFileRename}
            onSearch={handleSearch}
            editorFontSize={editorFontSize}
            setEditorFontSize={setEditorFontSize}
            editorTabSize={editorTabSize}
            setEditorTabSize={setEditorTabSize}
            editorWordWrap={editorWordWrap}
            setEditorWordWrap={setEditorWordWrap}
            terminalFontFamily={terminalFontFamily}
            setTerminalFontFamily={setTerminalFontFamily}
          />
        )}

        <div className="flex-1 flex flex-col">
          <FileTabs
            activeFile={activeFileType}
            onFileSelect={(type) => {
              const file = openFiles.find((f) => f.type === type)
              if (file) {
                setActiveFile(file.path)
                setActiveFileType(type)
              }
            }}
            openFiles={openFiles.map((file) => file.type)}
            onCloseFile={handleCloseFile}
          />

          <SplitPane
            direction="horizontal"
            sizes={panelSizes}
            minSizes={[10, 10]}
            onResizeEnd={(newSizes) => setPanelSizes(newSizes)}
            className="flex-1"
          >
            <div className="h-full">
              <EditorPane
                language={activeFileType}
                value={getCurrentFileContent(activeFileType)}
                onChange={(value) => handleCodeChange(activeFileType, value)}
                theme={theme}
                onCursorPositionChange={handleCursorPositionChange}
                searchQuery={currentSearchQuery}
                triggerFormat={triggerEditorFormat}
                onFormatDone={handleEditorFormatDone}
                fontSize={editorFontSize}
                tabSize={editorTabSize}
                wordWrap={editorWordWrap}
                editorKey={activeFile}
              />
            </div>
            <div className="h-full">
              <PreviewPane
                html={getCurrentFileContent("html")}
                css={getCurrentFileContent("css")}
                js={getCurrentFileContent("js")}
                onErrorsChange={handleErrorsChange}
              />
            </div>
          </SplitPane>
        </div>
      </div>

      {terminalVisible && (
        <TerminalPanel
          isVisible={true}
          onToggle={() => setTerminalVisible(!terminalVisible)}
          logs={logs}
          onClearLogs={() => setLogs([])}
          fontFamily={terminalFontFamily}
        />
      )}

      <StatusBar
        activeFile={activeFile}
        lineNumber={cursorPosition.line}
        columnNumber={cursorPosition.column}
        language={activeFileType}
        hasErrors={hasErrors}
        theme={theme}
        onThemeChange={handleThemeToggle}
      />

      <Toaster position="bottom-right" />
    </div>
  )
}
