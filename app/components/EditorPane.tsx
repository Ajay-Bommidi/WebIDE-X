import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface EditorPaneProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({ value, language, onChange }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default EditorPane; 