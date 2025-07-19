"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, DollarSign, Activity } from "lucide-react"
import type { ClientNotification } from "@/lib/types"
import { formatCurrency } from "@/lib/utils/formatting"

interface StatsGridProps {
  notifications: ClientNotification[]
  filteredNotifications: ClientNotification[]
}

export function StatsGrid({ notifications, filteredNotifications }: StatsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <Card className="bg-white/70 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-900/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Alerts</p>
              <p className="text-3xl font-bold text-slate-900">{filteredNotifications.length}</p>
              <p className="text-xs text-slate-500 mt-1">of {notifications.length} clients</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-900/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">High Risk</p>
              <p className="text-3xl font-bold text-red-600">
                {filteredNotifications.filter((n) => n.riskLevel === "high").length}
              </p>
              <p className="text-xs text-red-500 mt-1">Immediate attention</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-900/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Volume</p>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(filteredNotifications.reduce((sum, n) => sum + n.totalAmount, 0))}
              </p>
              <p className="text-xs text-slate-500 mt-1">Monitored transactions</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-900/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Flagged TXNs</p>
              <p className="text-3xl font-bold text-amber-600">
                {filteredNotifications.reduce((sum, n) => sum + n.flaggedTransactions, 0)}
              </p>
              <p className="text-xs text-amber-600 mt-1">Requires review</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
