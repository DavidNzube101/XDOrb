"use client"

import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award } from "lucide-react"
import { GamificationBadges } from "@/components/gamification-badges"
import { Challenges } from "@/components/challenges"
import { NodeAvatar } from "@/components/node-avatar"

const fetcher = async () => {
  const result = await apiClient.getLeaderboard("rewards", 20)
  if (result.error) throw new Error(result.error)
  return result.data
}

export default function LeaderboardPage() {
  const { data: topNodes, isLoading } = useSWR("/leaderboard", fetcher, { refreshInterval: 60000 })

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Award className="w-5 h-5 text-slate-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground">{position}</span>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top performing pNodes by reward generation</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Top 20 Nodes</CardTitle>
            <CardDescription>Ranked by total rewards earned</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {topNodes?.map((node, index) => (
                  <div
                    key={node.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      index < 3
                        ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30"
                        : "bg-muted/30 border-border hover:border-primary/50"
                    }`}
                  >
                     <div className="flex items-center justify-center w-10">{getMedalIcon(index + 1)}</div>
                     <NodeAvatar id={node.id} name={node.name} size="md" />
                     <div className="flex-1">
                       <p className="font-semibold text-foreground">{node.name}</p>
                       <p className="text-sm text-muted-foreground">{node.location}</p>
                       <GamificationBadges
                         performance={node.performance}
                         uptime={node.uptime}
                         rewards={node.rewards}
                         streak={Math.floor(Math.random() * 60)} // Mock streak
                       />
                     </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-primary">{node.rewards.toFixed(2)} POL</p>
                        <p className="text-xs text-muted-foreground">{node.uptime}% uptime</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          node.performance > 95
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : node.performance > 85
                              ? "bg-primary/20 text-primary"
                              : "bg-red-500/20 text-red-600"
                        }`}
                      >
                        {node.performance}% Perf
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Challenges />
      </div>
    </DashboardLayout>
  )
}
