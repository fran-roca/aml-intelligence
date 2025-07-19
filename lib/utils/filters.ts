import type { ClientNotification } from "../types"

export function applyFilter(query: string, notifications: ClientNotification[]): ClientNotification[] {
  let filtered = [...notifications]

  // Risk level filters
  if (query.toLowerCase().includes("high-risk") || query.toLowerCase().includes("high risk")) {
    filtered = filtered.filter((n) => n.riskLevel === "high")
  }
  if (query.toLowerCase().includes("medium-risk") || query.toLowerCase().includes("medium risk")) {
    filtered = filtered.filter((n) => n.riskLevel === "medium")
  }
  if (query.toLowerCase().includes("low-risk") || query.toLowerCase().includes("low risk")) {
    filtered = filtered.filter((n) => n.riskLevel === "low")
  }

  // Specific client filters
  if (query.toLowerCase().includes("marcus rodriguez") || query.toLowerCase().includes("marcus")) {
    filtered = filtered.filter((n) => n.clientName.toLowerCase().includes("marcus"))
  }
  if (query.toLowerCase().includes("sarah chen") || query.toLowerCase().includes("sarah")) {
    filtered = filtered.filter((n) => n.clientName.toLowerCase().includes("sarah"))
  }
  if (query.toLowerCase().includes("ahmed") || query.toLowerCase().includes("al-rashid")) {
    filtered = filtered.filter((n) => n.clientName.toLowerCase().includes("ahmed"))
  }

  // Country filters
  const countries = ["panama", "singapore", "uae", "russia", "united states"]
  countries.forEach((country) => {
    if (query.toLowerCase().includes(country)) {
      filtered = filtered.filter((n) => n.country.toLowerCase().includes(country))
    }
  })

  // Pattern-based filters
  if (query.toLowerCase().includes("structuring")) {
    filtered = filtered.filter((n) => n.alertType.toLowerCase().includes("structuring"))
  }
  if (query.toLowerCase().includes("geographic") || query.toLowerCase().includes("geographical")) {
    filtered = filtered.filter((n) => n.alertType.toLowerCase().includes("geographic"))
  }
  if (query.toLowerCase().includes("velocity") || query.toLowerCase().includes("unusual")) {
    filtered = filtered.filter(
      (n) => n.alertType.toLowerCase().includes("velocity") || n.alertType.toLowerCase().includes("unusual"),
    )
  }
  if (query.toLowerCase().includes("pep")) {
    filtered = filtered.filter((n) => n.alertType.toLowerCase().includes("pep"))
  }

  // Amount filters
  if (query.toLowerCase().includes("more than") && query.toLowerCase().includes("million")) {
    const match = query.match(/more than (\d+) million/)
    if (match) {
      const amount = Number.parseInt(match[1]) * 1000000
      filtered = filtered.filter((n) => n.totalAmount > amount)
    }
  }

  // Flagged transactions filter
  if (query.toLowerCase().includes("flagged transactions")) {
    const match = query.match(/more than (\d+) flagged/)
    if (match) {
      const count = Number.parseInt(match[1])
      filtered = filtered.filter((n) => n.flaggedTransactions > count)
    }
  }

  // Sorting
  if (query.toLowerCase().includes("sort by amount") && query.toLowerCase().includes("descending")) {
    filtered.sort((a, b) => b.totalAmount - a.totalAmount)
  }
  if (query.toLowerCase().includes("sort by amount") && query.toLowerCase().includes("ascending")) {
    filtered.sort((a, b) => a.totalAmount - b.totalAmount)
  }
  if (query.toLowerCase().includes("sort by risk")) {
    const riskOrder = { high: 3, medium: 2, low: 1 }
    filtered.sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel])
  }
  if (query.toLowerCase().includes("sort by name")) {
    filtered.sort((a, b) => a.clientName.localeCompare(b.clientName))
  }

  return filtered
}
