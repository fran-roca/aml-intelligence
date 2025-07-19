import type { ClientNotification } from "../types"

export interface InvestigativeInsights {
  insights: string[]
  recommendations: string[]
  keyFindings: string[]
}

export function generateInvestigativeInsights(query: string, filtered: ClientNotification[]): InvestigativeInsights {
  const insights: string[] = []
  const recommendations: string[] = []
  const keyFindings: string[] = []

  if (query.toLowerCase().includes("high-risk") || query.toLowerCase().includes("high risk")) {
    insights.push("High-risk clients show patterns consistent with money laundering typologies")
    insights.push("Focus on transaction timing, amounts just below reporting thresholds")
    insights.push("Cross-reference with known shell companies and PEP databases")
    recommendations.push("Prioritize cases with multiple red flags within 48 hours")
    recommendations.push("File Suspicious Activity Reports (SARs) for critical cases")
    keyFindings.push("2 clients show classic structuring patterns")
    keyFindings.push("Geographic clustering in high-risk jurisdictions detected")
  }

  if (query.toLowerCase().includes("marcus")) {
    insights.push("Deposits structured to avoid Currency Transaction Report (CTR) filing")
    insights.push("Geographic distribution across multiple branches indicates sophistication")
    insights.push("Shell company connection adds layering complexity")
    insights.push("Timing pattern suggests coordinated activity rather than coincidence")
    recommendations.push("Immediate SAR filing - clear structuring violation under 31 USC 5324")
    recommendations.push("Request branch surveillance footage for the deposit dates")
    recommendations.push("Investigate Shell Company Ltd for beneficial ownership")
    keyFindings.push("3 structured deposits totaling $29,450 in 2 days")
    keyFindings.push("All deposits below $10,000 CTR threshold")
    keyFindings.push("Multiple branch locations used")
  }

  if (query.toLowerCase().includes("sarah")) {
    insights.push("Rapid geographic movement between high-risk jurisdictions")
    insights.push("Offshore wire transfer followed by large cash withdrawal")
    insights.push("Transaction pattern inconsistent with personal account usage")
    insights.push("Dubai classified as enhanced due diligence jurisdiction")
    recommendations.push("Verify travel records for physical presence confirmation")
    recommendations.push("Request documentation for offshore account relationship")
    recommendations.push("Check Dubai ATM withdrawal against local surveillance")
    keyFindings.push("$77,000 in suspicious cross-border transactions")
    keyFindings.push("Cross-border movement between Singapore and Dubai")
    keyFindings.push("Offshore banking relationship")
  }

  if (query.toLowerCase().includes("structuring")) {
    insights.push("Classic structuring pattern: Multiple transactions just below $10K threshold")
    insights.push("Timing analysis shows coordinated deposit strategy")
    insights.push("Same-day deposits across multiple branches indicate intent to evade reporting")
    recommendations.push("File Suspicious Activity Report (SAR) immediately")
    recommendations.push("Freeze account pending investigation")
    keyFindings.push("Pattern consistent with currency transaction report avoidance")
    keyFindings.push("Sophisticated evasion techniques employed")
  }

  if (query.toLowerCase().includes("geographic") || query.toLowerCase().includes("geographical")) {
    insights.push("Geographic anomalies suggest potential trade-based money laundering")
    insights.push("Unusual transaction corridors may indicate hawala or alternative remittance")
    insights.push("Cross-border patterns inconsistent with declared business activities")
    recommendations.push("Verify trade documentation and shipping records")
    recommendations.push("Coordinate with international FIU counterparts")
    keyFindings.push("Transactions span multiple high-risk jurisdictions")
    keyFindings.push("No apparent business justification for geographic spread")
  }

  if (query.toLowerCase().includes("sort by amount")) {
    insights.push("Prioritize high-value accounts for investigation")
    insights.push("Large volumes may indicate professional money laundering services")
    insights.push("Transaction amounts suggest institutional-level operations")
    recommendations.push("Focus resources on top 3 highest-value cases")
    recommendations.push("Coordinate with law enforcement for large-scale operations")
    keyFindings.push("Significant concentration of risk in high-value accounts")
    keyFindings.push("Professional money laundering indicators present")
  }

  return { insights, recommendations, keyFindings }
}
