export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getRiskBadgeColor(risk: string): string {
  switch (risk) {
    case "high":
      return "bg-red-50 text-red-700 border border-red-200 shadow-sm"
    case "medium":
      return "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm"
    case "low":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
  }
}
