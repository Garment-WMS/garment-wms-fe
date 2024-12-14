import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"

interface DeliveryProgressProps {
  deliveryProgress: {
    total: number
    finished: number
    inProgress: number
    pending: number
    cancelled: number
  }
}

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#e62922']

export function DeliveryProgressChart({ deliveryProgress }: DeliveryProgressProps) {
  const data = [
    { name: 'Finished', value: deliveryProgress.finished },
    { name: 'Importing', value: deliveryProgress.inProgress },
    { name: 'Pending', value: deliveryProgress.pending },
    { name: 'Cancelled', value: deliveryProgress.cancelled },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

