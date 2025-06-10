"use client"

import { Editor } from "@monaco-editor/react"
import type { FileType } from "../utils/defaultCode"
import { useCallback, useRef, useEffect } from "react"
import * as monaco from "monaco-editor"

interface EditorPaneProps {
  language: FileType
  value: string
  onChange: (value: string) => void
  theme: "vs-dark" | "light"
  onCursorPositionChange?: (position: { line: number; column: number }) => void
  searchQuery?: string
  triggerFormat?: boolean
  onFormatDone?: () => void
  fontSize?: number
  tabSize?: number
  wordWrap?: "on" | "off"
}

const languageMap = {
  html: "html",
  css: "css",
  js: "javascript",
}

export default function EditorPane({ language, value, onChange, theme, onCursorPositionChange, searchQuery, triggerFormat, onFormatDone, fontSize, tabSize, wordWrap }: EditorPaneProps) {
  const editorRef = useRef<any>(null)
  const decorations = useRef<string[]>([])

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "")
  }

  const handleEditorDidMount = useCallback(
    (editor: any) => {
      editorRef.current = editor
      // Track cursor position
      editor.onDidChangeCursorPosition((e: any) => {
        if (onCursorPositionChange) {
          onCursorPositionChange({
            line: e.position.lineNumber,
            column: e.position.column,
          })
        }
      })

      // Add context menu
      editor.addAction({
        id: "format-document",
        label: "Format Document",
        keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1.5,
        run: (ed: any) => {
          ed.getAction("editor.action.formatDocument").run()
        },
      })
    },
    [onCursorPositionChange],
  )

  useEffect(() => {
    if (editorRef.current && searchQuery) {
      const editor = editorRef.current
      const matches = editor.getModel().findMatches(searchQuery, false, true, false, false, true)

      const newDecorations = matches.map((match: any) => ({
        range: match.range,
        options: {
          inlineClassName: "my-highlight-class",
          hoverMessage: { value: "Search Result" },
        },
      }))

      decorations.current = editor.deltaDecorations(
        decorations.current,
        newDecorations,
      )
    } else if (editorRef.current && !searchQuery) {
      decorations.current = editorRef.current.deltaDecorations(decorations.current, [])
    }
  }, [searchQuery, value])

  useEffect(() => {
    if (triggerFormat && editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run()
      if (onFormatDone) {
        onFormatDone()
      }
    }
  }, [triggerFormat, onFormatDone])

  return (
    <div className="h-full w-full">
      <style jsx global>{`
        .my-highlight-class {
          background-color: rgba(255, 255, 0, 0.3);
        }
      `}</style>
      <Editor
        height="100%"
        language={languageMap[language]}
        value={value}
        onChange={handleEditorChange}
        theme={theme}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: fontSize,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: tabSize,
          wordWrap: wordWrap,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          glyphMargin: true,
          formatOnPaste: true,
          formatOnType: true,
          contextmenu: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
        }}
      />
    </div>
  )
}
