import { OneMaterialReceipt } from '@/types/MaterialTypes';
import React, { Dispatch, useEffect, useState } from 'react';
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
import Loading from '@/components/common/Loading';
import privateCall from '@/api/PrivateCaller';
import { materialApi } from '@/api/services/materialApi';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import { Separator } from '@/components/ui/Seperator';
import { ArrowRight, Calendar, Package } from 'lucide-react';
type Props = {
  id: string;
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const ReceiptDetailsDialog = ({ id, isOpen, setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [materialReceipt, setMaterialReceipt] = useState<OneMaterialReceipt>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await privateCall(materialApi.getOneDetailMaterialReceipt(id));
        setMaterialReceipt(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        {isLoading ? (
          <div className='flex justify-center items-center h-[50vh]'>
            <Loading />
          </div>
        ) : materialReceipt ? (
          <>
            <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Material Receipt Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full px-6 pb-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Material Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <img
                      src={materialReceipt.materialPackage.materialVariant.image ?? ''}
                      alt={materialReceipt.materialPackage.materialVariant.name}
                      width={300}
                      height={300}
                      className="rounded-lg shadow-md"
                    />
                    <Badge variant={materialReceipt.status === 'AVAILABLE' ? 'success' : 'destructive'}>
                      {materialReceipt.status}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{materialReceipt.materialPackage.materialVariant.material.name}</h3>
                      <p className="text-muted-foreground">{materialReceipt.materialPackage.materialVariant.name}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 mr-2 text-muted-foreground" />
                        <span>Receipt Code: {materialReceipt.code}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                        <span>Import Date: {format(new Date(materialReceipt.importDate), 'PPP')}</span>
                      </div>
                      {materialReceipt.expireDate && (
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                          <span>Expire Date: {format(new Date(materialReceipt.expireDate), 'PPP')}</span>
                        </div>
                      )}
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p>
                        <strong>Quantity:</strong> {materialReceipt.quantityByPack} {materialReceipt.materialPackage.packUnit}
                      </p>
                      <p>
                        <strong>Remaining:</strong> {materialReceipt.remainQuantityByPack} {materialReceipt.materialPackage.packUnit}
                      </p>
                      <p>
                        <strong>Units per {materialReceipt.materialPackage.packUnit}:</strong> {materialReceipt.materialPackage.uomPerPack} {materialReceipt.materialPackage.materialVariant.material.materialUom.uomCharacter}
                      </p>
                    </div>



                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="import">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Import Receipt Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-semibold">Receipt Code</p>
                      <p>{materialReceipt.importReceipt.code}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Status</p>
                      <Badge>{materialReceipt.importReceipt.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Type</p>
                      <p>{materialReceipt.importReceipt.type}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Started At</p>
                      <p>{format(new Date(materialReceipt.importReceipt.startedAt), 'PPP')}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">Warehouse Manager</p>
                      <p>{`${materialReceipt.importReceipt.warehouseManager.account.firstName} ${materialReceipt.importReceipt.warehouseManager.account.lastName}`}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Warehouse Staff</p>
                      <p>{`${materialReceipt.importReceipt.warehouseStaff.account.firstName} ${materialReceipt.importReceipt.warehouseStaff.account.lastName}`}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="export">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Export Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {materialReceipt.materialExportReceiptDetail.length > 0 ? (
                    <div className="space-y-4">
                      {materialReceipt.materialExportReceiptDetail.map((export_, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">Export #{index + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p><strong>Export Code:</strong> {export_.materialExportReceipt.code}</p>
                            <p><strong>Quantity:</strong> {export_.quantityByPack} {materialReceipt.materialPackage.packUnit}</p>
                            <p><strong>Type:</strong> {export_.materialExportReceipt.type}</p>
                            <p><strong>Status:</strong> {export_.materialExportReceipt.status}</p>
                            <p><strong>Date:</strong> {format(new Date(export_.materialExportReceipt.startedAt), 'PPP')}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p>No export details available for this material receipt.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="adjustments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Receipt Adjustments</CardTitle>
                </CardHeader>
                <CardContent>
                  {materialReceipt.receiptAdjustment.length > 0 ? (
                    <div className="space-y-4">
                      {materialReceipt.receiptAdjustment.map((adjustment, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">Adjustment #{index + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span>{adjustment.beforeAdjustQuantity}</span>
                              <ArrowRight className="w-4 h-4" />
                              <span>{adjustment.afterAdjustQuantity}</span>
                              <span>{materialReceipt.materialPackage.packUnit}</span>
                            </div>
                            <p><strong>Status:</strong> <Badge>{adjustment.status}</Badge></p>
                            <p><strong>Adjusted At:</strong> {format(new Date(adjustment.adjustedAt), 'PPP')}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p>No adjustments have been made to this material receipt.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
          </>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-center">Material Receipt Not Found</h3>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDetailsDialog;
