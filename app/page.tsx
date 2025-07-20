"use client"

import { useState } from "react"
import { MOCK_NOTIFICATIONS } from "@/lib/constants"
import type { ClientNotification } from "@/lib/types"
import { useChat } from "@/hooks/use-chat"
import { useReports } from "@/hooks/use-reports"
import { AppHeader } from "@/components/header/app-header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { ClientTable } from "@/components/dashboard/client-table"
import { ChatInterface } from "@/components/chat/chat-interface"
import InvestigationReport from "@/components/investigation-report"

export default function AMLDemoPage() {
  const [notifications] = useState<ClientNotification[]>(MOCK_NOTIFICATIONS)
  const [filteredNotifications, setFilteredNotifications] = useState<ClientNotification[]>(MOCK_NOTIFICATIONS)
  const [chatOpen, setChatOpen] = useState(false)
  const [isIntegrated, setIsIntegrated] = useState(false)

  const { messages, chatHistory, loadChatSession, startNewChat, deleteChatSession, addMessage, clearChat } = useChat()

  const {
    reportHistory,
    showReport,
    reportData,
    generateInvestigationReport,
    openStoredReport,
    openReportFromChat,
    deleteReport,
    closeReport,
  } = useReports()

  const handleStartNewChat = () => {
    startNewChat()
    setFilteredNotifications(notifications) // Reset filters
    setChatOpen(true)
  }

  const handleGenerateReport = () => {
    return generateInvestigationReport(messages, filteredNotifications)
  }

  const handleToggleIntegrated = () => {
    setIsIntegrated(!isIntegrated)
    if (!isIntegrated) {
      setChatOpen(false) // Close floating when switching to integrated
    } else {
      setChatOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <AppHeader
        chatHistory={chatHistory}
        reportHistory={reportHistory}
        onStartNewChat={handleStartNewChat}
        onLoadChatSession={(session) => {
          loadChatSession(session)
          setChatOpen(true)
        }}
        onDeleteChatSession={deleteChatSession}
        onOpenStoredReport={openStoredReport}
        onDeleteReport={deleteReport}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <StatsGrid notifications={notifications} filteredNotifications={filteredNotifications} />

        <ClientTable
          filteredNotifications={filteredNotifications}
          onStartNewChat={handleStartNewChat}
          onOpenChat={() => setChatOpen(true)}
          onToggleIntegrated={handleToggleIntegrated}
        />

        <ChatInterface
            messages={messages}
            onAddMessage={addMessage}
            onClearChat={clearChat}
            notifications={notifications}
            onFilterChange={setFilteredNotifications}
            onGenerateReport={handleGenerateReport}
            onOpenReport={openReportFromChat}
            chatOpen={chatOpen}
            onChatOpenChange={setChatOpen}
            isIntegrated={isIntegrated}
            onToggleIntegrated={handleToggleIntegrated}
        />
      </div>

      {showReport && reportData && <InvestigationReport data={reportData} onClose={closeReport} />}
    </div>
  )
}
