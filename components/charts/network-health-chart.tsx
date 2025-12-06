"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { time: "00:00", health: 98.2, active: 1200 },
  { time: "04:00", health: 97.8, active: 1180 },
  { time: "08:00", health: 99.1, active: 1240 },
  { time: "12:00", health: 96.5, active: 1100 },
  { time: "16:00", health: 98.9, active: 1320 },
  { time: "20:00", health: 99.3, active: 1380 },
  { time: "24:00", health: 98.7, active: 1295 },
]

export function NetworkHealthChart() {
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
