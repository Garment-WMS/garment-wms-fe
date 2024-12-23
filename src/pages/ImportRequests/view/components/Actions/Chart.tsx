'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Cog, Package } from 'lucide-react';
import Waiting from '@/assets/images/Waiting.png';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import Colors from '@/constants/color';
import InspectionReportDialog from './InspectionReportDialog';
import ReassingStaffPopup from './StaffReassignment';
import { WarehouseManagerGuardDiv } from '@/components/authentication/createRoleGuard';

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
  onApproval: () => void;
  importRequest: any;
}

export function Chart({ currentStatus, inspectionRequest, onApproval, importRequest }: ChartProps) {
  const [defectTypes, setDefectTypes] = useState<
    { type: string; value: number; percentage: number }[]
  >([]);
  const { data: defectsData } = useGetAllDefects();
  const totalReports = inspectionRequest?.reduce(
    (total, request) => total + (request?.inspectionReport?.inspectionReportDetail?.length ?? 0),
    0
  );
  const inspectionRequestType = inspectionRequest?.[0]?.type;
  const totalApproved = inspectionRequest?.reduce((total, request) => {
    return (
      total +
      (request?.inspectionReport?.inspectionReportDetail?.reduce(
        (sum: number, detail: any) => sum + (detail?.approvedQuantityByPack || 0),
        0
      ) ?? 0)
    );
  }, 0);

  const totalDefected = inspectionRequest?.reduce((total, request) => {
    return (
      total +
      (request?.inspectionReport?.inspectionReportDetail?.reduce(
        (sum: number, detail: any) => sum + (detail?.defectQuantityByPack || 0),
        0
      ) ?? 0)
    );
  }, 0);

  const passRate = React.useMemo(() => {
    const total = totalApproved + totalDefected;
    return total > 0 ? ((totalApproved / total) * 100).toFixed(1) : 0;
  }, [totalApproved, totalDefected]);

  useEffect(() => {
    if (defectsData?.data && inspectionRequest?.length) {
      const defects: { type: string; value: number; percentage: number }[] = [];
      const staticDefects = Array.isArray(defectsData.data) ? defectsData.data : [];
      const requestType = inspectionRequest?.[0]?.type;
      let totalDefectCount = 0;
      const filteredDefects = staticDefects.filter((defect: any) => defect.type === requestType);
      filteredDefects.forEach((defect: { id: string; description: string }) => {
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
          percentage: 0
        });
      });

      defects.forEach((defect) => {
        defect.percentage = totalDefectCount > 0 ? (defect.value / totalDefectCount) * 100 : 0;
      });

      setDefectTypes(defects);
    }
  }, [defectsData, inspectionRequest]);

  return (
    <Card className="flex flex-col w-full max-w-5xl max-h-[500px]">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-2xl">Inspection Report</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-6">
        {currentStatus === 'INSPECTING' && (
          <div className="col-span-3 flex flex-col items-center justify-center">
            <img src={Waiting} alt="Waiting for Inspection" className="w-[300px] h-[300px]" />
            <h2 className="font-bold text-xl text-gray-700">Waiting for Inspection</h2>
            <WarehouseManagerGuardDiv>
              <ReassingStaffPopup
                onApproval={onApproval}
                importRequest={importRequest}
                type={'inspectionDepartmentId'}
                role="inspection-department"
              />
            </WarehouseManagerGuardDiv>
          </div>
        )}
        {!importRequest?.inspectionRequest[0]?.inspectionReport &&
          currentStatus !== 'INSPECTING' && (
            <div className="col-span-3 flex flex-col items-center justify-center">
              <img src={empty} alt="No Inspection Report" className="w-[250px] h-[250px]" />
              <h2 className="font-bold text-xl text-gray-700">Not Yet</h2>
            </div>
          )}
        {importRequest?.inspectionRequest[0]?.inspectionReport && (
          <>
            <div className="col-span-3 sm:col-span-1">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={[
                      { status: 'passed', quantity: totalApproved, fill: Colors.success },
                      { status: 'failed', quantity: totalDefected, fill: Colors.error }
                    ]}
                    dataKey="quantity"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}>
                    <Cell key="passed" fill={Colors.success} />
                    <Cell key="failed" fill={Colors.error} />
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
                <span>Passed: {totalApproved}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Failed: {totalDefected}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>
                  Total {inspectionRequestType === 'MATERIAL' ? 'Material' : 'Product'} Inspected:{' '}
                  {totalReports}
                </span>
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
