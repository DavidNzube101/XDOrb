"use client"

import { useState } from "react"
import useSWR from "swr"
import Papa from "papaparse"
import { DashboardLayout } from "@/components/dashboard-layout"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Download, FileText, FileSpreadsheet, Bookmark, Share2, ChevronLeft, ChevronRight } from "lucide-react"

const fetcher = async () => {
  const result = await apiClient.getPNodes()
  if (result.error) throw new Error(result.error)
  return result.data
}

export default function PNodesPage() {
  const { data: pnodes, isLoading } = useSWR("/pnodes", fetcher, { refreshInterval: 30000 })
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "warning">("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookmarked-pnodes')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    }
    return new Set()
  })

  const toggleBookmark = (nodeId: string) => {
    const newBookmarked = new Set(bookmarked)
    if (newBookmarked.has(nodeId)) {
      newBookmarked.delete(nodeId)
    } else {
      newBookmarked.add(nodeId)
    }
    setBookmarked(newBookmarked)
    localStorage.setItem('bookmarked-pnodes', JSON.stringify([...newBookmarked]))
  }

  const shareNode = (node: any) => {
    if (navigator.share) {
      navigator.share({
        title: `pNode: ${node.name}`,
        text: `Check out this pNode: ${node.name} in ${node.location}`,
        url: `${window.location.origin}/pnodes/${node.id}`,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/pnodes/${node.id}`)
      // Could show a toast here
    }
  }

  const filtered = pnodes?.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(search.toLowerCase()) ||
      node.location.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || node.status === statusFilter
    const matchesRegion = regionFilter === "all" || node.region === regionFilter
    return matchesSearch && matchesStatus && matchesRegion
  })

  const regions = Array.from(new Set(pnodes?.map(node => node.region) || []))

  // Pagination
  const totalPages = Math.ceil((filtered?.length || 0) / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNodes = filtered?.slice(startIndex, startIndex + itemsPerPage) || []

  const exportToCSV = () => {
    if (!filtered) return

    const csvData = filtered.map(node => ({
      Name: node.name,
      Location: node.location,
      Status: node.status,
      Uptime: `${node.uptime}%`,
      Latency: `${node.latency}ms`,
      Validations: node.validations,
      Rewards: node.rewards.toFixed(2),
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'pnodes-data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = async () => {
    if (!filtered) return

    try {
      const { jsPDF } = await import('jspdf')
      await import('jspdf-autotable')

      const doc = new jsPDF()

      doc.text('pNodes Directory', 14, 20)

      const tableData = filtered.map(node => [
        node.name,
        node.location,
        node.status,
        `${node.uptime}%`,
        `${node.latency}ms`,
        node.validations,
        node.rewards.toFixed(2),
      ])

      ;(doc as any).autoTable({
        head: [['Name', 'Location', 'Status', 'Uptime', 'Latency', 'Validations', 'Rewards']],
        body: tableData,
        startY: 30,
      })

      doc.save('pnodes-data.pdf')
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('PDF export failed. Please try again.')
    }
  }

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      case "warning":
        return "bg-primary/20 text-primary"
      case "inactive":
        return "bg-red-500/20 text-red-600 dark:text-red-400"
      default:
        return ""
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">pNodes Directory</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all pNodes in your network</p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes by name or location..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search pNodes"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-2">
              {(["all", "active", "inactive", "warning"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  aria-label={`Filter by ${status} status`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground border border-border"
                aria-label="Filter by region"
              >
                <option value="all">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
           <div className="flex gap-2">
             <Button onClick={exportToCSV} variant="outline" size="sm" className="flex items-center gap-2">
               <FileSpreadsheet className="w-4 h-4" />
               CSV
             </Button>
             <Button onClick={exportToPDF} variant="outline" size="sm" className="flex items-center gap-2">
               <FileText className="w-4 h-4" />
               PDF
             </Button>
           </div>
        </div>

        {/* Nodes Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Active Nodes</CardTitle>
            <CardDescription>{filtered?.length || 0} nodes found</CardDescription>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => {
                setStatusFilter("all")
                setRegionFilter("all")
                setSearch("")
                setCurrentPage(1)
              }}>
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="pNodes data table">
                   <thead>
                     <tr className="border-b border-border" role="row">
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Name</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Location</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Status</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Uptime</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Latency</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Storage</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Last Seen</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Validations</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Rewards</th>
                       <th className="text-left p-3 font-semibold text-foreground" role="columnheader" aria-sort="none">Actions</th>
                      </tr>
                    </thead>
                   <tbody>
                      {paginatedNodes.map((node) => (
                        <tr
                          key={node.id}
                          className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => window.location.href = `/pnodes/${node.id}`}
                          role="row"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              window.location.href = `/pnodes/${node.id}`
                            }
                          }}
                          aria-label={`pNode ${node.name}, status ${node.status}, uptime ${node.uptime}%`}
                        >
                          <td className="p-3 font-medium text-foreground" role="cell">{node.name}</td>
                          <td className="p-3 text-muted-foreground" role="cell">{node.location}</td>
                          <td className="p-3" role="cell">
                            <Badge className={statusBadgeVariant(node.status)}>
                              {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3 text-muted-foreground" role="cell">{node.uptime}%</td>
                          <td className="p-3 text-muted-foreground" role="cell">{node.latency}ms</td>
                          <td className="p-3 text-muted-foreground" role="cell">
                            {(node.storageUsed / 1024).toFixed(1)} / {(node.storageCapacity / 1024).toFixed(1)} TB
                          </td>
                          <td className="p-3 text-muted-foreground" role="cell">
                            {new Date(node.lastSeen).toLocaleString()}
                          </td>
                          <td className="p-3 text-muted-foreground" role="cell">{node.validations}</td>
                          <td className="p-3 font-semibold text-foreground" role="cell">{node.rewards.toFixed(2)}</td>
                          <td className="p-3" role="cell">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleBookmark(node.id)
                                }}
                                className={bookmarked.has(node.id) ? "text-primary" : ""}
                                aria-label={bookmarked.has(node.id) ? "Remove bookmark" : "Add bookmark"}
                              >
                                <Bookmark className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  shareNode(node)
                                }}
                                aria-label="Share pNode"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                     ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered?.length || 0)} of {filtered?.length || 0} nodes
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
