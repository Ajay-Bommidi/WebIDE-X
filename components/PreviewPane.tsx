"use client"

import { useEffect, useRef, useState } from "react"
import { RefreshCw, AlertTriangle } from "lucide-react"

interface PreviewPaneProps {
  html: string
  css: string
  js: string
  onErrorsChange?: (errors: string[]) => void
}

export default function PreviewPane({ html, css, js, onErrorsChange }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const createSrcDoc = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>
        // Error handling
        window.addEventListener('error', function(e) {
            window.parent.postMessage({
                type: 'error',
                message: e.message,
                line: e.lineno,
                column: e.colno
            }, '*');
        });
        
        // Execute user JavaScript
        try {
            ${js}
        } catch (error) {
            window.parent.postMessage({
                type: 'error',
                message: error.message
            }, '*');
        }
    </script>
</body>
</html>`
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "error") {
        const errorMsg = event.data.line
          ? `Error at line ${event.data.line}, column ${event.data.column}: ${event.data.message}`
          : `Error: ${event.data.message}`

        setErrors((prev) => {
          const newErrors = [...prev.slice(-4), errorMsg]
          if (onErrorsChange) onErrorsChange(newErrors)
          return newErrors
        })
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onErrorsChange])

  useEffect(() => {
    setErrors([])
    if (onErrorsChange) onErrorsChange([])
  }, [html, css, js, onErrorsChange])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setErrors([])
    if (onErrorsChange) onErrorsChange([])

    if (iframeRef.current) {
      iframeRef.current.src = "about:blank"
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = createSrcDoc()
        }
        setIsRefreshing(false)
      }, 100)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <span className="text-sm font-medium text-gray-700">Live Preview</span>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-b border-red-200 p-2">
          <div className="flex items-center gap-1 text-red-700 text-xs font-medium mb-1">
            <AlertTriangle className="w-3 h-3" />
            JavaScript Errors:
          </div>
          {errors.map((error, index) => (
            <div key={index} className="text-xs text-red-600 font-mono">
              {error}
            </div>
          ))}
        </div>
      )}

      <iframe
        ref={iframeRef}
        srcDoc={createSrcDoc()}
        className="flex-1 w-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="Live Preview"
      />
    </div>
  )
}
