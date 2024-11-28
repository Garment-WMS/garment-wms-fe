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
import { ProductReceipt } from '@/types/ProductType';
import { productApi, productVariantApi } from '@/api/services/productApi';
type Props = {
  id: string;
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const ReceiptDetailsDialog = ({ id, isOpen, setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productReceipt, setProductReceipt] = useState<ProductReceipt>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await privateCall(productVariantApi.getOneProductReceiptDetails(id));
        setProductReceipt(res.data.data);
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
        <Button variant="outline">View Product Receipt Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        {isLoading ? (
          <div>
            <Loading />
          </div>
        ) : productReceipt ? (
          <>
            <DialogHeader>
              <DialogTitle>Material Receipt Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div className="flex gap-4 justify-between">
                  <section>
                    <p>
                      <strong>Receipt Code:</strong> {productReceipt.code}
                    </p>
                    <p>
                      <strong>Material:</strong>{' '}
                      {productReceipt.productSize.productVariant.product.name} (
                      {productReceipt.productSize.productVariant.product.code})
                    </p>
                    <p>
                      <strong>Variant:</strong>{' '}
                      {productReceipt.productSize.productVariant.name} (
                      {productReceipt.productSize.productVariant.code})
                    </p>
                    <p>
                      <strong>Package:</strong> {productReceipt.productSize.name} (
                      {productReceipt.productSize.code})
                    </p>
                    <p>
                      <strong>Import Date:</strong>{' '}
                      {format(new Date(productReceipt.importDate), 'PPP')}
                    </p>
                    <p>
                      <strong>Expire Date:</strong>{' '}
                      {format(new Date(productReceipt.expireDate), 'PPP')}
                    </p>
                  </section>
                  <section className="flex-row">
                    <p>
                      <strong>Expire Date:</strong>{' '}
                      {format(new Date(productReceipt.expireDate), 'PPP')}
                    </p>
                    <p>
                      <strong>Initial Quantity:</strong> {productReceipt.quantityByUom}
                    </p>
                    <p>
                      <strong>Remaining Quantity:</strong> {productReceipt.remainQuantityByUom}
                    </p>
                    <p>
                      <strong>Status:</strong> {convertTitleToTitleCase(productReceipt.status)}
                    </p>
                  </section>
                </div>

                <Tabs defaultValue="adjustments">
                  <TabsList>
                    <TabsTrigger value="adjustments">Adjustment History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="adjustments">
                    <h3 className="text-lg font-semibold mb-2">Adjustment History</h3>
                    {productReceipt.receiptAdjustment?.length > 0 ? (
                      productReceipt.receiptAdjustment.map((adjustment, index) => (
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
