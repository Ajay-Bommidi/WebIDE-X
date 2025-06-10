import type { FileType } from "./defaultCode"

export interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  path: string
  content?: string
  fileType?: FileType
  children?: FileItem[]
  isOpen?: boolean
}

export interface OpenFile {
  id: string
  path: string
  type: FileType
  content: string
  isDirty: boolean
}

// Generate a unique ID
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Get file type from extension
const getFileType = (name: string): FileType | undefined => {
  const extension = name.split(".").pop()?.toLowerCase()
  if (extension === "html" || extension === "htm") return "html"
  if (extension === "css") return "css"
  if (extension === "js" || extension === "javascript") return "js"
  return undefined
}

// Create a new file or folder
export const createFile = (
  files: FileItem[],
  parentPath: string,
  name: string,
  type: "file" | "folder",
  content = "",
): FileItem[] => {
  // Create a copy of the files array
  const newFiles = JSON.parse(JSON.stringify(files)) as FileItem[]

  // Generate a unique ID for the new file
  const id = generateId()

  // Determine file type if it's a file
  const fileType = type === "file" ? getFileType(name) : undefined

  // Create the new file object
  const newFile: FileItem = {
    id,
    name,
    type,
    path: parentPath ? `${parentPath}/${name}` : name,
    content: type === "file" ? content : undefined,
    fileType,
    children: type === "folder" ? [] : undefined,
    isOpen: type === "folder" ? true : undefined,
  }

  // If parent path is empty, add to root
  if (!parentPath) {
    return [...newFiles, newFile]
  }

  // Helper function to add file to a specific folder
  const addFileToFolder = (items: FileItem[]): FileItem[] => {
    return items.map((item) => {
      // If this is the parent folder, add the new file to its children
      if (item.path === parentPath && item.type === "folder") {
        return {
          ...item,
          children: [...(item.children || []), newFile],
          isOpen: true, // Open the folder when adding a new file
        }
      }
      // If this item has children, recursively search for the parent folder
      else if (item.children) {
        return {
          ...item,
          children: addFileToFolder(item.children),
        }
      }
      // Otherwise, return the item unchanged
      return item
    })
  }

  return addFileToFolder(newFiles)
}

// Delete a file or folder
export const deleteFile = (files: FileItem[], path: string): FileItem[] => {
  // If the path is empty, return the files unchanged
  if (!path) return files

  // Get the parent path
  const parentPath = path.includes("/") ? path.substring(0, path.lastIndexOf("/")) : ""

  // If deleting from root
  if (!parentPath) {
    return files.filter((file) => file.path !== path)
  }

  // Helper function to remove a file from a specific folder
  const removeFileFromFolder = (items: FileItem[]): FileItem[] => {
    return items.map((item) => {
      // If this is the parent folder, filter out the file to delete
      if (item.path === parentPath && item.type === "folder") {
        return {
          ...item,
          children: item.children?.filter((child) => child.path !== path),
        }
      }
      // If this item has children, recursively search for the parent folder
      else if (item.children) {
        return {
          ...item,
          children: removeFileFromFolder(item.children),
        }
      }
      // Otherwise, return the item unchanged
      return item
    })
  }

  return removeFileFromFolder(files)
}

// Rename a file or folder
export const renameFile = (files: FileItem[], oldPath: string, newName: string): FileItem[] => {
  // If the path is empty, return the files unchanged
  if (!oldPath) return files

  // Get the parent path and create the new path
  const parentPath = oldPath.includes("/") ? oldPath.substring(0, oldPath.lastIndexOf("/")) : ""
  const newPath = parentPath ? `${parentPath}/${newName}` : newName

  // Helper function to rename a file in the tree
  const renameFileInTree = (items: FileItem[]): FileItem[] => {
    return items.map((item) => {
      // If this is the file to rename
      if (item.path === oldPath) {
        // For files, update the fileType based on the new name
        const fileType = item.type === "file" ? getFileType(newName) : undefined

        return {
          ...item,
          name: newName,
          path: newPath,
          fileType,
          // If it's a folder, update the paths of all children
          children: item.children
            ? item.children.map((child) => ({
                ...child,
                path: child.path.replace(oldPath, newPath),
              }))
            : undefined,
        }
      }
      // If this item has children, recursively search for the file to rename
      else if (item.children) {
        return {
          ...item,
          children: renameFileInTree(item.children),
        }
      }
      // Otherwise, return the item unchanged
      return item
    })
  }

  return renameFileInTree(files)
}

// Find a file by ID
export const findFileById = (files: FileItem[], id: string): FileItem | null => {
  for (const file of files) {
    if (file.id === id) return file
    if (file.children) {
      const found = findFileById(file.children, id)
      if (found) return found
    }
  }
  return null
}

// Find a file by path
export const findFileByPath = (files: FileItem[], path: string): FileItem | null => {
  for (const file of files) {
    if (file.path === path) return file
    if (file.children) {
      const found = findFileByPath(file.children, path)
      if (found) return found
    }
  }
  return null
}

// Toggle folder open/closed state
export const toggleFolder = (files: FileItem[], path: string): FileItem[] => {
  return files.map((file) => {
    if (file.path === path && file.type === "folder") {
      return { ...file, isOpen: !file.isOpen }
    } else if (file.children) {
      return { ...file, children: toggleFolder(file.children, path) }
    }
    return file
  })
}

// Get all open folders
export const getOpenFolders = (files: FileItem[]): Set<string> => {
  const openFolders = new Set<string>()

  const traverse = (items: FileItem[]) => {
    for (const item of items) {
      if (item.type === "folder" && item.isOpen) {
        openFolders.add(item.path)
      }
      if (item.children) {
        traverse(item.children)
      }
    }
  }

  traverse(files)
  return openFolders
}

// Get default content for new files based on extension
export const getDefaultContent = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase()

  if (extension === "html" || extension === "htm") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>`
  }

  if (extension === "css") {
    return `/* Styles for the new file */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}`
  }

  if (extension === "js") {
    return `// JavaScript for the new file
document.addEventListener('DOMContentLoaded', function() {
    console.log('New file loaded!');
});`
  }

  return ""
}
