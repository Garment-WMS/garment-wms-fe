import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { ProductSize } from '@/types/ProductType';
type Props = {
  productSizes: ProductSize[];
};
export default function ProductSizeAndFormula({ productSizes }: Props) {
  return (
    <div className="container mx-auto p-4 space-y-8 overflow-auto h-[400px]">
    {productSizes?.map((productSize) => (
      <Card key={productSize.id} className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">
            <div className=" font-bold">{productSize.name}</div>{' '}
            <div className="text-lg font-semibold">
              Quantity: {productSize?.inventoryStock?.quantityByUom | 0} units
            </div>
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{productSize.code}</Badge>
            <Badge variant="outline">Size: {productSize.size}</Badge>
            <Badge variant="outline">Width: {productSize.width} m</Badge>
            <Badge variant="outline">Height: {productSize.height} m</Badge>
            <Badge variant="outline">Leight: {productSize.length} m</Badge>
            <Badge variant="outline">Weight: {productSize.weight} kg</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="formulas">
              <AccordionTrigger>Product Formulas</AccordionTrigger>
              <AccordionContent>
                {productSize?.productFormula?.length > 0 ? (
                  productSize?.productFormula?.map((formula) => (
                    <Card key={formula.id} className="mb-4">
                      <CardHeader>
                        <CardTitle className="">{formula.name}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">{formula.code}</Badge>
                          <Badge variant={formula.isBaseFormula ? 'default' : 'secondary'}>
                            {formula.isBaseFormula ? 'Base Formula' : 'Extended Formula'}
                          </Badge>
                          <Badge variant="outline">
                            Quantity: {formula.quantityRangeStart} - {formula.quantityRangeEnd}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-2">Materials:</h4>
                        <div className="space-y-4">
                          {formula.productFormulaMaterial.map((material, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={material.materialVariant.image ?? ''}
                                  alt={material.materialVariant.name}
                                />
                                <AvatarFallback>
                                  {material.materialVariant.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{material.materialVariant.name}</p>
                                <p className="text-sm text-gray-500">
                                  {material.materialVariant.code}
                                </p>
                                <p className="text-sm">
                                  Quantity: {material.quantityByUom}{' '}
                                  {material?.materialVariant?.material?.materialUom?.uomCharacter}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>No formulas available for this product size.</p>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="receipts">
              <AccordionTrigger>Product Receipts</AccordionTrigger>
              {productSize.productReceipt && productSize.productReceipt.length > 0 ? (
                <AccordionContent>
                  {productSize.productReceipt.map((receipt) => (
                    <Card key={receipt.id} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Receipt: {receipt.code}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">Status: {receipt.status}</Badge>
                          <Badge variant="outline">
                            Import Date: {new Date(receipt.importDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>Quantity: {receipt.quantityByUom}</p>
                        <p>Remaining Quantity: {receipt.remainQuantityByUom}</p>
                      </CardContent>
                    </Card>
                  ))}
                </AccordionContent>
              ):
              (
                  <AccordionContent>
                      <p>No receipts available for this product size.</p>
                  </AccordionContent>
              )
          
          }{' '}
            </AccordionItem>
          </Accordion> */}
        </CardContent>
      </Card>
    ))}
  </div>
  );
}
