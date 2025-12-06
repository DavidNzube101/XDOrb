"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StorageVisualization } from "@/components/storage-visualization"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const performanceData = [
  { month: "Jan", validation: 4000, rewards: 2400, latency: 240 },
  { month: "Feb", validation: 3000, rewards: 1398, latency: 221 },
  { month: "Mar", validation: 2000, rewards: 9800, latency: 229 },
  { month: "Apr", validation: 2780, rewards: 3908, latency: 200 },
  { month: "May", validation: 1890, rewards: 4800, latency: 221 },
  { month: "Jun", validation: 2390, rewards: 3800, latency: 250 },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">XDOrb Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into network performance metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Monthly Validation Trend</CardTitle>
              <CardDescription>Transaction validation volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Line type="monotone" dataKey="validation" stroke="var(--color-primary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
              <CardDescription>Rewards vs Latency over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="rewards" fill="var(--color-primary)" />
                  <Bar dataKey="latency" fill="var(--color-secondary)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <StorageVisualization />

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>AI-generated network analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <p className="font-semibold text-foreground mb-1">Peak Performance</p>
                <p className="text-sm text-foreground">
                  Network validated 12,500 transactions in March with 23% higher throughput than average.
                </p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                <p className="font-semibold text-foreground mb-1">Optimization Opportunity</p>
                <p className="text-sm text-foreground">
                  Average latency increased 15% in June. Consider geographic node rebalancing.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-1">Growth Trend</p>
                <p className="text-sm text-foreground">
                  Consistent 8% month-over-month growth in rewards indicates healthy network expansion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
