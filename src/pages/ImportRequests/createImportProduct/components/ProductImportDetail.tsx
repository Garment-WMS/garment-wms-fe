import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/Seperator';
import { ProductionBatch } from '@/types/ProductionBatch';
import { Package2, Ruler, Scale } from 'lucide-react';

import { z } from 'zod';

type Props = {
  selectedProductionBatch: ProductionBatch;
};
const formSchema = z.object({
  number: z
    .number({
      required_error: 'Number is required',
      invalid_type_error: 'Number must be a valid number'
    })
    .int('Number must be an integer')
    .positive('Number must be positive')
    .lte(10000, 'Number must be less than or equal to 10000')
});
const ProductImportDetail = ({ selectedProductionBatch }: Props) => {
  const product = selectedProductionBatch?.productionPlanDetail?.productSize.productVariant;

  return (
    <div className="p-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/40">
          <CardTitle className="text-xl">Import Details</CardTitle>
          <CardDescription>Overview of the production plan and associated batch</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Image */}
              <div className="relative w-full md:w-[200px] aspect-square rounded-lg border overflow-hidden bg-muted/10">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-2xl font-semibold tracking-tight">{product?.name}</h2>
                  <div className="mt-2 flex items-center">
                    <Package2 className="w-4 h-4 mr-2 text-slate-700" />
                    <span className="text-sms font-semibold text-green-600">
                      <span className="text-slate-700">Import Quantity:</span>{' '}
                      {selectedProductionBatch.quantityToProduce}{' '}
                      {product?.product.productUom.uomCharacter}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    Size: {selectedProductionBatch?.productionPlanDetail?.productSize.size}
                  </Badge>
                </div>

                <Separator className="my-4" />

                {/* Dimensions Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      Width
                    </div>
                    <p className="font-medium">
                      {selectedProductionBatch?.productionPlanDetail?.productSize.width}m
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      Height
                    </div>
                    <p className="font-medium">
                      {selectedProductionBatch?.productionPlanDetail?.productSize.height}m
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      Length
                    </div>
                    <p className="font-medium">
                      {selectedProductionBatch?.productionPlanDetail?.productSize.length}m
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Scale className="w-4 h-4" />
                      Weight
                    </div>
                    <p className="font-medium">
                      {selectedProductionBatch?.productionPlanDetail?.productSize.weight}kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductImportDetail;
