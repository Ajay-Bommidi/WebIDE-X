import type { FileType } from "./defaultCode"
import { FileTreeNode } from "./defaultCode"

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
  files: FileTreeNode[],
  parentPath: string,
  name: string,
  type: "file" | "folder",
  content = "",
): FileTreeNode[] => {
  // Create a copy of the files array
  const newFiles = JSON.parse(JSON.stringify(files)) as FileTreeNode[]

  // Generate a unique ID for the new file
  const id = generateId()

  // Determine file type if it's a file
  const fileType = type === "file" ? getFileType(name) : undefined

  // Create the new file object
  const newFile: FileTreeNode = {
    id,
    name,
    type: type === "file" ? (fileType || "html") : "folder",
    path: parentPath ? `${parentPath}/${name}` : name,
    content: type === "file" ? content : undefined,
    children: type === "folder" ? [] : undefined,
    isOpen: type === "folder" ? true : undefined,
  }

  // If parent path is empty, add to root
  if (!parentPath) {
    return [...newFiles, newFile]
  }

  // Helper function to add file to a specific folder
  const addFileToFolder = (items: FileTreeNode[]): FileTreeNode[] => {
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
export const deleteFile = (files: FileTreeNode[], path: string): FileTreeNode[] => {
  // If the path is empty, return the files unchanged
  if (!path) return files

  // Get the parent path
  const parentPath = path.includes("/") ? path.substring(0, path.lastIndexOf("/")) : ""

  // If deleting from root
  if (!parentPath) {
    return files.filter((file) => file.path !== path)
  }

  // Helper function to remove a file from a specific folder
  const removeFileFromFolder = (items: FileTreeNode[]): FileTreeNode[] => {
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
export const renameFile = (files: FileTreeNode[], oldPath: string, newName: string): FileTreeNode[] => {
  // If the path is empty, return the files unchanged
  if (!oldPath) return files

  // Get the parent path and create the new path
  const parentPath = oldPath.includes("/") ? oldPath.substring(0, oldPath.lastIndexOf("/")) : ""
  const newPath = parentPath ? `${parentPath}/${newName}` : newName

  // Helper function to rename a file in the tree
  const renameFileInTree = (items: FileTreeNode[]): FileTreeNode[] => {
    return items.map((item) => {
      // If this is the file to rename
      if (item.path === oldPath) {
        // For files, update the type based on the new name
        const newType = item.type !== "folder" ? (getFileType(newName) || "html") : item.type;

        return {
          ...item,
          name: newName,
          path: newPath,
          type: newType,
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

// Update file content
export const updateFileContent = (files: FileTreeNode[], path: string, newContent: string): FileTreeNode[] => {
  const updateContentInTree = (items: FileTreeNode[]): FileTreeNode[] => {
    return items.map((item) => {
      if (item.path === path && item.type !== "folder") {
        return { ...item, content: newContent, isDirty: true };
      }
      if (item.children) {
        return { ...item, children: updateContentInTree(item.children) };
      }
      return item;
    });
  };
  return updateContentInTree(files);
};

// Find a file by ID
export const findFileById = (files: FileTreeNode[], id: string): FileTreeNode | null => {
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
export const findFileByPath = (files: FileTreeNode[], path: string): FileTreeNode | null => {
  for (const file of files) {
    if (file.path === path) return file
    if (file.children) {
      const found = findFileByPath(file.children, path)
      if (found) return found
    }
  }
  return null
}

// Toggle folder open/close state
export const toggleFolder = (files: FileTreeNode[], path: string): FileTreeNode[] => {
  const toggle = (items: FileTreeNode[]): FileTreeNode[] => {
    return items.map((item) => {
      if (item.path === path && item.type === "folder") {
        return { ...item, isOpen: !item.isOpen }
      }
      if (item.children) {
        return { ...item, children: toggle(item.children) }
      }
      return item
    })
    }
  return toggle(files)
}

// Get all open folders for file explorer
export const getOpenFolders = (files: FileTreeNode[]): Set<string> => {
  const openFolders = new Set<string>()

  const traverse = (items: FileTreeNode[]) => {
    items.forEach((item) => {
      if (item.type === "folder" && item.isOpen) {
        openFolders.add(item.path)
      }
      if (item.children) {
        traverse(item.children)
      }
    })
  }

  traverse(files)
  return openFolders
}

// Get default content for new files
export const getDefaultContent = (fileType: FileType | "folder"): string => {
  switch (fileType) {
    case "html":
      return "<!DOCTYPE html>\n<html>\n<head>\n    <title>New HTML File</title>\n</head>\n<body>\n    <h1>Hello, HTML!</h1>\n</body>\n</html>"
    case "css":
      return "/* New CSS File */\nbody {\n    font-family: sans-serif;\n}\n"
    case "js":
      return "// New JavaScript File\nconsole.log(\"Hello, JavaScript!\");\n"
    default:
  return ""
}
};
