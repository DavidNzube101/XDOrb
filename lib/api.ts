// Structured API service for centralized data management
// All API calls go through this layer with caching, error handling, and type safety

export interface PNodeMetrics {
  id: string
  name: string
  status: "active" | "inactive" | "warning"
  uptime: number
  latency: number
  validations: number
  rewards: number
  location: string
  lastUpdated: number
  performance: number
  stake: number
  riskScore: number
  storageUsed: number
  storageCapacity: number
  lastSeen: number
  region: string
}

export interface DashboardStats {
  totalNodes: number
  activeNodes: number
  networkHealth: number
  totalRewards: number
  averageLatency: number
  validationRate: number
  timestamp: number
}

export interface ApiResponse<T> {
  data: T
  error: string | null
  timestamp: number
}

// In-memory cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 30000 // 30 seconds

// Mock API endpoints - replace with real endpoints
const API_BASE = "/api"

async function fetchWithCache<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const cacheKey = endpoint
  const cached = cache.get(cacheKey)

  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      data: cached.data as T,
      error: null,
      timestamp: cached.timestamp,
    }
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const result = await response.json()

    // Cache the response
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    })

    return {
      data: result as T,
      error: null,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error(`[v0] API fetch error on ${endpoint}:`, error)
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: Date.now(),
    }
  }
}

// Public API methods
export const apiClient = {
  // Dashboard Stats
  getDashboardStats: () => fetchWithCache<DashboardStats>("/dashboard/stats"),

  // pNode Management
  getPNodes: (filters?: { status?: string; location?: string }) =>
    fetchWithCache<PNodeMetrics[]>(`/pnodes?${new URLSearchParams(filters as Record<string, string>).toString()}`),

  getPNodeById: (id: string) => fetchWithCache<PNodeMetrics>(`/pnodes/${id}`),

  updatePNode: (id: string, data: Partial<PNodeMetrics>) =>
    fetchWithCache<PNodeMetrics>(`/pnodes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Metrics History
  getPNodeHistory: (id: string, timeRange: "24h" | "7d" | "30d" = "24h") =>
    fetchWithCache<Array<{ timestamp: number; latency: number; uptime: number; storageUsed: number; rewards: number }>>(
      `/pnodes/${id}/history?range=${timeRange}`,
    ),

  // Peer Connections
  getPNodePeers: (id: string) =>
    fetchWithCache<Array<{ id: string; name: string; status: string; latency: number }>>(
      `/pnodes/${id}/peers`,
    ),

  // Alerts
  getPNodeAlerts: (id: string) =>
    fetchWithCache<Array<{ id: string; type: string; message: string; timestamp: number; severity: "low" | "medium" | "high" }>>(
      `/pnodes/${id}/alerts`,
    ),

  // Leaderboard
  getLeaderboard: (metric: "rewards" | "uptime" | "performance" = "rewards", limit = 10) =>
    fetchWithCache<PNodeMetrics[]>(`/leaderboard?metric=${metric}&limit=${limit}`),

  // Network Heat Map
  getNetworkHeatmap: () =>
    fetchWithCache<
      Array<{
        lat: number
        lng: number
        intensity: number
        nodeCount: number
        region: string
        avgUptime: number
      }>
    >("/network/heatmap"),

  // Clear cache manually if needed
  clearCache: () => cache.clear(),
}

// AI Insights using Gemini
export interface AIInsight {
  riskScore: number
  explanation: string
  summary: string
  recommendations: string[]
}

async function generateAIInsight(pnodeData: PNodeMetrics, history?: Array<{ timestamp: number; uptime: number }>): Promise<AIInsight> {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `
Analyze this pNode's performance data and provide insights:

pNode ID: ${pnodeData.id}
Current Uptime: ${pnodeData.uptime}%
Status: ${pnodeData.status}
Rewards: ${pnodeData.rewards}
Location: ${pnodeData.location}
Risk Score: ${pnodeData.riskScore}

${history ? `Historical data (last 24h): ${history.map(h => `Time: ${new Date(h.timestamp).toLocaleTimeString()}, Uptime: ${h.uptime}%`).join('; ')}` : ''}

Provide a JSON response with:
- riskScore: number (0-100, higher = higher risk)
- explanation: string (why this risk score)
- summary: string (natural language summary of performance)
- recommendations: array of strings (actionable advice)
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback
    return {
      riskScore: Math.random() * 100,
      explanation: "AI analysis temporarily unavailable",
      summary: "Performance data analyzed",
      recommendations: ["Monitor uptime closely"]
    }
  } catch (error) {
    console.error('AI Insight generation failed:', error)
    return {
      riskScore: 50,
      explanation: "Unable to generate AI insights at this time",
      summary: "Basic performance monitoring active",
      recommendations: ["Check system logs", "Verify network connectivity"]
    }
  }
}

// Public AI methods
export const aiClient = {
  getPNodeInsight: (pnode: PNodeMetrics, history?: Array<{ timestamp: number; uptime: number }>) =>
    generateAIInsight(pnode, history),
}

// Export cache utilities for debugging
export const cacheDebug = {
  getSize: () => cache.size,
  getKeys: () => Array.from(cache.keys()),
  getCacheEntry: (key: string) => cache.get(key),
}
