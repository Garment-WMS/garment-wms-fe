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
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import DefectsSummary from './DefectsSummary';
import { useGetAllDefects } from '@/hooks/useGetAllDefects';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { Link } from 'react-router-dom';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';

const InspectionRequestChart: React.FC<{
  inspectionReport: any;
  inspectionRequestType: string;
}> = ({ inspectionReport, inspectionRequestType }) => {
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
  console.log(inspectionReport);

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inspection Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="overflow-x-auto">
                <Table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-md px-3">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Inspected At</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">No. Pass</TableHead>
                      <TableHead className="text-right">No. Failed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionRequestType === InspectionRequestType.MATERIAL
                      ? inspectionReport.inspectionReportDetail.map((detail: any) => (
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
                            <TableCell className="text-green-600">
                              {convertDateWithTime(inspectionReport.createdAt) || 'N/A'}
                            </TableCell>
                            <TableCell className="text-right text-slate-700 font-semibold">
                              {detail?.quantityByPack ||
                                detail?.approvedQuantityByPack + detail?.defectQuantityByPack ||
                                0}
                            </TableCell>
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
                        ))
                      : inspectionReport.inspectionReportDetail.map((detail: any) => (
                          <TableRow key={detail.id}>
                            <TableCell>
                              <img
                                src={
                                  detail.productSize?.productVariant?.image ||
                                  'https://via.placeholder.com/100'
                                }
                                alt={detail.productSize?.name || 'Product'}
                                className="w-20 h-20 object-cover"
                              />
                            </TableCell>
                            <TableCell>{detail.productSize?.name || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge>{detail.productSize?.code || 'N/A'}</Badge>
                            </TableCell>
                            <TableCell>
                              <Link
                                to={`/import-receipt/${inspectionReport.importReceipt?.id}`}
                                className="text-bluePrimary underline underline-offset-2">
                                {inspectionReport.importReceipt?.code || 'N/A'}
                              </Link>
                            </TableCell>
                            <TableCell className="text-green-700">
                              {convertDateWithTime(inspectionReport.createdAt) || 'N/A'}
                            </TableCell>
                            <TableCell className="text-right text-slate-700 font-semibold">
                              {detail?.quantityByPack ||
                                detail?.approvedQuantityByPack + detail?.defectQuantityByPack ||
                                0}
                            </TableCell>
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
