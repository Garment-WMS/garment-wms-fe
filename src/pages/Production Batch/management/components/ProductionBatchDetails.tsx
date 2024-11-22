import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductionBatchStatusColors } from '@/enums/productionBatch';
import { convertDate } from '@/helpers/convertDate';
import { ProductionBatch } from '@/types/ProductionBatch';

interface ProductionBatchDetailsProps {
  data: ProductionBatch;
}

export function ProductionBatchDetails({ data }: ProductionBatchDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Batch Code</h3>
          <p className="text-lg font-semibold">{data.code}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Batch Name</h3>
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Quantity to Produce</h3>
          <p className="text-lg font-semibold">{data.quantityToProduce}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <Badge className={`mt-1 ${ProductionBatchStatusColors[data.status]}`}>
            {data.status}
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Product Details</h3>
        <div className="flex items-center space-x-4">
          <img
            src={data?.productionPlanDetail?.productSize.productVariant.image}
            alt={data?.productionPlanDetail?.productSize.productVariant.name}
            width={100}
            height={100}
            className="rounded-md"
          />
          <div>
            <p className="font-medium">
              {data.productionPlanDetail?.productSize.productVariant.product.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {data.productionPlanDetail?.productSize.productVariant.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Size: {data.productionPlanDetail?.productSize.size}
            </p>
            <p className="text-sm text-muted-foreground">
              UOM:{' '}
              {
                data.productionPlanDetail?.productSize.productVariant.product.productUom
                  .uomCharacter
              }
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Import Requests</h3>
        {data?.importRequest?.map((request) => (
          <Card key={request.id} className="mb-4">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">{request.code}</p>
                <Badge variant="outline">{request.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Type: {request.type}</p>
              <p className="text-sm text-muted-foreground">
                Quantity: {request.importRequestDetail[0]?.quantityByPack || 'N/A'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
          <p className="text-sm">{convertDate(data?.createdAt || '')}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Updated At</h3>
          <p className="text-sm">{convertDate(data?.updatedAt || '')}</p>
        </div>
      </div>
    </div>
  );
}
