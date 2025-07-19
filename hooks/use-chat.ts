"use client"

import { useState, useEffect } from "react"
import type { Message, ChatSession } from "@/lib/types"
import { INITIAL_AI_MESSAGE } from "@/lib/constants"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_AI_MESSAGE])
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  // Save current chat to history
  const saveCurrentChat = () => {
    if (messages.length <= 1) return // Don't save if only welcome message

    const lastUserMessage = messages.filter((m) => m.type === "user").pop()
    const chatTitle = lastUserMessage
      ? lastUserMessage.content.slice(0, 50) + (lastUserMessage.content.length > 50 ? "..." : "")
      : "New Investigation"

    const chatSession: ChatSession = {
      id: currentChatId || `chat-${Date.now()}`,
      title: chatTitle,
      timestamp: new Date(),
      messages: [...messages],
      lastMessage: messages[messages.length - 1]?.content.slice(0, 100) + "..." || "",
    }

    setChatHistory((prev) => {
      const existingIndex = prev.findIndex((chat) => chat.id === chatSession.id)
      if (existingIndex >= 0) {
        // Update existing chat
        const updated = [...prev]
        updated[existingIndex] = chatSession
        return updated
      } else {
        // Add new chat
        return [chatSession, ...prev]
      }
    })

    if (!currentChatId) {
      setCurrentChatId(chatSession.id)
    }
  }

  // Auto-save chat when messages change
  useEffect(() => {
    if (messages.length > 1) {
      const timeoutId = setTimeout(() => {
        saveCurrentChat()
      }, 1000) // Save after 1 second of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [messages])

  // Load a chat session
  const loadChatSession = (chatSession: ChatSession) => {
    setMessages(chatSession.messages)
    setCurrentChatId(chatSession.id)
  }

  // Start a new chat
  const startNewChat = () => {
    setMessages([INITIAL_AI_MESSAGE])
    setCurrentChatId(null)
  }

  // Delete a chat session
  const deleteChatSession = (chatId: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId))
    if (currentChatId === chatId) {
      startNewChat()
    }
  }

  const clearChat = () => {
    setMessages([INITIAL_AI_MESSAGE])
  }

  // Add message
  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  return {
    messages,
    setMessages,
    chatHistory,
    currentChatId,
    loadChatSession,
    startNewChat,
    deleteChatSession,
    addMessage,
    clearChat,
  }
}
