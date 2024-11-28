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
      <DialogTrigger asChild>
        <Button variant="outline">View Material Receipt Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        {isLoading ? (
          <div>
            <Loading />
          </div>
        ) : materialReceipt ? (
          <>
            <DialogHeader>
              <DialogTitle>Material Receipt Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div className="flex gap-4 justify-between">
                  <section>
                    <p>
                      <strong>Receipt Code:</strong> {materialReceipt.code}
                    </p>
                    <p>
                      <strong>Material:</strong>{' '}
                      {materialReceipt.materialPackage.materialVariant.material.name} (
                      {materialReceipt.materialPackage.materialVariant.material.code})
                    </p>
                    <p>
                      <strong>Variant:</strong>{' '}
                      {materialReceipt.materialPackage.materialVariant.name} (
                      {materialReceipt.materialPackage.materialVariant.code})
                    </p>
                    <p>
                      <strong>Package:</strong> {materialReceipt.materialPackage.name} (
                      {materialReceipt.materialPackage.code})
                    </p>
                    <p>
                      <strong>Import Date:</strong>{' '}
                      {format(new Date(materialReceipt.importDate), 'PPP')}
                    </p>
                    <p>
                      <strong>Expire Date:</strong>{' '}
                      {format(new Date(materialReceipt.expireDate), 'PPP')}
                    </p>
                  </section>
                  <section className="flex-row">
                    <p>
                      <strong>Expire Date:</strong>{' '}
                      {format(new Date(materialReceipt.expireDate), 'PPP')}
                    </p>
                    <p>
                      <strong>Initial Quantity:</strong> {materialReceipt.quantityByPack}
                    </p>
                    <p>
                      <strong>Remaining Quantity:</strong> {materialReceipt.remainQuantityByPack}
                    </p>
                    <p>
                      <strong>Status:</strong> {convertTitleToTitleCase(materialReceipt.status)}
                    </p>
                  </section>
                </div>

                <Tabs defaultValue="exports">
                  <TabsList>
                    <TabsTrigger value="exports">Export History</TabsTrigger>
                    <TabsTrigger value="adjustments">Adjustment History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="exports">
                    <h3 className="text-lg font-semibold mb-2">Export History</h3>
                    {materialReceipt.materialExportReceiptDetail?.length > 0 ? (
                      materialReceipt.materialExportReceiptDetail.map((export_, index) => (
                        <div key={export_.id} className="mb-4 p-2 border rounded">
                          <p>
                            <strong>Export #{index + 1}</strong>
                          </p>
                          <p>
                            <strong>Export Code:</strong> {export_.materialExportReceipt.code}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {export_.quantityByPack}
                          </p>
                          <p>
                            <strong>Type:</strong> {export_.materialExportReceipt.type}
                          </p>
                          <p>
                            <strong>Status:</strong> {export_.materialExportReceipt.status}
                          </p>
                          <p>
                            <strong>Date:</strong>{' '}
                            {format(new Date(export_.materialExportReceipt.startedAt), 'PPP')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">Nothing to display</p>
                    )}
                  </TabsContent>
                  <TabsContent value="adjustments">
                    <h3 className="text-lg font-semibold mb-2">Adjustment History</h3>
                    {materialReceipt.receiptAdjustment?.length > 0 ? (
                      materialReceipt.receiptAdjustment.map((adjustment, index) => (
                        <div key={adjustment.id} className="mb-4 p-2 border rounded">
                          <p>
                            <strong>Adjustment #{index + 1}</strong>
                          </p>
                          <p>
                            <strong>Before:</strong> {adjustment.beforeAdjustQuantity}
                          </p>
                          <p>
                            <strong>After:</strong> {adjustment.afterAdjustQuantity}
                          </p>
                          <p>
                            <strong>Status:</strong> {adjustment.status}
                          </p>
                          <p>
                            <strong>Date:</strong> {format(new Date(adjustment.adjustedAt), 'PPP')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">Nothing to display</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
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
