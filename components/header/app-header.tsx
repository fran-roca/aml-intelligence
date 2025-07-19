"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CreditCard, MessageSquare, History, BarChart3, Plus, Trash2, ExternalLink, FileText } from "lucide-react"
import type { ChatSession, StoredReport } from "@/lib/types"

interface AppHeaderProps {
  chatHistory: ChatSession[]
  reportHistory: StoredReport[]
  onStartNewChat: () => void
  onLoadChatSession: (session: ChatSession) => void
  onDeleteChatSession: (chatId: string) => void
  onOpenStoredReport: (report: StoredReport) => void
  onDeleteReport: (reportId: string) => void
}

export function AppHeader({
  chatHistory,
  reportHistory,
  onStartNewChat,
  onLoadChatSession,
  onDeleteChatSession,
  onOpenStoredReport,
  onDeleteReport,
}: AppHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  AML Intelligence
                </h1>
                <p className="text-sm text-slate-500 font-medium">Anti-Money Laundering Platform</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              Live Monitoring
            </Badge>

            {/* Chat History Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/50 backdrop-blur-sm shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chats
                  {chatHistory.length > 0 && (
                    <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5">
                      {chatHistory.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat History
                  </div>
                  <Button onClick={onStartNewChat} variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    New
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {chatHistory.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No chat history yet.
                    <br />
                    Start a conversation with the AI assistant.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {chatHistory.map((chat) => (
                      <div key={chat.id} className="flex items-center group">
                        <DropdownMenuItem
                          onClick={() => onLoadChatSession(chat)}
                          className="flex-1 flex flex-col items-start p-3 cursor-pointer hover:bg-slate-50"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-sm text-slate-900 truncate">{chat.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 ml-2 flex-shrink-0" />
                          </div>
                          <span className="text-xs text-slate-500 mt-1 line-clamp-2">{chat.lastMessage}</span>
                          <span className="text-xs text-slate-400 mt-1">{chat.timestamp.toLocaleString()}</span>
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 mr-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this chat? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteChatSession(chat.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reports History Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/50 backdrop-blur-sm shadow-sm"
                >
                  <History className="w-4 h-4 mr-2" />
                  Reports
                  {reportHistory.length > 0 && (
                    <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5">
                      {reportHistory.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Investigation Reports History
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {reportHistory.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No reports generated yet.
                    <br />
                    Use the AI assistant to generate investigation reports.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {reportHistory.map((report) => (
                      <div key={report.id} className="flex items-center group">
                        <DropdownMenuItem
                          onClick={() => onOpenStoredReport(report)}
                          className="flex-1 flex flex-col items-start p-3 cursor-pointer hover:bg-slate-50"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-sm text-slate-900">{report.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 ml-2 flex-shrink-0" />
                          </div>
                          <span className="text-xs text-slate-500 mt-1">
                            Generated: {report.timestamp.toLocaleString()}
                          </span>
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 mr-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this investigation report? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteReport(report.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/50 backdrop-blur-sm shadow-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
