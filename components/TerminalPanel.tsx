"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Trash2 } from "lucide-react"

interface TerminalPanelProps {
  isVisible: boolean
  onToggle: () => void
  logs: string[]
  onClearLogs: () => void
  fontFamily?: string
}

export default function TerminalPanel({ isVisible, onToggle, logs, onClearLogs, fontFamily }: TerminalPanelProps) {
  const [activeTab, setActiveTab] = useState("console")
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: "console", label: "Console" },
    { id: "output", label: "Output" },
    { id: "terminal", label: "Terminal" },
  ]

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs, history])

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    const newEntry = `> ${command}`
    setHistory((prev) => [...prev, newEntry])

    // Simple command simulation
    if (command === "clear") {
      setHistory([])
      onClearLogs()
    } else if (command === "help") {
      setHistory((prev) => [
        ...prev,
        "Available commands:",
        "  clear - Clear terminal",
        "  help - Show this help",
        "  ls - List files",
      ])
    } else if (command === "ls") {
      setHistory((prev) => [...prev, "index.html  style.css  script.js"])
    } else {
      setHistory((prev) => [...prev, `Command not found: ${command}`])
    }

    setCommand("")
  }

  if (!isVisible) return null

  const renderTabContent = () => {
    switch (activeTab) {
      case "console":
        return (
          <div className="h-full flex flex-col">
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-2 font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-300 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )
      case "terminal":
        return (
          <div className="h-full flex flex-col">
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-2 font-mono text-sm" style={{ fontFamily: fontFamily }}>
              {history.map((entry, index) => (
                <div key={index} className="text-gray-300 mb-1">
                  {entry}
                </div>
              ))}
            </div>
            <form onSubmit={handleCommand} className="border-t border-gray-700 p-2">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 bg-transparent text-gray-300 outline-none font-mono"
                  placeholder="Type a command..."
                />
              </div>
            </form>
          </div>
        )
      default:
        return (
          <div className="p-4 text-gray-400 text-sm">
            <p>Output panel - Build and run logs will appear here</p>
          </div>
        )
    }
  }

  return (
    <div className="h-64 bg-gray-900 border-t border-gray-700 flex flex-col">
      {/* Tab Bar */}
      <div className="flex items-center justify-between bg-gray-800 border-b border-gray-700">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm border-r border-gray-700 ${
                activeTab === tab.id ? "bg-gray-900 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 px-2">
          <button onClick={onClearLogs} className="p-1 hover:bg-gray-700 rounded" title="Clear">
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={onToggle} className="p-1 hover:bg-gray-700 rounded" title="Close">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">{renderTabContent()}</div>
    </div>
  )
}
