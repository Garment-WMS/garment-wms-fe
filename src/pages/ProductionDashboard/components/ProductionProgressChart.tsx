"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

const data = [
  { name: "Red Cotton T-Shirt - L", planned: 50, produced: 50 },
  { name: "Red Cotton T-Shirt - M", planned: 100, produced: 20 },
  { name: "Red Cotton T-Shirt - S", planned: 50, produced: 30 },
  { name: "Black Polo T-Shirt - XL", planned: 60, produced: 40 },
  { name: "Black Polo T-Shirt - M", planned: 75, produced: 0 },
  { name: "Black Polo T-Shirt - L", planned: 50, produced: 0 },
]

const calculatePercentage = (produced: number, planned: number) => {
  return (produced / planned) * 100
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const { planned, produced } = payload[0].payload
    const percentage = calculatePercentage(produced, planned)
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-bold">{label}</p>
        <p>Planned: {planned}</p>
        <p>Produced: {produced}</p>
        <p className="font-bold">Completion: {percentage.toFixed(2)}%</p>
      </div>
    )
  }
  return null
}

export function ProductionProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis dataKey="name" type="category" width={180} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={(entry) => calculatePercentage(entry.produced, entry.planned)} name="Completion Percentage">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.produced > 0 ? "#246bfd" : "#8884d8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

