"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Toaster, toast } from "sonner"
import dynamic from "next/dynamic"
import PreviewPane, { PreviewPaneRef } from "../components/PreviewPane"
import TopBar from "../components/TopBar"
import Sidebar from "../components/Sidebar"
import FileTabs from "../components/FileTabs"
import TerminalPanel from "../components/TerminalPanel"
import StatusBar from "../components/StatusBar"
import SplitPane from "../components/SplitPane"
import Toolbar from "../components/Toolbar"
import { defaultCode, type FileType, type FileTreeNode } from "../utils/defaultCode"
import { saveProject, loadProject, exportProject, type ProjectData } from "../utils/localStorage"
import {
  createFile,
  deleteFile,
  renameFile,
  toggleFolder,
  getDefaultContent,
  findFileByPath,
} from "../utils/fileSystem"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { motion } from "framer-motion"

const EditorPane = dynamic(() => import("../components/EditorPane"), { ssr: false })

export default function WebIDEX() {
  const [activeFile, setActiveFile] = useState<FileTreeNode | null>(null)
  const [activeFileType, setActiveFileType] = useState<FileType | undefined>(undefined)
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
  const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false)

  // Ref for PreviewPane to trigger refresh
  const previewPaneRef = useRef<PreviewPaneRef>(null)

  // User Preferences State
  const [editorFontSize, setEditorFontSize] = useState<number>(14)
  const [editorTabSize, setEditorTabSize] = useState<number>(2)
  const [editorWordWrap, setEditorWordWrap] = useState<"on" | "off">("on")
  const [terminalFontFamily, setTerminalFontFamily] = useState<string>("Consolas")

  // File system state
  const [fileSystem, setFileSystem] = useState<FileTreeNode[]>([
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
          type: "html",
          path: "src/index.html",
          content: defaultCode.html,
          isDirty: false,
        },
        {
          id: "css",
          name: "style.css",
          type: "css",
          path: "src/style.css",
          content: defaultCode.css,
          isDirty: false,
        },
        {
          id: "js",
          name: "script.js",
          type: "js",
          path: "src/script.js",
          content: defaultCode.js,
          isDirty: false,
        },
      ],
    },
  ])

  // Open files state
  const [openFiles, setOpenFiles] = useState<FileTreeNode[]>([
    { id: "html", name: "index.html", path: "src/index.html", type: "html", content: defaultCode.html, isDirty: false },
    { id: "css", name: "style.css", path: "src/style.css", type: "css", content: defaultCode.css, isDirty: false },
    { id: "js", name: "script.js", path: "src/script.js", type: "js", content: defaultCode.js, isDirty: false },
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
        const updateContent = (items: FileTreeNode[]): FileTreeNode[] => {
          return items.map((item) => {
            if (item.path === "src/index.html") return { ...item, content: saved.html, isDirty: false }
            if (item.path === "src/style.css") return { ...item, content: saved.css, isDirty: false }
            if (item.path === "src/script.js") return { ...item, content: saved.js, isDirty: false }
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
  const getCurrentFileContent = (type: FileType): string => {
    const file = openFiles.find((f) => f.type === type)
    return file?.content || defaultCode[type]
  }

  // Handle file changes
  const handleCodeChange = (value: string) => {
    if (activeFile) {
      const updatedOpenFiles = openFiles.map((file) =>
        file.path === activeFile.path ? { ...file, content: value, isDirty: true } : file
      )
      setOpenFiles(updatedOpenFiles)

      setFileSystem((prev) => {
        const updateContent = (items: FileTreeNode[]): FileTreeNode[] => {
          return items.map((item) => {
            if (item.path === "src/index.html") return { ...item, content: value }
            if (item.path === "src/style.css") return { ...item, content: value }
            if (item.path === "src/script.js") return { ...item, content: value }
            if (item.children) return { ...item, children: updateContent(item.children) }
            return item
          })
        }
        return updateContent(prev)
      })

      setLastSaved(Date.now())
    }
  }

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

  // Handles creation of new files or folders in the file system
  const handleFileCreate = (parentPath: string, name: string, type: "file" | "folder") => {
    const newPath = `${parentPath}/${name}`
    setFileSystem((prev) => createFile(prev, parentPath, name, type))

    if (type === "file") {
      // Automatically open the new file
      const newFileNode = findFileByPath(fileSystem, newPath)
      if (newFileNode) {
        setOpenFiles((prev) => [...prev, newFileNode])
        setActiveFile(newFileNode)
        if (newFileNode.type === 'html' || newFileNode.type === 'css' || newFileNode.type === 'js') {
          setActiveFileType(newFileNode.type)
        } else {
          setActiveFileType(undefined)
        }
        toast.success(`File created: ${name}`)
      }
    } else {
      // Automatically open the new folder
      setFileSystem((prev) => toggleFolder(prev, newPath))
      toast.success(`Folder created: ${name}`)
    }
  }

  // Handles deletion of files from the file system and closes them if open
  const handleFileDelete = (path: string) => {
    // Check if file is open and close it
    const openFile = openFiles.find((file) => file.path === path)
    if (openFile) {
      handleCloseFile(openFile)
    }

    // Delete the file from the file system
    setFileSystem((prev) => deleteFile(prev, path))
    toast.success(`Deleted: ${path.split('/').pop()}`)
  }

  // Handles renaming of files in the file system and updates open files/active file
  const handleFileRename = (oldPath: string, newName: string) => {
    const fileType = newName.split('.').pop() as FileType;
    const newPath = `${oldPath.substring(0, oldPath.lastIndexOf('/'))}/${newName}`

    setFileSystem(renameFile(fileSystem, oldPath, newName));

    // Update open files
    setOpenFiles((prev) =>
      prev.map((file) =>
        file.path === oldPath
          ? { ...file, name: newName, path: newPath, type: fileType as FileType }
          : file
      )
    );

    // If it was the active file, update the active file path
    if (activeFile?.path === oldPath) {
      setActiveFile({ ...activeFile, name: newName, path: newPath, type: fileType || activeFile.type });
    }

    toast.success(`Renamed ${oldPath.split('/').pop()} to ${newName}`);
  }

  // Handles selection of a file or folder in the file explorer
  const handleFileSelect = (path: string) => {
    const selectedFile = findFileByPath(fileSystem, path)

    if (!selectedFile) return

    if (selectedFile.type === "folder") {
      // Toggle folder open/closed
      setFileSystem((prev) => toggleFolder(prev, path))
      setCurrentSearchQuery("") // Clear search when navigating folders
      setActiveFile(null) // No active file when a folder is selected
      setActiveFileType(undefined)
      return
    }

    // Check if file is already open
    const isOpen = openFiles.some((file) => file.path === path)

    if (!isOpen) {
      // Add to open files
      setOpenFiles((prev) => [
        ...prev,
        {
          id: selectedFile.id,
          name: selectedFile.name,
          path: selectedFile.path,
          type: selectedFile.type,
          content: selectedFile.content || "",
          isDirty: false,
          isOpen: selectedFile.isOpen, // Ensure isOpen is carried over for folders even if it's a file type
        },
      ])
    }

    // Set as active file
    setActiveFile(selectedFile)
    setActiveFileType(selectedFile.type as FileType)
    setCurrentSearchQuery("") // Clear search when selecting a new file
  }

  const handleCloseFile = (fileToClose: FileTreeNode) => {
    const remainingFiles = openFiles.filter((file) => file.path !== fileToClose.path)
    setOpenFiles(remainingFiles)

    // If the closed file was the active file, set a new active file
    if (activeFile?.path === fileToClose.path) {
      if (remainingFiles.length > 0) {
        const nextFile = remainingFiles[0]
        setActiveFile(nextFile)
        if (nextFile.type === 'html' || nextFile.type === 'css' || nextFile.type === 'js') {
          setActiveFileType(nextFile.type)
        } else {
          setActiveFileType(undefined)
        }
      } else {
        setActiveFile(null)
        setActiveFileType(undefined)
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
        // Default parent path to 'src' for new files from top bar
        handleFileCreate("src", "new-file.html", "file") 
        break
      case "search":
        setSidebarVisible(true)
        // Optionally set the active panel in sidebar to 'search'
        // This would require a prop to be passed to Sidebar
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

  // Function to refresh the preview, called by Toolbar's Run button
  const refreshPreview = useCallback(() => {
    previewPaneRef.current?.refresh();
    toast.info("Preview Refreshed!");
  }, []);

  const togglePreviewFullScreen = () => {
    setIsPreviewFullScreen((prev) => !prev)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <TopBar onMenuAction={handleMenuAction} onSearch={handleSearch} />

      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full min-h-[inherit]"
        >
          {/* Sidebar Panel */}
          <ResizablePanel
            defaultSize={panelSizes[0]}
            collapsedSize={0}
            collapsible={true}
            minSize={sidebarVisible ? 20 : 0}
            maxSize={30}
            onCollapse={() => setSidebarVisible(false)}
            onExpand={() => setSidebarVisible(true)}
            className="border-r border-gray-700"
          >
            <Sidebar
              isVisible={sidebarVisible}
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
              isExplorerOpen={true}
              setIsExplorerOpen={() => {}}
              currentPanel={sidebarVisible ? "files" : undefined}
            />
          </ResizablePanel>

          {/* Main Content Area */}
          <ResizablePanel defaultSize={80}>
            <div className="flex flex-col h-full">
              <Toolbar
                activeFile={activeFile?.path || ""}
                onSave={handleSave}
                onExport={handleExport}
                onRun={refreshPreview}
                onShare={() => {}}
                onToggleTerminal={() => setTerminalVisible(!terminalVisible)}
                onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
                onTogglePreviewFullScreen={togglePreviewFullScreen}
                triggerEditorFormat={triggerEditorFormat}
                onEditorFormatDone={handleEditorFormatDone}
                isSidebarVisible={sidebarVisible}
                isPreviewFullScreen={isPreviewFullScreen}
              />
              
              <FileTabs
                activeFile={activeFile}
                openFiles={openFiles}
                onFileSelect={(fileNode) => {
                  if (fileNode) {
                    setActiveFile(fileNode)
                    if (fileNode.type === 'html' || fileNode.type === 'css' || fileNode.type === 'js') {
                      setActiveFileType(fileNode.type)
                    } else {
                      setActiveFileType(undefined)
                    }
                  }
                }}
                onCloseFile={handleCloseFile}
              />

              {/* Code and Preview Split */}
              <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel 
                  defaultSize={60} 
                  minSize={0}
                  className="relative"
                >
                  {activeFile ? (
                    <EditorPane
                      key="monaco-editor-instance"
                      language={activeFileType as FileType}
                      value={activeFile?.content || ""}
                      onChange={handleCodeChange}
                      theme={theme}
                      onCursorPositionChange={handleCursorPositionChange}
                      searchQuery={currentSearchQuery}
                      triggerFormat={triggerEditorFormat}
                      onFormatDone={handleEditorFormatDone}
                      fontSize={editorFontSize}
                      tabSize={editorTabSize}
                      wordWrap={editorWordWrap}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                      Select a file to start coding
                    </div>
                  )}
                </ResizablePanel>

                <ResizableHandle 
                  withHandle 
                  className="bg-gray-800 hover:bg-blue-500 transition-colors duration-200"
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="w-1 h-8 bg-gray-600 rounded-full" />
                  </div>
                </ResizableHandle>

                <ResizablePanel 
                  defaultSize={40}
                  minSize={0}
                  className="relative bg-white"
                >
                  <PreviewPane
                    ref={previewPaneRef}
                    html={getCurrentFileContent("html")}
                    css={getCurrentFileContent("css")}
                    js={getCurrentFileContent("js")}
                    onErrorsChange={handleErrorsChange}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
        language={activeFileType || 'plaintext'}
        hasErrors={hasErrors}
        theme={theme}
        onThemeChange={handleThemeToggle}
      />

      <Toaster position="bottom-right" />
    </div>
  )
}
