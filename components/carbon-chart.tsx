"use client"

import { Card } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    transportation: 0.9,
    home: 1.3,
    food: 0.4,
    consumption: 0.2,
  },
  {
    name: "Feb",
    transportation: 0.8,
    home: 1.2,
    food: 0.4,
    consumption: 0.2,
  },
  {
    name: "Mar",
    transportation: 0.8,
    home: 1.2,
    food: 0.3,
    consumption: 0.2,
  },
  {
    name: "Apr",
    transportation: 0.9,
    home: 1.3,
    food: 0.4,
    consumption: 0.2,
  },
  {
    name: "May",
    transportation: 0.8,
    home: 1.2,
    food: 0.3,
    consumption: 0.2,
  },
  {
    name: "Jun",
    transportation: 0.8,
    home: 1.1,
    food: 0.3,
    consumption: 0.1,
  },
  {
    name: "Jul",
    transportation: 0.8,
    home: 1.1,
    food: 0.3,
    consumption: 0.1,
  },
  {
    name: "Aug",
    transportation: 0.8,
    home: 1.1,
    food: 0.3,
    consumption: 0.1,
  },
  {
    name: "Sep",
    transportation: 0.8,
    home: 1.1,
    food: 0.3,
    consumption: 0.1,
  },
  {
    name: "Oct",
    transportation: 0.8,
    home: 1.2,
    food: 0.3,
    consumption: 0.1,
  },
  {
    name: "Nov",
    transportation: 0.8,
    home: 1.2,
    food: 0.3,
    consumption: 0.1,
  },
  {
    name: "Dec",
    transportation: 0.8,
    home: 1.2,
    food: 0.3,
    consumption: 0.1,
  },
]

export function CarbonChart() {
  return (
    <Card className="w-full">
      <ChartContainer className="h-[300px]">
        <ChartLegend className="mb-4">
          <ChartLegendItem name="Transportation" color="#10b981" />
          <ChartLegendItem name="Home Energy" color="#0ea5e9" />
          <ChartLegendItem name="Food" color="#8b5cf6" />
          <ChartLegendItem name="Consumption" color="#f59e0b" />
        </ChartLegend>
        <Chart>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-sm text-muted-foreground" />
              <YAxis className="text-sm text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="transportation"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.7}
              />
              <Area type="monotone" dataKey="home" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.7} />
              <Area type="monotone" dataKey="food" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.7} />
              <Area
                type="monotone"
                dataKey="consumption"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.7}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
      </ChartContainer>
    </Card>
  )
}
