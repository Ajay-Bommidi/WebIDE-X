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

export const exportProject = (data: ProjectData): void => {
  const projectData = {
    files: {
      "index.html": data.html,
      "style.css": data.css,
      "script.js": data.js,
    },
    exportedAt: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(projectData, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "code-editor-project.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
