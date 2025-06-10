"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hi! I'm your AI coding assistant. Type `/` to get started or ask me anything about your code!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      let aiContent = ""
      if (input.toLowerCase().includes("explain this code")) {
        aiContent = "To explain this code, I would need access to the current active file's content. Please provide the code you'd like me to explain."
      } else if (input.toLowerCase().includes("fix bugs")) {
        aiContent = "To fix bugs, I'd need to analyze your code and any error messages. Please provide the code and the bug details."
      } else if (input.toLowerCase().includes("optimize performance")) {
        aiContent = "For performance optimization, I would typically look for inefficient algorithms, redundant computations, or large resource usage. Please share the code you want to optimize."
      } else if (input.toLowerCase().includes("add comments")) {
        aiContent = "To add comments, I would need the code you wish to document. Please provide the code, and I can add appropriate comments."
      } else if (input.toLowerCase().includes("convert to react")) {
        aiContent = "Converting to React involves breaking down UI into components and managing state. Please provide the HTML/CSS/JS you want to convert."
      } else {
        aiContent = `I received your message: "${input}". How else can I assist you today?`
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const quickActions = ["Explain this code", "Fix bugs", "Optimize performance", "Add comments", "Convert to React"]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-2 border-b border-gray-700">
        <Bot className="w-4 h-4 mr-2 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">AI ASSISTANT</span>
        <Sparkles className="w-4 h-4 ml-auto text-yellow-400" />
      </div>

      {/* Quick Actions */}
      <div className="p-2 border-b border-gray-700">
        <div className="text-xs text-gray-400 mb-2">Quick Actions:</div>
        <div className="flex flex-wrap gap-1">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => setInput(action)}
              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              {message.type === "user" ? (
                <User className="w-4 h-4 text-green-400" />
              ) : (
                <Bot className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">{message.type === "user" ? "You" : "AI Assistant"}</div>
              <div className="text-sm text-gray-300 bg-gray-700 rounded p-2">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-2">
            <Bot className="w-4 h-4 text-blue-400" />
            <div className="text-sm text-gray-400">AI is thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI anything..."
            className="flex-1 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <Button onClick={handleSend} size="sm" disabled={!input.trim() || isLoading}>
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
