"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, MessageCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">About XDOrb</h1>
          <p className="text-muted-foreground mt-1">Learn more about the Xandeum network and pNode analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>What is Xandeum?</CardTitle>
              <CardDescription>The future of scalable blockchain storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Xandeum is building a scalable storage layer for Solana dApps. We think of it as a second tier of Solana accounts that can grow to exabytes and beyond. This lives on its own network of storage provider nodes, which we call pNodes.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Scalable</Badge>
                  <span className="text-sm">Exabyte-scale storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Decentralized</Badge>
                  <span className="text-sm">Network of pNodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Solana Native</Badge>
                  <span className="text-sm">Built for Solana ecosystem</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
            <CardTitle>About XDOrb</CardTitle>
            <CardDescription>Xandeum analytics platform for pNode monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                XDOrb is a comprehensive analytics platform providing real-time monitoring and insights for Xandeum pNodes. Built with Next.js, Tailwind CSS, and modern web technologies.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Real-time</Badge>
                  <span className="text-sm">Live data updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">AI-Powered</Badge>
                  <span className="text-sm">Predictive analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Interactive</Badge>
                  <span className="text-sm">Customizable widgets</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Connect with XDOrb</CardTitle>
            <CardDescription>Join the community and stay updated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://discord.gg/uqRSmmM5m"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-medium">Discord</div>
                  <div className="text-sm text-muted-foreground">Join our community</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </a>

              <a
                href="https://xandeum.network"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <ExternalLink className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-medium">Website</div>
                  <div className="text-sm text-muted-foreground">Learn more</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </a>

              <a
                href="https://github.com/xandeum"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <Github className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-medium">GitHub</div>
                  <div className="text-sm text-muted-foreground">View source code</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>XDOrb Tech Stack</CardTitle>
            <CardDescription>Built with modern web technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="font-semibold text-primary">Next.js</div>
                <div className="text-sm text-muted-foreground">React Framework</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-primary">Tailwind CSS</div>
                <div className="text-sm text-muted-foreground">Styling</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-primary">TypeScript</div>
                <div className="text-sm text-muted-foreground">Type Safety</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-primary">SWR</div>
                <div className="text-sm text-muted-foreground">Data Fetching</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}