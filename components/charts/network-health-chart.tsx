"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useSWR from "swr"
import { apiClient } from "@/lib/api"

const fetcher = async () => {
  const result = await apiClient.getDashboardStats()
  if (result.error) throw new Error(result.error)
  return result.data
}

const historyFetcher = async () => {
  const result = await apiClient.getNetworkHistory("24h")
  if (result.error) throw new Error(result.error)
  return result.data
}

export function NetworkHealthChart() {
  const { data: stats, isLoading: statsLoading } = useSWR("dashboard-stats", fetcher, {
    refreshInterval: 30000,
  })

  const { data: history, isLoading: historyLoading } = useSWR("network-history", historyFetcher, {
    refreshInterval: 30000,
  })

  // Transform historical data for the chart
  const data = Array.isArray(history) && history.length > 0
    ? history.slice(-7).map((point: any, index: number) => ({
        time: new Date(point.timestamp * 1000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        health: point.uptime,
        active: stats?.activeNodes || 1200,
      }))
    : [
        { time: "00:00", health: stats?.networkHealth || 98.2, active: stats?.activeNodes || 1200 },
      ]
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Network Health & Activity</CardTitle>
        <CardDescription>24-hour performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
              }}
              cursor={{ stroke: "var(--color-primary)" }}
            />
            <Line
              type="monotone"
              dataKey="health"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              name="Network Health %"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
