"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as THREE from "three"

function StorageBars() {
  const data = [
    { label: "Used", value: 75, color: "#f9961e" },
    { label: "Free", value: 25, color: "#116b61" },
  ]

  return (
    <>
      {data.map((item, index) => (
        <group key={item.label} position={[index * 2 - 1, 0, 0]}>
          {/* Bar */}
          <mesh position={[0, item.value / 2, 0]}>
            <boxGeometry args={[1, item.value, 1]} />
            <meshStandardMaterial color={item.color} />
          </mesh>
          {/* Label */}
          <Text
            position={[0, -2, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {item.label}
          </Text>
          {/* Value */}
          <Text
            position={[0, item.value + 1, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {item.value}%
          </Text>
        </group>
      ))}
    </>
  )
}

export function StorageVisualization() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>3D Storage Visualization</CardTitle>
        <CardDescription>Interactive 3D view of storage usage (drag to rotate)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <StorageBars />
            <OrbitControls enablePan={false} enableZoom={true} />
            <gridHelper args={[20, 20, "#444444", "#222222"]} />
          </Canvas>
        </div>
      </CardContent>
    </Card>
  )
}