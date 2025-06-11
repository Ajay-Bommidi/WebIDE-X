import JSZip from "jszip"

const STORAGE_KEY = "code-editor-project"

export interface ProjectData {
  html: string
  css: string
  js: string
  lastModified: number
}

// No-op for now to eliminate localStorage errors
export const saveProject = (data: ProjectData): void => {
  // console.log("Project save called (localStorage disabled):", data)
}

// Returns null for now to eliminate localStorage errors
export const loadProject = (): ProjectData | null => {
  // console.log("Project load called (localStorage disabled)")
  return null
}

export const exportProject = async (data: ProjectData): Promise<void> => {
  const zip = new JSZip()

  zip.file("index.html", data.html)
  zip.file("style.css", data.css)
  zip.file("script.js", data.js)

  try {
    const content = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(content)
    const a = document.createElement("a")
    a.href = url
    a.download = "code-editor-project.zip"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Failed to generate or download zip:", error)
  }
}
