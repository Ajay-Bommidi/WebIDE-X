"use client"

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, Maximize2, Minimize2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PreviewPaneProps {
  html: string
  css: string
  js: string
  onErrorsChange: (errors: string[]) => void
}

export interface PreviewPaneRef {
  refresh: () => void;
}

const PreviewPane = forwardRef<PreviewPaneRef, PreviewPaneProps>(({ html, css, js, onErrorsChange }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const createPreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${css}
            /* Add some basic reset styles */
            body { margin: 0; padding: 0; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${html}
          <script>
            // Error handling
            window.onerror = function(message, source, lineno, colno, error) {
              window.parent.postMessage({
                type: 'error',
                error: message
              }, '*');
              return true;
            };

            // Execute user JavaScript
            try {
              ${js}
            } catch (error) {
              window.parent.postMessage({
                type: 'error',
                error: error.message
              }, '*');
            }
          </script>
        </body>
      </html>
    `
  }

  const refreshPreview = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      try {
        iframeRef.current.srcdoc = createPreviewContent()
        setHasErrors(false)
        setErrorMessage("")
        onErrorsChange([])
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error occurred"
        setHasErrors(true)
        setErrorMessage(errorMsg)
        onErrorsChange([errorMsg])
      }
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  // Expose refreshPreview function via ref
  useImperativeHandle(ref, () => ({
    refresh: refreshPreview,
  }));

  useEffect(() => {
    refreshPreview()
  }, [html, css, js])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'error') {
        setHasErrors(true)
        setErrorMessage(event.data.error)
        onErrorsChange([event.data.error])
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onErrorsChange])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative flex flex-col h-full bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-medium text-gray-700">Preview</h2>
          {hasErrors && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Error in preview</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshPreview}
            disabled={isLoading}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            title="Refresh Preview"
          >
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        <AnimatePresence>
          {hasErrors && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-2 left-2 right-2 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 z-10"
            >
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1 break-words">{errorMessage}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title="Preview"
          srcDoc={createPreviewContent()}
        />
      </div>
    </motion.div>
  )
})

export default PreviewPane;
