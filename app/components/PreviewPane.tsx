import React, { useRef, useEffect } from 'react';

interface PreviewPaneProps {
  htmlContent: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ htmlContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Create a safe HTML content that doesn't rely on localStorage
    const safeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            // Safe initialization without localStorage
            window.addEventListener('message', function(event) {
              if (event.data && event.data.type === 'updateContent') {
                document.body.innerHTML = event.data.content;
              }
            });
          </script>
        </body>
      </html>
    `;

    // Set the content
    iframe.srcdoc = safeHtml;
  }, [htmlContent]);

  return (
    <div className="w-full h-full bg-white">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        sandbox="allow-scripts"
        title="Preview"
      />
    </div>
  );
};

export default PreviewPane; 