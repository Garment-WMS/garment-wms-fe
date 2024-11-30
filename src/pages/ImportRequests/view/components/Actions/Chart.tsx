'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Cog, Package } from 'lucide-react';
import Waiting from '@/assets/images/Waiting.png';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { useGetAllDefects } from '@/hooks/useGetAllDefects';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Badge } from '@/components/ui/Badge';
import Colors from '@/constants/color';

const COLORS = {
  passed: 'hsl(var(--chart-1))',
  failed: 'hsl(var(--chart-2))',
  pending: 'hsl(var(--chart-3))'
};

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
  inspectionRequest?: any[];
}

export function Chart({ currentStatus, inspectionRequest }: ChartProps) {
  const [defectTypes, setDefectTypes] = useState<{ type: string; percentage: number }[]>([]);
  const { data: defectsData } = useGetAllDefects();

  useEffect(() => {
    if (defectsData?.data && inspectionRequest?.length) {
      const defects: { type: string; percentage: number }[] = [];
      // const staticDefects = defectsData?.data;
      const staticDefects = Array.isArray(defectsData.data) ? defectsData.data : [];

      // Map over static defects and combine with inspectionRequest data
      staticDefects.forEach((staticDefect: { description: string }) => {
        const matchingDefect = inspectionRequest
          ?.flatMap(
            (request) =>
              request?.inspectionReport?.inspectionReportDetail?.flatMap(
                (detail: any) => detail?.inspectionReportDetailDefect ?? []
              ) ?? []
          )
          ?.find(
            (detailDefect: any) =>
              detailDefect?.description?.toLowerCase() === staticDefect?.description?.toLowerCase()
          );

        if (matchingDefect) {
          defects.push({
            type: staticDefect?.description ?? 'Unknown Defect',
            percentage: Math.floor(Math.random() * 30) + 10 // Mock percentage for now
          });
        } else {
          defects.push({
            type: staticDefect?.description ?? 'Unknown Defect',
            percentage: Math.floor(Math.random() * 30) + 10 // Mock percentage if not found
          });
        }
      });

      setDefectTypes(defects);
    }
  }, [defectsData, inspectionRequest]);

  const totalMaterials =
    inspectionRequest?.reduce((total, request) => {
      return (
        total +
        (request?.inspectionReport?.inspectionReportDetail?.reduce(
          (sum: number, detail: any) => sum + (detail?.approvedQuantityByPack ?? 0),
          0
        ) ?? 0)
      );
    }, 0) ?? 0;

  const passRate = React.useMemo(() => {
    const passed = totalMaterials ?? 0;
    const total = passed + (defectTypes?.length ?? 0);
    return total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  }, [totalMaterials, defectTypes]);

  return (
    <Card className="flex flex-col w-full max-w-5xl">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-2xl">Material Inspection Report</CardTitle>
        <CardDescription>
          Total reports:{' '}
          <span className="font-bold text-lg text-primaryLight">
            {inspectionRequest?.length ?? 0}
          </span>
        </CardDescription>
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
                    data={[
                      { status: 'passed', quantity: totalMaterials, fill: Colors.success },
                      { status: 'failed', quantity: defectTypes?.length ?? 0, fill: Colors.error }
                    ]}
                    dataKey="quantity"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}>
                    {[
                      { status: 'passed', quantity: totalMaterials, fill: Colors.success },
                      { status: 'failed', quantity: defectTypes?.length ?? 0, fill: Colors.error }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox?.cx && viewBox?.cy) {
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
                                y={(viewBox.cy ?? 0) + 20}
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
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {defectTypes?.map((defect, index) => (
                  <div key={index} className="flex flex-col space-y-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between text-sm font-medium cursor-pointer">
                            <span className="truncate">{defect?.type ?? 'Unknown Defect'}</span>
                            <span className="text-muted-foreground">
                              {defect?.percentage ?? 0}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{defect?.type ?? 'Unknown Defect'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Progress value={defect?.percentage ?? 0} className="h-2 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm">
        {currentStatus === 'INSPECTED' && (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Passed: {totalMaterials}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Failed: {defectTypes?.length ?? 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Total Inspected: {totalMaterials + (defectTypes?.length ?? 0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cog className="h-5 w-5" />
                <span>Inspection Efficiency: {passRate}%</span>
              </div>
            </div>
          </>
        )}
        <h1>Please contact Inspection team if it takes long time</h1>
      </CardFooter>
    </Card>
  );
}
