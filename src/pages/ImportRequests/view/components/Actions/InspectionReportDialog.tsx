'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, Package, AlertTriangle, Check } from 'lucide-react';
import { InspectionReport } from '@/types/InspectionReport';
import { Separator } from '@/components/ui/Seperator';
import { CgClose } from 'react-icons/cg';

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
    window.open(url, '_blank'); // Opens in a new tab
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Inspection Report</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Inspection Report Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">General Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold">Report Code</p>
                  <p>{inspectionReport.code}</p>
                </div>
                <div>
                  <p className="font-semibold">Type</p>
                  <Badge>{inspectionReport.type}</Badge>
                </div>
                <div className="mt-4">
                  <Button onClick={handleClick}>Go to inspection report</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Inspection Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspectionReport.inspectionReportDetail.map((detail, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {detail?.materialPackage
                            ? detail.materialPackage.name
                            : detail?.productSize
                              ? detail.productSize.name
                              : 'N/A'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {detail?.materialPackage ? (
                          <div className="space-y-2">
                          <p>
                            <strong>Package Code:</strong> {detail?.materialPackage?.code ?? 'N/A'}
                          </p>
                          <p>
                            <strong>Total Quantity:</strong> {detail.quantityByPack}{' '}
                            {detail?.materialPackage?.packUnit ?? 'Units'}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                (detail?.approvedQuantityByPack /
                                  (detail?.approvedQuantityByPack + detail?.defectQuantityByPack ||
                                    0)) *
                                100
                              }
                              className="w-1/2"
                            />
                            <div className="flex justify-center items-center gap-2">
                              <span>{detail.approvedQuantityByPack} </span>
                              Approved
                              <Check />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                (detail.defectQuantityByPack /
                                  (detail?.approvedQuantityByPack + detail?.defectQuantityByPack ||
                                    0)) *
                                100
                              }
                              className="w-1/2"
                            />
                            <div className="flex justify-center items-center gap-2">
                              <span>{detail.defectQuantityByPack} </span>
                              Defect
                              <CgClose />
                            </div>
                          </div>
                        </div>
                        ):(
                          <div className="space-y-2">
                          <p>
                            <strong>Size Code:</strong> {detail?.productSize?.code ?? 'N/A'}
                          </p>
                          <p>
                            <strong>Total Quantity:</strong> {detail.quantityByPack}{' '}
                            {detail?.productSize?.uom?.name ?? 'Units'}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                (detail?.approvedQuantityByPack /
                                  (detail?.approvedQuantityByPack + detail?.defectQuantityByPack ||
                                    0)) *
                                100
                              }
                              className="w-1/2"
                            />
                            <div className="flex justify-center items-center gap-2">
                              <span>{detail.approvedQuantityByPack} </span>
                              Approved
                              <Check />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                (detail.defectQuantityByPack /
                                  (detail?.approvedQuantityByPack + detail?.defectQuantityByPack ||
                                    0)) *
                                100
                              }
                              className="w-1/2"
                            />
                            <div className="flex justify-center items-center gap-2">
                              <span>{detail.defectQuantityByPack} </span>
                              Defect
                              <CgClose />
                            </div>
                          </div>
                        </div>
                        )}
                        
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
