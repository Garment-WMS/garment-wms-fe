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

import { ProductReceipt } from '@/types/ProductType';
import { productApi, productVariantApi } from '@/api/services/productApi';
import { AlertTriangle, Calendar, Package, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Seperator';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        {isLoading ? (
          <div>
            <Loading />
          </div>
        ) : productReceipt ? (
          <>
            <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Product Receipt Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full px-6 pb-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
              {/* <TabsTrigger value="inspection">Inspection</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger> */}
            </TabsList>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Product Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <img
                      src={productReceipt.productSize.productVariant.image ?? ''}
                      alt={productReceipt.productSize.productVariant.name}
                      width={300}
                      height={300}
                      className="rounded-lg shadow-md"
                    />
                    <div className="flex items-center space-x-2">
                      <Badge variant={productReceipt.status === 'AVAILABLE' ? 'success' : 'destructive'}>
                        {productReceipt.status}
                      </Badge>
                      {productReceipt.isDefect && (
                        <Badge variant="warning" className="flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Defective
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{productReceipt.productSize.productVariant.product.name}</h3>
                      <p className="text-muted-foreground">{productReceipt.productSize.productVariant.name} - Size {productReceipt.productSize.size}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 mr-2 text-muted-foreground" />
                        <span>Receipt Code: {productReceipt.code}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                        <span>Import Date: {format(new Date(productReceipt.importDate), 'PPP')}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p>
                        <strong>Quantity:</strong> {productReceipt.quantityByUom} {productReceipt.productSize.productVariant.product.productUom.uomCharacter}
                      </p>
                      <p>
                        <strong>Remaining:</strong> {productReceipt.remainQuantityByUom} {productReceipt.productSize.productVariant.product.productUom.uomCharacter}
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
                      <p>{productReceipt.importReceipt.code}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Status</p>
                      <Badge>{productReceipt.importReceipt.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Type</p>
                      <p>{productReceipt.importReceipt.type}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Started At</p>
                      <p>{format(new Date(productReceipt.importReceipt.startedAt), 'PPP')}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Warehouse Manager</p>
                        <p>{`${productReceipt.importReceipt.warehouseManager.account.firstName} ${productReceipt.importReceipt.warehouseManager.account.lastName}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Warehouse Staff</p>
                        <p>{`${productReceipt.importReceipt.warehouseStaff.account.firstName} ${productReceipt.importReceipt.warehouseStaff.account.lastName}`}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inspection">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Inspection Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p><strong>Inspection Report Code:</strong> {productReceipt.importReceipt.inspectionReport.code}</p>
                  {productReceipt.importReceipt.inspectionReport.inspectionReportDetail.map((detail, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">Inspection Detail #{index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <p className="font-semibold">Approved Quantity</p>
                            <p>{detail.approvedQuantityByPack}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="font-semibold">Defect Quantity</p>
                            <p>{detail.defectQuantityByPack}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="font-semibold">Total Quantity</p>
                            <p>{detail.quantityByPack}</p>
                          </div>
                        </div>
                        {(detail?.inspectionReportDetailDefect?.length ?? 0) > 0 && (
                          <div>
                            <p className="font-semibold mb-2">Defects:</p>
                            <ul className="space-y-2">
                              {detail?.inspectionReportDetailDefect?.map((defect, defectIndex) => (
                                <li key={defectIndex} className="flex items-start space-x-2">
                                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                                  <span>
                                    {defect.defect.description} - Quantity: {defect.quantityByPack}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="adjustments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Receipt Adjustments</CardTitle>
                </CardHeader>
                <CardContent>
                  {productReceipt.receiptAdjustment.length > 0 ? (
                    <div className="space-y-4">
                      {productReceipt.receiptAdjustment.map((adjustment, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">Adjustment #{index + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-semibold">Before Quantity</p>
                                <p>{adjustment.beforeAdjustQuantity}</p>
                              </div>
                              <div>
                                <p className="font-semibold">After Quantity</p>
                                <p>{adjustment.afterAdjustQuantity}</p>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold">Status</p>
                              <Badge>{adjustment.status}</Badge>
                            </div>
                            <div>
                              <p className="font-semibold">Adjusted At</p>
                              <p>{format(new Date(adjustment.adjustedAt), 'PPP')}</p>
                            </div>
                           
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p>No adjustments have been made to this receipt.</p>
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
