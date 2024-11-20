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
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { InspectionReport } from '@/types/InspectionReport';

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

  return (
    <div className="grid grid-cols-2 w-full space-x-3">
      {/* Chart */}
      <Card>This is for the Chart</Card>
      {/* Report details */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inspection Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Report Code</p>
                <p className="text-lg font-semibold">{inspectionReport.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="outline" className="mt-1">
                  {inspectionReport.inspectionRequest.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-lg font-semibold flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {new Date(inspectionReport.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                <p className="text-lg font-semibold flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {new Date(inspectionReport.updateAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Inspection Details */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Inspection Details</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Approved</TableHead>
                      <TableHead className="text-right">Defective</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionReport.inspectionReportDetail.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell className="font-medium">
                          {detail?.materialPackage?.name || 'null name'}
                        </TableCell>
                        <TableCell className="text-right">{detail.quantityByPack}</TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end">
                            <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                            {detail.approvedQuantityByPack}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end">
                            <XCircleIcon className="mr-2 h-4 w-4 text-red-500" />
                            {detail.defectQuantityByPack}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Associated Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Associated Request</h3>
                <p>
                  <strong>Import Request Code:</strong>{' '}
                  {inspectionReport?.inspectionRequest?.importRequest?.code}
                </p>
                <p>
                  <strong>PO Delivery Code:</strong>{' '}
                  {/* {inspectionReport?.inspectionRequest?.importRequest?.poDelivery?.code} */}
                  Po Code
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Responsible Parties</h3>
                <p>
                  <strong>Warehouse Manager:</strong>{' '}
                  {
                    inspectionReport?.inspectionRequest?.importRequest?.warehouseManager?.account
                      .firstName
                  }{' '}
                  {
                    inspectionReport?.inspectionRequest?.importRequest?.warehouseManager?.account
                      ?.lastName
                  }
                </p>
                <p>
                  <strong>Purchasing Staff:</strong>{' '}
                  {
                    inspectionReport?.inspectionRequest?.importRequest?.purchasingStaff?.account
                      ?.firstName
                  }{' '}
                  {
                    inspectionReport?.inspectionRequest?.importRequest?.purchasingStaff?.account
                      ?.lastName
                  }
                </p>
                <p>
                  <strong>Inspection Department:</strong>{' '}
                  {inspectionReport?.inspectionRequest?.inspectionDepartment?.account?.firstName}{' '}
                  {inspectionReport?.inspectionRequest?.inspectionDepartment?.account?.lastName}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionRequestChart;
