"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Eye, Building, Globe, Calendar, MapPin, Plus, Brain, Expand } from "lucide-react"
import type { ClientNotification } from "@/lib/types"
import { formatCurrency, getRiskBadgeColor } from "@/lib/utils/formatting"

interface ClientTableProps {
  filteredNotifications: ClientNotification[]
  onStartNewChat: () => void
  onOpenChat: () => void
  onToggleIntegrated?: () => void
}

export function ClientTable({
  filteredNotifications,
  onStartNewChat,
  onOpenChat,
  onToggleIntegrated,
}: ClientTableProps) {
  const [selectedClient, setSelectedClient] = useState<ClientNotification | null>(null)

  return (
    <Card className="bg-white/70 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-900/5">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-900">Client Risk Notifications</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Comprehensive risk assessment and monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 font-medium">
              {filteredNotifications.length} clients
            </Badge>
            <Button
              onClick={onStartNewChat}
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/80 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            {onToggleIntegrated && (
              <Button
                onClick={onToggleIntegrated}
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/80 shadow-sm"
              >
                <Expand className="w-4 h-4 mr-2" />
                Integrated Chat
              </Button>
            )}
            <Button
              onClick={onOpenChat}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/80 border-b border-slate-100">
                <TableHead className="font-semibold text-slate-700 py-4">Client Information</TableHead>
                <TableHead className="font-semibold text-slate-700">Risk Assessment</TableHead>
                <TableHead className="font-semibold text-slate-700">Alert Details</TableHead>
                <TableHead className="font-semibold text-slate-700">Financial Summary</TableHead>
                <TableHead className="font-semibold text-slate-700">Geographic Data</TableHead>
                <TableHead className="font-semibold text-slate-700">Last Activity</TableHead>
                <TableHead className="font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow
                  key={notification.id}
                  className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors duration-200"
                >
                  <TableCell className="py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-700">
                          {notification.clientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{notification.clientName}</div>
                        <div className="text-sm text-slate-500">{notification.clientId}</div>
                        <div className="flex items-center mt-1">
                          <Building className="w-3 h-3 mr-1 text-slate-400" />
                          <span className="text-xs text-slate-500">{notification.accountType}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge className={getRiskBadgeColor(notification.riskLevel)}>
                        {notification.riskLevel.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-slate-500">{notification.flaggedTransactions} flagged</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="text-sm font-medium text-slate-900">{notification.alertType}</span>
                      <div className="text-xs text-slate-500 mt-1">Pattern detected</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-semibold text-slate-900">{formatCurrency(notification.totalAmount)}</span>
                      <div className="text-xs text-slate-500 mt-1">{notification.totalTransactions} transactions</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{notification.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{notification.lastActivity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/80 shadow-sm"
                          onClick={() => setSelectedClient(notification)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Explore
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-3 text-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span>Transaction Analysis - {notification.clientName}</span>
                              <DialogDescription className="mt-1">
                                Comprehensive transaction history and risk assessment for {notification.clientId}
                              </DialogDescription>
                            </div>
                          </DialogTitle>
                        </DialogHeader>

                        {selectedClient && (
                          <div className="space-y-6 mt-6">
                            {/* Client Summary Cards */}
                            <div className="grid grid-cols-4 gap-4">
                              <Card className="bg-slate-50/50 border-slate-200">
                                <CardContent className="p-4">
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600 mb-2">Risk Level</p>
                                    <Badge className={getRiskBadgeColor(selectedClient.riskLevel)}>
                                      {selectedClient.riskLevel.toUpperCase()}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-slate-50/50 border-slate-200">
                                <CardContent className="p-4">
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600 mb-2">Total Volume</p>
                                    <p className="text-lg font-bold text-slate-900">
                                      {formatCurrency(selectedClient.totalAmount)}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-slate-50/50 border-slate-200">
                                <CardContent className="p-4">
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600 mb-2">Alert Type</p>
                                    <p className="text-sm font-medium text-red-600">{selectedClient.alertType}</p>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-slate-50/50 border-slate-200">
                                <CardContent className="p-4">
                                  <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600 mb-2">Flagged</p>
                                    <p className="text-lg font-bold text-amber-600">
                                      {selectedClient.flaggedTransactions}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Transactions Table */}
                            <Card className="bg-white border-slate-200">
                              <CardHeader>
                                <CardTitle className="text-lg">Transaction History</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-50">
                                      <TableHead>Date</TableHead>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Location</TableHead>
                                      <TableHead>Risk Score</TableHead>
                                      <TableHead>Description</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedClient.transactions.map((txn) => (
                                      <TableRow key={txn.id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium">{txn.date}</TableCell>
                                        <TableCell className="font-semibold">{formatCurrency(txn.amount)}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline" className="text-xs">
                                            {txn.type}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                            {txn.location}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            className={
                                              txn.riskScore >= 8
                                                ? "bg-red-50 text-red-700 border-red-200"
                                                : txn.riskScore >= 6
                                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            }
                                          >
                                            {txn.riskScore}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600 max-w-xs truncate">
                                          {txn.description}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
