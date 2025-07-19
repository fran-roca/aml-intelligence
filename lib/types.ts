export interface Transaction {
  id: string
  date: string
  amount: number
  type: string
  location: string
  description: string
  riskScore: number
}

export interface ClientNotification {
  id: string
  clientId: string
  clientName: string
  riskLevel: "high" | "medium" | "low"
  totalTransactions: number
  totalAmount: number
  flaggedTransactions: number
  lastActivity: string
  alertType: string
  country: string
  accountType: string
  transactions: Transaction[]
}

export interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  appliedFilter?: string
  insights?: string[]
  recommendations?: string[]
  reportId?: string
  data?: {
    totalRecords: number
    highRisk: number
    mediumRisk: number
    flaggedAmount: string
    keyFindings: string[]
  }
}

export interface StoredReport {
  id: string
  title: string
  date: string
  timestamp: Date
  data: ReportData
}

export interface ChatSession {
  id: string
  title: string
  timestamp: Date
  messages: Message[]
  lastMessage: string
}

export interface ReportData {
  id: string
  title: string
  date: string
  investigator: string
  summary: string
  insights: string[]
  recommendations: string[]
  keyFindings: string[]
  clientsAnalyzed: ClientNotification[]
  totalExposure: number
  highRiskCount: number
  flaggedTransactions: number
}
