"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Shield,
  Target,
  BarChart3,
  PieChart,
  X,
} from "lucide-react"

interface ReportData {
  title: string
  date: string
  investigator: string
  summary: string
  insights: string[]
  recommendations: string[]
  keyFindings: string[]
  clientsAnalyzed: any[]
  totalExposure: number
  highRiskCount: number
  flaggedTransactions: number
}

interface InvestigationReportProps {
  data: ReportData
  onClose: () => void
}

export default function InvestigationReport({ data, onClose }: InvestigationReportProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const riskDistribution = {
    high: data.clientsAnalyzed.filter((c) => c.riskLevel === "high").length,
    medium: data.clientsAnalyzed.filter((c) => c.riskLevel === "medium").length,
    low: data.clientsAnalyzed.filter((c) => c.riskLevel === "low").length,
  }

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    const reportContent = document.getElementById("investigation-report")
    if (reportContent) {
      // Simulate PDF download
      const blob = new Blob([reportContent.innerHTML], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `AML_Investigation_Report_${data.date.replace(/\//g, "-")}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">AML Investigation Report</CardTitle>
                <p className="text-sm text-white/80">Comprehensive Risk Assessment & Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent id="investigation-report" className="p-8 space-y-8">
          {/* Executive Summary */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Executive Summary</h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                This investigation analyzed <strong>{data.clientsAnalyzed.length} high-priority clients</strong> with a
                combined transaction volume of <strong>{formatCurrency(data.totalExposure)}</strong>. Our analysis
                identified <strong>{data.highRiskCount} critical cases</strong> requiring immediate regulatory action,
                with <strong>{data.flaggedTransactions} flagged transactions</strong> showing patterns consistent with
                money laundering typologies. Immediate SAR filings are recommended for structuring and geographic
                anomaly cases.
              </p>
            </div>
          </div>

          {/* Key Metrics Dashboard */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">Investigation Metrics</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{data.highRiskCount}</div>
                  <div className="text-sm text-red-700">Critical Cases</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">{data.flaggedTransactions}</div>
                  <div className="text-sm text-amber-700">Flagged TXNs</div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(data.totalExposure)}</div>
                  <div className="text-sm text-emerald-700">Total Exposure</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.clientsAnalyzed.length}</div>
                  <div className="text-sm text-blue-700">Clients Analyzed</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Risk Distribution Chart */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-slate-900">Risk Distribution Analysis</h2>
            </div>
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                    {riskDistribution.high}
                  </div>
                  <div className="text-sm font-medium text-slate-700">High Risk</div>
                  <div className="text-xs text-slate-500">Immediate Action</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                    {riskDistribution.medium}
                  </div>
                  <div className="text-sm font-medium text-slate-700">Medium Risk</div>
                  <div className="text-xs text-slate-500">Monitor Closely</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                    {riskDistribution.low}
                  </div>
                  <div className="text-sm font-medium text-slate-700">Low Risk</div>
                  <div className="text-xs text-slate-500">Routine Review</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900">Critical Findings</h2>
            </div>
            <div className="space-y-3">
              {data.keyFindings.slice(0, 6).map((finding, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-700">{finding}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Client Risk Profiles */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-slate-900">High-Risk Client Profiles</h2>
            </div>
            <div className="space-y-4">
              {data.clientsAnalyzed
                .filter((c) => c.riskLevel === "high")
                .map((client, index) => (
                  <Card key={index} className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{client.clientName}</h3>
                          <p className="text-sm text-slate-600">
                            {client.clientId} • {client.country}
                          </p>
                        </div>
                        <Badge className="bg-red-100 text-red-800 border-red-300">{client.alertType}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Total Volume:</span>
                          <div className="font-semibold">{formatCurrency(client.totalAmount)}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Flagged TXNs:</span>
                          <div className="font-semibold text-red-600">{client.flaggedTransactions}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Last Activity:</span>
                          <div className="font-semibold">{client.lastActivity}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Regulatory Recommendations */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-slate-900">Regulatory Action Plan</h2>
            </div>
            <div className="space-y-3">
              {data.recommendations.slice(0, 5).map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{rec}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Priority: {index < 2 ? "Critical" : index < 4 ? "High" : "Medium"} • Timeline:{" "}
                      {index < 2 ? "24 hours" : index < 4 ? "72 hours" : "1 week"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investigation Timeline */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Next Steps & Timeline</h2>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Immediate (24h):</strong> File SARs for Marcus Rodriguez and Sarah Chen
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Short-term (72h):</strong> Enhanced due diligence on remaining high-risk accounts
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Medium-term (1 week):</strong> Implement enhanced monitoring protocols
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Ongoing:</strong> Monthly review of similar risk patterns
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Footer */}
          <Separator />
          <div className="text-center text-sm text-slate-500">
            <p>
              Report generated on {data.date} by {data.investigator}
            </p>
            <p className="mt-1">
              This report contains confidential information and should be handled according to AML compliance protocols.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
