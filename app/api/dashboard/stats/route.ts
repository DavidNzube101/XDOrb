export async function GET() {
  return Response.json({
    totalNodes: 1391,
    activeNodes: 1289,
    networkHealth: 98.7,
    totalRewards: 524380,
    averageLatency: 47,
    validationRate: 99.2,
    timestamp: Date.now(),
  })
}
