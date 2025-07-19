import type { Message, ClientNotification } from "../types"

export function getContextualQueries(messages: Message[], filteredNotifications: ClientNotification[]): string[] {
  const lastMessage = messages[messages.length - 1]
  const hasHighRiskFilter = filteredNotifications.some((n) => n.riskLevel === "high")
  const hasStructuringCases = filteredNotifications.some((n) => n.alertType.includes("Structuring"))
  const hasMarcus = filteredNotifications.some((n) => n.clientName.includes("Marcus"))
  const hasSarah = filteredNotifications.some((n) => n.clientName.includes("Sarah"))

  // Initial queries when no conversation has started
  if (messages.length <= 1) {
    return [
      "Show me all high-risk clients that need immediate attention",
      "What are the most suspicious patterns detected today?",
      "Display clients from high-risk jurisdictions",
      "Find cases with potential structuring activities",
    ]
  }

  // After showing high-risk clients
  if (lastMessage?.content.includes("high-risk") && hasHighRiskFilter) {
    return [
      "Focus on Marcus Rodriguez - analyze his structuring pattern",
      "What makes Sarah Chen's case geographically suspicious?",
      "Compare risk scores between these high-risk clients",
      "Show me the transaction timeline for these cases",
    ]
  }

  // After focusing on Marcus
  if (lastMessage?.content.includes("Marcus") && hasMarcus) {
    return [
      "What about Sarah Chen's geographic anomalies?",
      "Show me all structuring cases across the platform",
      "Calculate total exposure from Marcus's network",
      "Generate SAR filing recommendations for this case",
    ]
  }

  // After focusing on Sarah
  if (lastMessage?.content.includes("Sarah") && hasSarah) {
    return [
      "Compare Marcus and Sarah's money laundering techniques",
      "Show me other clients with Dubai connections",
      "Find patterns in offshore wire transfers",
      "What's the regulatory reporting timeline for these cases?",
    ]
  }

  // After structuring analysis
  if (lastMessage?.content.includes("structuring") && hasStructuringCases) {
    return [
      "Show me geographic distribution of these structured deposits",
      "Find other clients using similar branch-hopping patterns",
      "Calculate total structured amounts across all cases",
      "Generate compliance officer briefing summary",
    ]
  }

  // Advanced investigation queries
  if (messages.length > 5) {
    return [
      "Generate comprehensive investigation report with findings",
      "Create investigation priority matrix for all cases",
      "Show me network analysis of connected entities",
      "What's our total AML exposure across all jurisdictions?",
      "Identify emerging typologies from recent patterns",
    ]
  }

  // Default contextual queries based on current filter state
  if (filteredNotifications.length === 1) {
    const client = filteredNotifications[0]
    return [
      `Analyze ${client.clientName}'s complete transaction history`,
      `What are the red flags for ${client.clientName}?`,
      "Find similar patterns in other client accounts",
      "Generate detailed investigation report for this client",
    ]
  }

  // Fallback queries
  return [
    "Sort clients by risk score and transaction volume",
    "Show me cross-border transaction patterns",
    "Find clients with unusual velocity patterns",
    "Generate weekly AML monitoring summary",
  ]
}
