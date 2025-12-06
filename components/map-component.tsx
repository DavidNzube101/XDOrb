"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import { apiClient } from "@/lib/api"
import "leaflet/dist/leaflet.css"

// Fix for default markers in react-leaflet
import L from "leaflet"
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface HeatmapData {
  lat: number
  lng: number
  intensity: number
  nodeCount: number
  region: string
  avgUptime: number
}

function MapController() {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
  }, [map])
  return null
}

export default function MapComponent() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const result = await apiClient.getNetworkHeatmap()
        if (result.error) {
          // Mock data for demo
          setHeatmapData([
            { lat: 40.7128, lng: -74.0060, intensity: 85, nodeCount: 120, region: "North America", avgUptime: 98.5 },
            { lat: 51.5074, lng: -0.1278, intensity: 75, nodeCount: 85, region: "Europe", avgUptime: 96.2 },
            { lat: 35.6762, lng: 139.6503, intensity: 65, nodeCount: 95, region: "Asia", avgUptime: 94.8 },
            { lat: -33.8688, lng: 151.2093, intensity: 55, nodeCount: 45, region: "Australia", avgUptime: 92.1 },
            { lat: -23.5505, lng: -46.6333, intensity: 45, nodeCount: 35, region: "South America", avgUptime: 89.7 },
          ] as HeatmapData[])
        } else {
          setHeatmapData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch heatmap data:", error)
      }
    }

    fetchHeatmapData()
  }, [])

  const getColor = (intensity: number) => {
    if (intensity >= 80) return "#22c55e" // green
    if (intensity >= 60) return "#eab308" // yellow
    if (intensity >= 40) return "#f97316" // orange
    return "#ef4444" // red
  }

  const getRadius = (nodeCount: number) => {
    return Math.max(10, Math.min(50, nodeCount / 2))
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <MapController />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {heatmapData.map((point, index) => (
          <CircleMarker
            key={index}
            center={[point.lat, point.lng]}
            pathOptions={{
              fillColor: getColor(point.intensity),
              fillOpacity: 0.7,
              color: getColor(point.intensity),
              weight: 2,
            }}
            radius={getRadius(point.nodeCount)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{point.region}</h3>
                <p className="text-sm">Nodes: {point.nodeCount}</p>
                <p className="text-sm">Avg Uptime: {point.avgUptime.toFixed(1)}%</p>
                <p className="text-sm">Intensity: {point.intensity}%</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}