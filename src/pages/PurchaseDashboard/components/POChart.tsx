"use client"

import { Bar, BarChart, Legend, ResponsiveContainer,Tooltip, XAxis, YAxis } from "recharts"
const data = [
    { month: "Jan", poCount: 65, poValue: 1200000 },
    { month: "Feb", poCount: 75, poValue: 1350000 },
    { month: "Mar", poCount: 85, poValue: 1500000 },
    { month: "Apr", poCount: 90, poValue: 1650000 },
    { month: "May", poCount: 100, poValue: 1800000 },
    { month: "Jun", poCount: 110, poValue: 2000000 },
  ]

export function POChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
    <BarChart data={data}>
      <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
      <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000000}M`} />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="poCount" name="PO Count" fill="#8884d8" radius={[4, 4, 0, 0]} />
      <Bar yAxisId="right" dataKey="poValue" name="PO Value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
  )
}

