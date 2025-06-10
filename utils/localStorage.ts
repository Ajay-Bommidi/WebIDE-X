import JSZip from "jszip"

const STORAGE_KEY = "code-editor-project"

export interface ProjectData {
  html: string
  css: string
  js: string
  lastModified: number
}

export const saveProject = (data: ProjectData): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...data,
        lastModified: Date.now(),
      }),
    )
  } catch (error) {
    console.error("Failed to save project:", error)
  }
}

export const loadProject = (): ProjectData | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error("Failed to load project:", error)
    return null
  }
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
