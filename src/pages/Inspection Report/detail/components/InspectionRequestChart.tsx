import React, { useState } from 'react';
import EmptyDatacomponent from '@/components/common/EmptyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import Colors from '@/constants/color';
import PieChartComponent from '@/components/common/PieChart';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import DefectsSummary from './DefectsSummary';
import { useGetAllDefects } from '@/hooks/useGetAllDefects';

const InspectionRequestChart: React.FC<{ inspectionReport: any }> = ({ inspectionReport }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDefectDetails, setSelectedDefectDetails] = useState<any[]>([]);
  const { data: defectData, isPending: isDefectsLoading } = useGetAllDefects();

  if (!inspectionReport || isDefectsLoading) {
    return (
      <Card className="md:col-span-2">
        <EmptyDatacomponent />
      </Card>
    );
  }

  const defectsList = defectData?.data || [];
  const totalFail = inspectionReport.inspectionReportDetail.reduce(
    (sum: number, detail: any) => sum + (detail.defectQuantityByPack || 0),
    0
  );
  const totalPass = inspectionReport.inspectionReportDetail.reduce(
    (sum: number, detail: any) => sum + (detail.approvedQuantityByPack || 0),
    0
  );
  const totalInspected = totalFail + totalPass;

  // Dynamically assign colors based on the chart values
  const chartData = [
    { name: 'Pass', value: totalPass },
    { name: 'Fail', value: totalFail }
  ];

  const colors = chartData.map((item) =>
    item.name === 'Pass' && item.value > 0 ? Colors.green[500] : Colors.red[500]
  );

  const handleViewDefects = (detailDefects: any[]) => {
    const mappedDefects = defectsList.map((defect: any) => {
      const matchingDefect = detailDefects.find((d) => d.defectId === defect.id);
      return {
        id: defect.id,
        description: defect.description,
        quantity: matchingDefect?.quantityByPack || 0
      };
    });
    setSelectedDefectDetails(mappedDefects);
    setOpenDialog(true);
  };

  return (
    <div className="grid grid-cols-[1fr_2fr] w-full">
      <Card className="w-full max-w-4xl mx-auto pb-7">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Inspection Report Summary</CardTitle>
          <CardTitle className="font-bold">
            <div className="flex items-center flex-col">
              Total
              <span className="ml-2 text-2xl text-blue-600">{totalInspected}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <div className="w-full pb-5">
          <PieChartComponent
            data={chartData}
            colors={colors} // Dynamically assigned colors
            width={280}
            height={280}
            innerRadius={80}
            outerRadius={120}
            labelType="value"
            showLegend={true}
            showValue={false}
            legendHeight={5}
          />
        </div>
      </Card>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inspection Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Inspection Details</h3>
              <div className="overflow-x-auto">
                <Table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-md">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">No. Pass</TableHead>
                      <TableHead className="text-right">No. Failed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionReport.inspectionReportDetail.map((detail: any) => (
                      <TableRow key={detail.id}>
                        <TableCell>
                          <img
                            src={
                              detail.materialPackage?.materialVariant?.image ||
                              'https://via.placeholder.com/100'
                            }
                            alt={detail.materialPackage?.name || 'Material'}
                            className="w-20 h-20 object-cover"
                          />
                        </TableCell>
                        <TableCell>{detail.materialPackage?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge>{detail.materialPackage?.code || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{detail.quantityByPack}</TableCell>
                        <TableCell className="text-right text-green-500 font-bold">
                          <CheckCircleIcon className="inline h-5 w-5 text-green-500 mr-1" />
                          {detail.approvedQuantityByPack}
                        </TableCell>
                        <TableCell className="text-right text-red-500 font-bold">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="cursor-pointer underline"
                                  onClick={() =>
                                    handleViewDefects(detail.inspectionReportDetailDefect || [])
                                  }>
                                  <XCircleIcon className="inline h-5 w-5 text-red-500 mr-1" />
                                  {detail.defectQuantityByPack}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to view defect details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogTitle>Defect Details</DialogTitle>
          <DefectsSummary defects={selectedDefectDetails} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InspectionRequestChart;
