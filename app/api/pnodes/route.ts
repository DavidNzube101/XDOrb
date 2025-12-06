export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const location = searchParams.get("location")

  // Mock data
  const pnodes = [
    {
      id: "1",
      name: "pNode-Tokyo-001",
      status: "active" as const,
      uptime: 99.98,
      latency: 32,
      validations: 15234,
      rewards: 5234.56,
      location: "Tokyo, Japan",
      lastUpdated: Date.now(),
      performance: 98,
      stake: 32000,
      riskScore: 8,
    },
    {
      id: "2",
      name: "pNode-NYC-042",
      status: "active" as const,
      uptime: 99.95,
      latency: 45,
      validations: 14892,
      rewards: 4891.23,
      location: "New York, USA",
      lastUpdated: Date.now(),
      performance: 97,
      stake: 31500,
      riskScore: 12,
    },
    {
      id: "3",
      name: "pNode-London-018",
      status: "active" as const,
      uptime: 99.92,
      latency: 52,
      validations: 13456,
      rewards: 4567.89,
      location: "London, UK",
      lastUpdated: Date.now(),
      performance: 96,
      stake: 30000,
      riskScore: 15,
    },
    {
      id: "4",
      name: "pNode-Singapore-056",
      status: "warning" as const,
      uptime: 98.5,
      latency: 67,
      validations: 8234,
      rewards: 2834.12,
      location: "Singapore",
      lastUpdated: Date.now(),
      performance: 88,
      stake: 25000,
      riskScore: 42,
    },
    {
      id: "5",
      name: "pNode-Sydney-033",
      status: "active" as const,
      uptime: 99.88,
      latency: 38,
      validations: 12456,
      rewards: 4234.56,
      location: "Sydney, Australia",
      lastUpdated: Date.now(),
      performance: 95,
      stake: 28000,
      riskScore: 18,
    },
  ]

  // Filter by status if provided
  let filtered = pnodes
  if (status) {
    filtered = filtered.filter((node) => node.status === status)
  }
  if (location) {
    filtered = filtered.filter((node) => node.location.toLowerCase().includes(location.toLowerCase()))
  }

  return Response.json(filtered)
}
