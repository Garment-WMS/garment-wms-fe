"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { generateColors } from "@/helpers/generateColors"
import { Material } from "@/types/MaterialTypes"

type Props = {
  materialTypeList: Material[]
}

export function TypeChart({ materialTypeList }: Props) {
  const data = materialTypeList.map((type) => ({
    name: type.name,
    value: type.numberOfMaterialVariants,
    internalRef: type.name,
  }))
  const COLORS = generateColors(data.length)
  console.log('color',COLORS)
  const config: ChartConfig = data.reduce((acc, item, index) => {
    acc[`chart${index + 1}`] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);
  const cconfig={
    value:{
      label:"Number of Material Variants"
    },
    ...config
  }
  console.log(config)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Material type chart</CardTitle>
        <CardDescription>This will show number of material each type</CardDescription>
      </CardHeader>
      <CardContent>
      <ChartContainer className="h-[300px] w-full px-4" config={cconfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="horizontal" // Set to horizontal layout
            margin={{
              left: 0,
            }}
          >
            <XAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={5}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
