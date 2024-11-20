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

interface InspectionRequestChartProps {
  inspectionReport: InspectionReport | null;
}

const InspectionRequestChart: React.FC<InspectionRequestChartProps> = ({ inspectionReport }) => {
  if (!inspectionReport) {
    return (
      <Card className="md:col-span-2">
        <EmptyDatacomponent />
      </Card>
    );
  }

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

  return (
    <div className="grid grid-cols-[1fr_2fr] w-full">
      {/* Pie Chart */}
      <Card className="w-full max-w-4xl mx-auto pb-7">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Inspection Report Summary</CardTitle>
          <CardTitle className="font-bold">
            <div className="flex items-center flex-col ">
              Total
              <span className="ml-2 text-2xl text-blue-600">{totalInspected}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <div className="w-full pb-5">
          <PieChartComponent
            data={chartData}
            colors={[Colors.red[500], Colors.green[500]]}
            width={400}
            height={400}
            innerRadius={90}
            outerRadius={150}
            labelType="value"
            showLegend={true}
            legendHeight={20}
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
            {/* Report Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Report Code</p>
                <Badge className="bg-primaryLight">{inspectionReport.code}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={`mt-1 ${statusClass[inspectionReport.inspectionRequest.status]}`}>
                  {InspectionRequestStatusLabels[inspectionReport.inspectionRequest.status]}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requested At</p>
                <p className="text-lg font-semibold flex items-center">
                  <CalendarArrowUp className="mr-2 h-5 w-5" />
                  {convertDate(inspectionReport?.inspectionRequest?.createdAt || '')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inspected At</p>
                <p className="text-lg font-semibold flex items-center">
                  <CalendarArrowDown className="mr-2 h-5 w-5" />
                  {convertDate(inspectionReport.createdAt || '')}
                </p>
              </div>
            </div>

            {/* Inspection Details */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Inspection Details</h3>
              <div className="overflow-x-auto">
                <Table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-md">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="py-4 px-6 text-center text-sm font-semibold text-gray-600"></TableHead>
                      <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                        Material Name
                      </TableHead>
                      <TableHead className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                        Material Code
                      </TableHead>
                      <TableHead className="py-4 px-6 text-right text-sm font-semibold text-gray-600">
                        Quantity
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
                          <span className="flex items-center text-lg justify-end text-red-800 font-semibold">
                            <XCircleIcon className="mr-2 h-6 w-6 text-red-500" />
                            {detail.defectQuantityByPack}
                          </span>
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
    </div>
  );
};

export default InspectionRequestChart;
