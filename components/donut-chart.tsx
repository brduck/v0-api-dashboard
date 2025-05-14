"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: ChartData[]
}

export function DonutChart({ data }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate total value
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // If total is 0, draw empty circle
    if (total === 0) {
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI)
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 20
      ctx.stroke()
      return
    }

    // Draw donut chart
    let startAngle = 0

    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 60, startAngle, startAngle + sliceAngle)
      ctx.strokeStyle = item.color
      ctx.lineWidth = 20
      ctx.stroke()

      startAngle += sliceAngle
    })

    // Draw inner circle (hole)
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
  }, [data])

  return (
    <div className="relative flex flex-col items-center">
      <canvas ref={canvasRef} width={150} height={150} className="mb-2" />
      <div className="flex flex-col gap-1 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="text-right w-16">{item.name}</div>
            <div className="font-medium">{item.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
