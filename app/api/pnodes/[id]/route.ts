export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Mock data for individual pNode
  const nodeData = {
    id: params.id,
    name: `pNode-Detail-${params.id}`,
    status: "active" as const,
    uptime: 99.95,
    latency: 42,
    validations: 15234,
    rewards: 5234.56,
    location: "Tokyo, Japan",
    lastUpdated: Date.now(),
    performance: 97,
    stake: 32000,
    riskScore: 12,
  }

  return Response.json(nodeData)
}
