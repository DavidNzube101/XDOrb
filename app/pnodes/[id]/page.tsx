"use client"

import { useState } from "react"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowLeft, Copy } from "lucide-react"

const historyData = [
  { timestamp: "00:00", latency: 45, uptime: 99.8, validations: 120 },
  { timestamp: "04:00", latency: 52, uptime: 99.6, validations: 145 },
  { timestamp: "08:00", latency: 38, uptime: 99.9, validations: 168 },
  { timestamp: "12:00", latency: 62, uptime: 99.2, validations: 132 },
  { timestamp: "16:00", latency: 48, uptime: 99.7, validations: 175 },
  { timestamp: "20:00", latency: 41, uptime: 99.95, validations: 189 },
]

interface PNodeDetailPageProps {
  params: {
    id: string
  }
}

export default function PNodeDetailPage({ params }: PNodeDetailPageProps) {
  const { data: node, isLoading } = useSWR(
    `/pnodes/${params.id}`,
    async () => {
      const result = await apiClient.getPNodeById(params.id)
      if (result.error) throw new Error(result.error)
      return result.data
    },
    { refreshInterval: 30000 },
  )

  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </DashboardLayout>
    )
  }

  if (!node) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Node not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <a href="/pnodes" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{node.name}</h1>
            <p className="text-muted-foreground">{node.location}</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    node.status === "active" ? "bg-green-500" : node.status === "warning" ? "bg-primary" : "bg-red-500"
                  }`}
                />
                <span className="font-semibold text-foreground capitalize">{node.status}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Uptime</p>
              <p className="text-2xl font-bold text-foreground">{node.uptime}%</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Latency</p>
              <p className="text-2xl font-bold text-foreground">{node.latency}ms</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Total Rewards</p>
              <p className="text-2xl font-bold text-primary">{node.rewards.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Latency Trend</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="timestamp" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Line type="monotone" dataKey="latency" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Uptime Trend</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="timestamp" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" domain={[95, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uptime"
                    stroke="var(--color-secondary)"
                    fill="var(--color-secondary)"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Node Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Node ID</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-muted rounded font-mono text-sm text-foreground break-all">
                      {node.id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(node.id)}
                      className="p-2 hover:bg-muted rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="text-foreground">{node.location}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Performance Score</p>
                  <p className="text-2xl font-bold text-primary">{node.performance}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Validations</p>
                  <p className="text-2xl font-bold text-foreground">{node.validations}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stake</p>
                  <p className="text-foreground">{node.stake} POL</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${
                          node.riskScore < 30 ? "bg-green-500" : node.riskScore < 70 ? "bg-primary" : "bg-red-500"
                        }`}
                        style={{ width: `${node.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{node.riskScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
