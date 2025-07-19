"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  X,
  Minimize2,
  Maximize2,
  Send,
  Search,
  Sparkles,
  MessageCircle,
  FileText,
  ExternalLink,
  Lightbulb,
  Target,
  RotateCcw,
  Expand,
  Shrink,
} from "lucide-react"
import type { Message, ClientNotification } from "@/lib/types"
import { applyFilter } from "@/lib/utils/filters"
import { generateAIResponse } from "@/lib/utils/ai-responses"
import { getContextualQueries } from "@/lib/utils/contextual-queries"

interface ChatInterfaceProps {
  messages: Message[]
  onAddMessage: (message: Message) => void
  onClearChat: () => void
  notifications: ClientNotification[]
  onFilterChange: (filtered: ClientNotification[]) => void
  onGenerateReport: () => string
  onOpenReport: (reportId: string) => void
  chatOpen: boolean
  onChatOpenChange: (open: boolean) => void
  isIntegrated: boolean
  onToggleIntegrated: () => void
}

export function ChatInterface({
  messages,
  onAddMessage,
  onClearChat,
  notifications,
  onFilterChange,
  onGenerateReport,
  onOpenReport,
  chatOpen,
  onChatOpenChange,
  isIntegrated,
  onToggleIntegrated,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatMinimized, setChatMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    onAddMessage(userMessage)
    const query = inputValue
    setInputValue("")
    setIsLoading(true)

    // Apply filter and update table
    const filtered = applyFilter(query, notifications)
    onFilterChange(filtered)

    // Simulate AI response with analysis
    setTimeout(() => {
      const response = generateAIResponse(query, filtered, notifications.length, onGenerateReport)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.content,
        timestamp: new Date(),
        appliedFilter: query,
        insights: response.insights,
        recommendations: response.recommendations,
        reportId: response.reportId,
        data: {
          totalRecords: filtered.length,
          highRisk: filtered.filter((n) => n.riskLevel === "high").length,
          mediumRisk: filtered.filter((n) => n.riskLevel === "medium").length,
          flaggedAmount: filtered
            .reduce((sum, n) => sum + n.totalAmount, 0)
            .toLocaleString("en-US", { style: "currency", currency: "USD" }),
          keyFindings: response.keyFindings || [],
        },
      }
      onAddMessage(aiResponse)
      setIsLoading(false)
    }, 1500)
  }

  const handleQuickQuery = (query: string) => {
    setInputValue(query)
    setTimeout(() => {
      handleSendMessage()
    }, 200)
  }

  const contextualQueries = getContextualQueries(messages, notifications)

  return (
    <>
      {/* Floating Chat Button */}
      {!chatOpen && !isIntegrated && (
        <Button
          onClick={() => onChatOpenChange(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-2xl shadow-violet-500/25 z-50 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Integrated Chat Mode */}
      {isIntegrated && (
        <Card className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-900/5 mb-8">
          <CardHeader className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-t-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Investigation Assistant</CardTitle>
                  <p className="text-sm text-white/80 font-normal">Natural language analysis & filtering</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={onClearChat} variant="ghost" size="sm" className="text-white hover:bg-white/20 px-3">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleIntegrated}
                  className="text-white hover:bg-white/20 px-3"
                >
                  <Shrink className="w-4 h-4 mr-2" />
                  Float
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-0 h-[500px]">
              {/* Messages Section */}
              <div className="border-r border-slate-200">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[90%] rounded-2xl p-3 ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                              : "bg-slate-50 text-slate-900 border border-slate-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

                          {/* Report Link */}
                          {message.reportId && (
                            <div className="mt-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                              <Button
                                onClick={() => onOpenReport(message.reportId!)}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 h-auto py-2"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                <span className="text-sm">📊 View Investigation Report</span>
                                <ExternalLink className="w-3 h-3 ml-auto" />
                              </Button>
                            </div>
                          )}

                          <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600">Analyzing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </div>

              {/* Insights & Controls Section */}
              <div className="flex flex-col">
                <div className="flex-1 p-4 bg-slate-50/30">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Investigation Insights</h3>
                  <div className="space-y-3">
                    {messages
                      .slice(-1)[0]
                      ?.insights?.slice(0, 3)
                      .map((insight, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-slate-600 leading-relaxed">{insight}</p>
                        </div>
                      ))}

                    {messages
                      .slice(-1)[0]
                      ?.recommendations?.slice(0, 2)
                      .map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Target className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-slate-600 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Input Section */}
                <div className="p-4 border-t border-slate-200 space-y-3">
                  {/* Show Report Generation Button only after 3 user interactions */}
                  {messages.filter((m) => m.type === "user").length >= 3 && (
                    <Button
                      onClick={() => handleQuickQuery("Generate comprehensive investigation report with findings")}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Investigation Report
                    </Button>
                  )}

                  {/* Input Field */}
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about specific clients or patterns..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="pl-10 border-slate-200 focus:border-violet-400 bg-white/80 text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                      disabled={isLoading}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Queries */}
                  <div className="bg-white/50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-3 h-3 text-violet-500" />
                      <p className="text-xs font-medium text-slate-600">Quick Queries:</p>
                    </div>
                    <div className="space-y-1 max-h-16 overflow-y-auto">
                      {contextualQueries.slice(0, 2).map((query, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickQuery(query)}
                          className="w-full justify-start text-xs text-slate-600 hover:text-violet-600 hover:bg-violet-100/50 h-auto py-1.5 px-2 text-left rounded-md"
                        >
                          <Brain className="w-3 h-3 mr-2 text-violet-500 flex-shrink-0" />
                          <span className="leading-tight break-words truncate">{query}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Chat Overlay */}
      {chatOpen && !isIntegrated && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="absolute inset-0" onClick={() => onChatOpenChange(false)} />
          <Card
            className={`relative bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl transition-all duration-300 ${
              chatMinimized ? "w-80 h-16" : "w-96 h-[600px]"
            }`}
          >
            <CardHeader className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-t-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  {!chatMinimized && (
                    <div>
                      <CardTitle className="text-lg">AI Investigation Assistant</CardTitle>
                      <p className="text-sm text-white/80 font-normal">Natural language analysis & filtering</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!chatMinimized && (
                    <Button
                      onClick={onClearChat}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 px-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleIntegrated}
                    className="text-white hover:bg-white/20 w-8 h-8 p-0"
                  >
                    <Expand className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setChatMinimized(!chatMinimized)}
                    className="text-white hover:bg-white/20 w-8 h-8 p-0"
                  >
                    {chatMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChatOpenChange(false)}
                    className="text-white hover:bg-white/20 w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!chatMinimized && (
              <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                              : "bg-slate-50 text-slate-900 border border-slate-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

                          {/* Report Link */}
                          {message.reportId && (
                            <div className="mt-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                              <Button
                                onClick={() => onOpenReport(message.reportId!)}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 h-auto py-2"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                <span className="text-sm">📊 View Investigation Report</span>
                                <ExternalLink className="w-3 h-3 ml-auto" />
                              </Button>
                            </div>
                          )}

                          {/* AI Insights */}
                          {message.insights && message.insights.length > 0 && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-900">Key Insights</span>
                              </div>
                              <ul className="space-y-1">
                                {message.insights.slice(0, 2).map((insight, index) => (
                                  <li key={index} className="text-xs text-blue-800 flex items-start">
                                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* AI Recommendations */}
                          {message.recommendations && message.recommendations.length > 0 && (
                            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <Target className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-semibold text-amber-900">Recommendations</span>
                              </div>
                              <ul className="space-y-1">
                                {message.recommendations.slice(0, 2).map((rec, index) => (
                                  <li key={index} className="text-xs text-amber-800 flex items-start">
                                    <span className="w-1 h-1 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Data Summary */}
                          {message.data && (
                            <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-emerald-700">Results:</span>
                                  <span className="font-semibold text-emerald-900">{message.data.totalRecords}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-emerald-700">High Risk:</span>
                                  <span className="font-semibold text-red-600">{message.data.highRisk}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600">Analyzing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input section */}
                <div className="flex-shrink-0">
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    {/* Show Report Generation Button only after 3 user interactions */}
                    {messages.filter((m) => m.type === "user").length >= 3 && (
                      <Button
                        onClick={() => handleQuickQuery("Generate comprehensive investigation report with findings")}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
                        size="sm"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Investigation Report
                      </Button>
                    )}

                    {/* Input Field */}
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Ask about specific clients or patterns..."
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="pl-10 border-slate-200 focus:border-violet-400 bg-white/80 text-sm"
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                        disabled={isLoading}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quick Queries */}
                    <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-3 h-3 text-violet-500" />
                        <p className="text-xs font-medium text-slate-600">Quick Investigation Queries:</p>
                      </div>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {contextualQueries.slice(0, 3).map((query, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuickQuery(query)}
                            className="w-full justify-start text-xs text-slate-600 hover:text-violet-600 hover:bg-violet-100/50 h-auto py-1.5 px-2 text-left rounded-md"
                          >
                            <Brain className="w-3 h-3 mr-2 text-violet-500 flex-shrink-0" />
                            <span className="leading-tight break-words">{query}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
