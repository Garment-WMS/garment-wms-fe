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
  const [selectedInspectionDetail, setSelectedInspectionDetail] = useState<any | null>(null);

  const { data: defectData, isPending: isDefectsLoading } = useGetAllDefects();

  if (!inspectionReport || isDefectsLoading) {
    return (
      <Card className="md:col-span-2">
        <EmptyDatacomponent />
      </Card>
    );
  }

  const defectsList = defectData?.data || [];
  const filteredDefects = defectsList.filter(
    (defect: any) => defect.type === inspectionRequestType
  );

  const handleViewDefects = (detailDefects: any[], inspectionDetail: any) => {
    const mappedDefects = filteredDefects.map((defect: any) => {
      const matchingDefect = detailDefects.find((d) => d.defectId === defect.id);
      return {
        id: defect.id,
        description: defect.description,
        quantity: matchingDefect?.quantityByPack || 0
      };
    });
    setSelectedDefectDetails(mappedDefects);
    setSelectedInspectionDetail(inspectionDetail);
    setOpenDialog(true);
  };

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
                <Table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-md">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="text-center">Image</TableHead>
                      <TableHead className="text-left">Name</TableHead>
                      <TableHead className="text-center">Code</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">No. Pass</TableHead>
                      <TableHead className="text-right">No. Failed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionRequestType === InspectionRequestType.MATERIAL
                      ? inspectionReport.inspectionReportDetail.map((detail: any) => (
                          <TableRow key={detail.id}>
                            <TableCell className="text-center">
                              <img
                                src={
                                  detail.materialPackage?.materialVariant?.image ||
                                  'https://via.placeholder.com/100'
                                }
                                alt={detail.materialPackage?.name || 'Material'}
                                className="w-20 h-20 object-cover"
                              />
                            </TableCell>
                            <TableCell className="text-left">
                              {detail.materialPackage?.name || 'N/A'}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge>{detail.materialPackage?.code || 'N/A'}</Badge>
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
                                        handleViewDefects(
                                          detail.inspectionReportDetailDefect || [],
                                          detail
                                        )
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
                            <TableCell className="text-center">
                              <img
                                src={
                                  detail.productSize?.productVariant?.image ||
                                  'https://via.placeholder.com/100'
                                }
                                alt={detail.productSize?.name || 'Product'}
                                className="w-20 h-20 object-cover"
                              />
                            </TableCell>
                            <TableCell className="text-left">
                              {detail.productSize?.name || 'N/A'}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge>{detail.productSize?.code || 'N/A'}</Badge>
                            </TableCell>
                            <TableCell className="text-right text-gray-500 font-bold">
                              {detail.quantityByPack ||
                                detail.approvedQuantityByPack + detail.defectQuantityByPack ||
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
                                        handleViewDefects(
                                          detail.inspectionReportDetailDefect || [],
                                          detail
                                        )
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
          <DefectsSummary
            defects={selectedDefectDetails}
            inspectionReportDetail={selectedInspectionDetail}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InspectionRequestChart;
