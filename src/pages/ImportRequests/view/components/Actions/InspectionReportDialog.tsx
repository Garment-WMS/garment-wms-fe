import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, XCircle, ExternalLink, Package, Ruler } from 'lucide-react';
import { InspectionReport } from '@/types/InspectionReport';

export default function InspectionReportDialog({
  inspectionReqId,
  inspectionReport
}: {
  inspectionReqId: string;
  inspectionReport: InspectionReport;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    const url = `/report/${inspectionReqId}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Inspection Report</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="h-[90vh]">
          <DialogHeader className="p-6 pb-0 sticky top-0 bg-white z-10">
            <DialogTitle className="text-2xl font-bold">Inspection Report Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">General Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold">Report Code</p>
                  <p>{inspectionReport.code}</p>
                </div>
                <div>
                  <p className="font-semibold">Type</p>
                  <Badge>{inspectionReport.type}</Badge>
                </div>
                <div className="flex items-center justify-start md:justify-end">
                  <Button onClick={handleClick} className="flex items-center gap-2">
                    <span>Go to inspection report</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Inspection Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {inspectionReport.inspectionReportDetail.map((detail, index) => (
                    <Card key={index} className="shadow-md">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              detail.materialPackage
                                ? detail.materialPackage.materialVariant.image
                                : detail.productSize?.productVariant.image
                            }
                            alt={
                              detail.materialPackage
                                ? detail.materialPackage.materialVariant.name
                                : detail.productSize?.name
                            }
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <CardTitle className="text-lg mb-2">
                              {detail?.materialPackage
                                ? detail.materialPackage.name
                                : detail?.productSize
                                  ? detail.productSize.name
                                  : 'N/A'}
                            </CardTitle>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {detail?.materialPackage ? (
                                <>
                                  <Package className="w-4 h-4" />
                                  <span>Material</span>
                                </>
                              ) : (
                                <>
                                  <Ruler className="w-4 h-4" />
                                  <span>Product</span>
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold">
                                {detail?.materialPackage ? 'Package Code:' : 'Size Code:'}
                              </p>
                              <p>
                                {detail?.materialPackage?.code ??
                                  detail?.productSize?.code ??
                                  'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold">Total Quantity:</p>
                              <p className="text-lg font-semibold text-slate-800">
                                {detail.quantityByPack}{' '}
                                {detail?.materialPackage?.packUnit ??
                                  detail?.productSize?.uom?.name ??
                                  'Units'}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-semibold">Approved</span>
                              </div>
                              <span className="text-lg font-semibold text-green-800">
                                {detail.approvedQuantityByPack}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {(
                                (detail.approvedQuantityByPack / detail.quantityByPack) *
                                100
                              ).toFixed(2)}
                              % of total
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-500" />
                                <span className="font-semibold">Defect</span>
                              </div>
                              <span className="text-lg font-semibold text-red-800">
                                {detail.defectQuantityByPack}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {(
                                (detail.defectQuantityByPack / detail.quantityByPack) *
                                100
                              ).toFixed(2)}
                              % of total
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
