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
import InspectionReportDialog from './InspectionReportDialog';

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
  const [defectTypes, setDefectTypes] = useState<
    { type: string; value: number; percentage: number }[]
  >([]);
  const { data: defectsData } = useGetAllDefects();
  const totalReports = inspectionRequest?.reduce(
    (total, request) => total + (request?.inspectionReport?.inspectionReportDetail?.length ?? 0),
    0
  );

  useEffect(() => {
    if (defectsData?.data && inspectionRequest?.length) {
      const defects: { type: string; value: number; percentage: number }[] = [];
      const staticDefects = Array.isArray(defectsData.data) ? defectsData.data : [];
      let totalDefectCount = 0;

      staticDefects.forEach((defect: { id: string; description: string }) => {
        let totalDefectQuantity = 0;

        inspectionRequest.forEach((request) => {
          request?.inspectionReport?.inspectionReportDetail?.forEach((detail: any) => {
            detail?.inspectionReportDetailDefect?.forEach((detailDefect: any) => {
              if (detailDefect.defectId === defect.id) {
                totalDefectQuantity += detailDefect.quantityByPack;
              }
            });
          });
        });

        totalDefectCount += totalDefectQuantity;

        defects.push({
          type: defect.description,
          value: totalDefectQuantity,
          percentage: 0 // Temporary, calculated below
        });
      });

      // Calculate percentage for each defect
      defects.forEach((defect) => {
        defect.percentage = totalDefectCount > 0 ? (defect.value / totalDefectCount) * 100 : 0;
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
    const total = passed + defectTypes.reduce((sum, defect) => sum + defect.value, 0);
    return total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  }, [totalMaterials, defectTypes]);

  return (
    <Card className="flex flex-col w-full max-w-5xl">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-2xl">Material Inspection Report</CardTitle>
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
                      {
                        status: 'failed',
                        quantity: defectTypes.reduce((sum, defect) => sum + defect.value, 0),
                        fill: Colors.error
                      }
                    ]}
                    dataKey="quantity"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}>
                    {[
                      { status: 'passed', quantity: totalMaterials, fill: Colors.success },
                      {
                        status: 'failed',
                        quantity: defectTypes.reduce((sum, defect) => sum + defect.value, 0),
                        fill: Colors.error
                      }
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
                              {defect?.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{defect?.type ?? 'Unknown Defect'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Progress value={defect?.percentage} className="h-2 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm">
        {statusOrder.indexOf(currentStatus) > 4 && (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Passed: {totalMaterials}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Failed: {defectTypes.reduce((sum, defect) => sum + defect.value, 0)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Total Inspected: {totalReports}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cog className="h-5 w-5" />
                <span>Inspection Efficiency: {passRate}%</span>
              </div>
            </div>
          </>
        )}
        <h1>Please contact Inspection team if it takes long time</h1>
        {inspectionRequest?.[0]?.inspectionReport && (
          <InspectionReportDialog
            inspectionReqId={inspectionRequest[0].id}
            inspectionReport={inspectionRequest[0].inspectionReport}
          />
        )}
      </CardFooter>
    </Card>
  );
}
