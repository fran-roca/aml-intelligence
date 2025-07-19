"use client"

import { useState } from "react"
import type { StoredReport, ReportData, Message, ClientNotification } from "@/lib/types"

export function useReports() {
  const [reportHistory, setReportHistory] = useState<StoredReport[]>([])
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)

  const generateInvestigationReport = (messages: Message[], filteredNotifications: ClientNotification[]): string => {
    const reportId = `report-${Date.now()}`
    const currentDate = new Date().toLocaleDateString()
    const reportData: ReportData = {
      id: reportId,
      title: "AML Investigation Report",
      date: currentDate,
      investigator: "AI Investigation Assistant",
      summary: messages
        .filter((m) => m.type === "ai")
        .map((m) => m.content)
        .join(" "),
      insights: messages.flatMap((m) => m.insights || []),
      recommendations: messages.flatMap((m) => m.recommendations || []),
      keyFindings: messages.flatMap((m) => m.data?.keyFindings || []),
      clientsAnalyzed: filteredNotifications,
      totalExposure: filteredNotifications.reduce((sum, n) => sum + n.totalAmount, 0),
      highRiskCount: filteredNotifications.filter((n) => n.riskLevel === "high").length,
      flaggedTransactions: filteredNotifications.reduce((sum, n) => sum + n.flaggedTransactions, 0),
    }

    // Store report in history
    const storedReport: StoredReport = {
      id: reportId,
      title: `AML Investigation Report - ${currentDate}`,
      date: currentDate,
      timestamp: new Date(),
      data: reportData,
    }

    setReportHistory((prev) => [storedReport, ...prev])
    setShowReport(true)
    setReportData(reportData)

    return reportId
  }

  const openStoredReport = (storedReport: StoredReport) => {
    setReportData(storedReport.data)
    setShowReport(true)
  }

  const openReportFromChat = (reportId: string) => {
    const storedReport = reportHistory.find((r) => r.id === reportId)
    if (storedReport) {
      openStoredReport(storedReport)
    }
  }

  const deleteReport = (reportId: string) => {
    setReportHistory((prev) => prev.filter((report) => report.id !== reportId))
  }

  const closeReport = () => {
    setShowReport(false)
    setReportData(null)
  }

  return {
    reportHistory,
    showReport,
    reportData,
    generateInvestigationReport,
    openStoredReport,
    openReportFromChat,
    deleteReport,
    closeReport,
  }
}
