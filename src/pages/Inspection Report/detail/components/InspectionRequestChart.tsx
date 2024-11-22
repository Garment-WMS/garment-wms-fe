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
import { CalendarArrowDown, CalendarArrowUp, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { InspectionReport } from '@/types/InspectionReport';
import { convertDate } from '@/helpers/convertDate';
import {
  InspectionRequestStatus,
  InspectionRequestStatusLabels
} from '@/enums/inspectionRequestStatus';
import Colors from '@/constants/color';
import PieChartComponent from '@/components/common/PieChart';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import DefectsSummary from './DefectsSummary';

interface InspectionRequestChartProps {
  inspectionReport: InspectionReport | null;
}

const InspectionRequestChart: React.FC<InspectionRequestChartProps> = ({ inspectionReport }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDefectDetails, setSelectedDefectDetails] = useState<any[]>([]);

  if (!inspectionReport) {
    return (
      <Card className="md:col-span-2">
        <EmptyDatacomponent />
      </Card>
    );
  }

  // Mock defect data
  const mockDefectDetails = [
    { id: 1, defectType: 'Tear', quantity: 5 },
    { id: 2, defectType: 'Stain', quantity: 3 },
    { id: 3, defectType: 'Misshaped', quantity: 2 },
    { id: 4, defectType: 'Ugly', quantity: 6 }
  ];

  // Calculate total inspected materials
  const totalFail = inspectionReport.inspectionReportDetail.reduce(
    (sum, detail) => sum + (detail.defectQuantityByPack || 0),
    0
  );
  const totalPass = inspectionReport.inspectionReportDetail.reduce(
    (sum, detail) => sum + (detail.approvedQuantityByPack || 0),
    0
  );
  const totalInspected = totalFail + totalPass;

  const chartData = [
    { name: 'Fail', value: totalFail },
    { name: 'Pass', value: totalPass }
  ];

  const statusClass = {
    [InspectionRequestStatus.CANCELLED]: 'bg-red-500 text-white',
    [InspectionRequestStatus.INSPECTING]: 'bg-blue-500 text-white',
    [InspectionRequestStatus.INSPECTED]: 'bg-green-500 text-white'
  };

  const handleViewDefects = (defectDetails: any[]) => {
    setSelectedDefectDetails(defectDetails);
    setOpenDialog(true);
  };

  return (
    <div className="grid grid-cols-[1fr_2fr] w-full">
      {/* Pie Chart */}
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
            colors={[Colors.red[500], Colors.green[500]]}
            width={280}
            height={280}
            innerRadius={80}
            outerRadius={120}
            labelType="value"
            showLegend={true}
            legendHeight={5}
          />
        </div>
      </Card>

      {/* Report details */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inspection Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Inspection Details */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Inspection Details</h3>
              <div className="overflow-x-auto">
                <Table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-md">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="py-4 px-6 text-center text-sm font-semibold text-gray-600"></TableHead>
                      <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                        Name
                      </TableHead>
                      <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                        Code
                      </TableHead>
                      <TableHead className="py-4 px-6 text-right text-sm font-semibold text-gray-600">
                        Total
                      </TableHead>
                      <TableHead className="py-4 px-6 text-right text-sm font-semibold text-gray-600">
                        No. Pass
                      </TableHead>
                      <TableHead className="py-4 px-6 text-right text-sm font-semibold text-gray-600">
                        No. Failed
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionReport.inspectionReportDetail.map((detail) => (
                      <TableRow
                        key={detail.id}
                        className="hover:bg-gray-50 transition-colors duration-200">
                        <TableCell className="py-3 px-6 text-sm text-center align-middle">
                          <div className="flex items-center justify-center">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-md border border-gray-300">
                              <img
                                src={
                                  detail?.materialPackage?.materialVariant?.image ||
                                  'https://via.placeholder.com/100'
                                }
                                alt={detail?.materialPackage?.name || 'Material'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-6 text-sm font-medium text-gray-800 align-middle">
                          {detail?.materialPackage?.name || 'null name'}
                        </TableCell>
                        <TableCell className="py-3 px-6 text-sm font-medium text-center text-gray-600 align-middle">
                          <Badge className="bg-slate-500">
                            {detail?.materialPackage?.code || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 px-6 text-sm text-center align-middle">
                          <span className="text-lg font-semibold">{detail.quantityByPack}</span>
                        </TableCell>
                        <TableCell className="py-3 px-6 text-sm text-center align-middle">
                          <span className="flex items-center text-lg justify-end text-green-800 font-semibold">
                            <CheckCircleIcon className="mr-2 h-6 w-6 text-green-500" />
                            {detail.approvedQuantityByPack}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-6 text-sm text-center align-middle">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="flex items-center text-lg justify-end text-red-800 font-semibold cursor-pointer underline hover:opacity-80 transition-opacity"
                                  onClick={() => handleViewDefects(mockDefectDetails)}>
                                  <XCircleIcon className="mr-2 h-6 w-6 text-red-500" />
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

      {/* Modal for Defect Details */}
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
