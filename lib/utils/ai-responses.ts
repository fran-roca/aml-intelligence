import type { ClientNotification } from "../types"
import { generateInvestigativeInsights } from "./ai-insights"

export interface AIResponse {
  content: string
  insights: string[]
  recommendations: string[]
  keyFindings: string[]
  reportId?: string
}

export function generateAIResponse(
  query: string,
  filtered: ClientNotification[],
  originalCount: number,
  generateReport?: () => string,
): AIResponse {
  const filteredCount = filtered.length
  const { insights, recommendations, keyFindings } = generateInvestigativeInsights(query, filtered)

  if (query.toLowerCase().includes("generate") && query.toLowerCase().includes("report") && generateReport) {
    const reportId = generateReport()
    return {
      content: `✅ **Investigation Report Generated Successfully**\n\nComprehensive AML investigation report has been created based on our analysis of ${filteredCount} clients. The report includes executive summary, detailed findings, risk assessment, and regulatory recommendations.\n\n📊 **Report Contents:**\n• Executive summary with key metrics\n• Risk distribution analysis\n• Critical findings and evidence\n• Regulatory action plan\n• Client risk profiles\n\n*The report is now available in your Reports history and will remain accessible for future reference.*`,
      insights: [
        "Compiling investigation timeline and key evidence",
        "Analyzing risk patterns across all reviewed cases",
        "Preparing regulatory compliance recommendations",
      ],
      recommendations: [
        "Report includes SAR filing priorities",
        "Executive briefing materials included",
        "Regulatory timeline and next steps outlined",
      ],
      keyFindings: [
        `${filteredCount} clients analyzed with comprehensive risk assessment`,
        "Professional-grade investigation documentation prepared",
      ],
      reportId: reportId,
    }
  }

  if (filteredCount === 0) {
    return {
      content: `No clients match your criteria "${query}". This could indicate either effective risk management or the need to broaden search parameters. Consider checking historical data or adjusting risk thresholds.`,
      insights: [
        "No matches found - consider expanding search criteria",
        "Review historical patterns for similar cases",
      ],
      recommendations: ["Broaden geographic or time-based filters", "Check archived cases for pattern analysis"],
      keyFindings: ["No current matches", "May need broader search parameters"],
    }
  }

  if (query.toLowerCase().includes("high-risk") || query.toLowerCase().includes("high risk")) {
    return {
      content: `Found ${filteredCount} high-risk clients requiring immediate attention. These cases show multiple red flags including structuring patterns and geographic anomalies. Marcus Rodriguez (Panama) shows classic structuring with $29,450 in deposits just below reporting thresholds, while Sarah Chen (Singapore) has suspicious offshore wire transfers totaling $77,000.`,
      insights,
      recommendations,
      keyFindings,
    }
  }

  if (query.toLowerCase().includes("marcus")) {
    return {
      content: `Marcus Rodriguez shows textbook structuring evidence: 3 cash deposits on consecutive days (Jan 18-19) totaling $29,450 - all just below the $10,000 CTR threshold. Deposits made at different branches (401, 402) in Panama City and Colon, suggesting deliberate geographic distribution to avoid detection. The amounts ($9,800, $9,750, $9,900) appear calculated to stay under reporting requirements.`,
      insights,
      recommendations,
      keyFindings,
    }
  }

  if (query.toLowerCase().includes("sarah")) {
    return {
      content: `Sarah Chen's case involves geographic anomalies and offshore banking red flags. She made a $45,000 wire transfer to an offshore account from Singapore, followed by a $32,000 ATM withdrawal in Dubai - a high-risk jurisdiction. The rapid movement between Singapore and UAE, combined with offshore transfers, suggests potential layering in a money laundering scheme.`,
      insights,
      recommendations,
      keyFindings,
    }
  }

  if (query.toLowerCase().includes("structuring")) {
    return {
      content: `Located ${filteredCount} clients with potential structuring activities. This is a high-priority money laundering indicator requiring immediate SAR filing. The pattern shows deliberate attempts to evade currency transaction reporting requirements through calculated deposit amounts and geographic distribution.`,
      insights,
      recommendations,
      keyFindings,
    }
  }

  if (query.toLowerCase().includes("geographic") || query.toLowerCase().includes("geographical")) {
    return {
      content: `Identified ${filteredCount} clients with geographic anomalies. These cases involve suspicious cross-border transaction patterns that may indicate trade-based money laundering or alternative remittance systems. Enhanced due diligence is required for these high-risk jurisdiction connections.`,
      insights,
      recommendations,
      keyFindings,
    }
  }

  if (query.toLowerCase().includes("sort by amount")) {
    return {
      content: `Table sorted by transaction amount successfully showing ${filteredCount} clients. Review the highest-value accounts first as they pose the greatest institutional risk. Large transaction volumes combined with risk indicators suggest sophisticated money laundering operations requiring priority investigation.`,
      insights,
      recommendations,
      keyFindings,
    }
  }

  if (query.toLowerCase().includes("panama") || query.toLowerCase().includes("singapore")) {
    return {
      content: `Identified ${filteredCount} clients from high-risk jurisdictions. These accounts require enhanced due diligence due to jurisdiction-specific money laundering risks. Total exposure: ${filtered.reduce((sum, n) => sum + n.totalAmount, 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}. Focus on beneficial ownership verification and transaction purpose documentation.`,
      insights,
      recommendations,
      keyFindings,
    }
  }

  return {
    content: `Analysis complete: Found ${filteredCount} clients matching your criteria out of ${originalCount} total notifications. The filtered results show patterns that warrant further investigation based on established AML typologies.`,
    insights:
      insights.length > 0
        ? insights
        : ["Multiple risk indicators present", "Pattern analysis suggests coordinated activity"],
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ["Prioritize cases by risk score", "Document findings for regulatory reporting"],
    keyFindings:
      keyFindings.length > 0 ? keyFindings : ["Risk patterns identified", "Further investigation recommended"],
  }
}
