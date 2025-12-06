"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NetworkHeatmap } from "@/components/network-heatmap"

export default function NetworkPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Network Map</h1>
          <p className="text-muted-foreground mt-1">Global pNode distribution and network health</p>
        </div>

        <NetworkHeatmap />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Nodes by Region</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground">North America</span>
                  <span className="font-bold text-primary">328</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Europe</span>
                  <span className="font-bold text-primary">451</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Asia Pacific</span>
                  <span className="font-bold text-primary">612</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Network Stats</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                  <p className="text-2xl font-bold text-foreground">47ms</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Network Load</p>
                  <p className="text-2xl font-bold text-primary">62%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Connectivity</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Connected Nodes</p>
                  <p className="text-2xl font-bold text-secondary">1,391</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Peers</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
