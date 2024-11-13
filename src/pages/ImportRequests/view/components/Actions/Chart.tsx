'use client';

import * as React from 'react';
import { CheckCircle, XCircle, Cog, Package } from 'lucide-react';
import Waiting from '@/assets/images/Waiting.png';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/Charts';
import { Label, Pie, PieChart, Cell, Legend } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { statusOrder } from '@/pages/ImportRequests/constants';
import empty from '@/assets/images/empty.svg';
const COLORS = {
  passed: 'hsl(var(--chart-1))',
  failed: 'hsl(var(--chart-2))',
  pending: 'hsl(var(--chart-3))'
};

const chartData = [
  { status: 'passed', quantity: 750, fill: COLORS.passed },
  { status: 'failed', quantity: 180, fill: COLORS.failed }
];

const defectTypes = [
  { type: 'Dimensional', percentage: 40 },
  { type: 'Surface Finish', percentage: 30 },
  { type: 'Material Composition', percentage: 20 },
  { type: 'Other', percentage: 10 }
];

const chartConfig = {
  quantity: {
    label: 'Quantity'
  },
  passed: {
    label: 'Passed Inspection',
    color: COLORS.passed
  },
  failed: {
    label: 'Failed Inspection',
    color: COLORS.failed
  }
} satisfies ChartConfig;

export interface ChartProps {
  currentStatus: string;
}

export function Chart({ currentStatus }: ChartProps) {
  const totalMaterials = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.quantity, 0);
  }, []);

  const passRate = React.useMemo(() => {
    const passed = chartData.find((item) => item.status === 'passed')?.quantity || 0;
    return ((passed / totalMaterials) * 100).toFixed(1);
  }, [totalMaterials]);

  return (
    <Card className="flex flex-col w-full max-w-5xl">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-2xl">Material Inspection Report</CardTitle>
        <CardDescription>Import Request #4f50</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-6">
        {currentStatus === 'INSPECTING' && (
          <div className="col-span-3 flex flex-col items-center justify-center">
            <img src={Waiting} alt="Waiting for Inspection" className="w-[400px] h-[400px]" />
            <h2 className="font-bold text-xl text-gray-700">Waiting for Inspection</h2>
          </div>
        )}
        {statusOrder.indexOf(currentStatus) < 4 && (
          <div className="col-span-3 flex flex-col items-center justify-center">
            <img src={empty} alt="No Inspection Report" className="w-[250px] h-[250px]" />
            <h2 className="font-bold text-xl text-gray-700">Not Yet</h2>
          </div>
        )}
        {statusOrder.indexOf(currentStatus) > 4 && (
          <>
            <div className="col-span-3 sm:col-span-1">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={chartData}
                    dataKey="quantity"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle">
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold">
                                {passRate}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-xs">
                                Pass Rate
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="col-span-3 sm:col-span-2 flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-4">Defect Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                {defectTypes.map((defect, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{defect.type}</span>
                      <span>{defect.percentage}%</span>
                    </div>
                    <Progress value={defect.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm">
        {currentStatus == 'INSPECTED' && (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Passed: {chartData.find((item) => item.status === 'passed')?.quantity}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Failed: {chartData.find((item) => item.status === 'failed')?.quantity}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Total Inspected: {totalMaterials}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cog className="h-5 w-5" />
                <span>Inspection Efficiency: 98.5%</span>
              </div>
            </div>
          </>
        )}
        <h1>Please contact Inspection team if it takes long time</h1>
      </CardFooter>
    </Card>
  );
}
