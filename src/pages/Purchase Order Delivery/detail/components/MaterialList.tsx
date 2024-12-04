import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Package, Weight, Ruler, Box, CheckCircle, XCircle, CalendarX2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { convertDate } from '@/helpers/convertDate';
import { PODeliveryDetail } from '@/types/PurchaseOrder';
import { pluralize } from '@/helpers/pluralize';
import { PurchaseOrderDeliveryStatus } from '@/enums/purchaseOrderDeliveryStatus';

interface MaterialListProps {
  status?: string;
  detail: PODeliveryDetail;
}

const MaterialList: React.FC<MaterialListProps> = ({ detail, status }) => {
  const { materialPackage, quantityByPack, expiredDate, actualImportQuantity } = detail;
  const { materialVariant } = materialPackage;
  const { material } = materialVariant;

  // Calculate the failed quantity
  const failedQuantity = quantityByPack - actualImportQuantity;

  const displayImported =
    status === PurchaseOrderDeliveryStatus.FINISHED
      ? `${actualImportQuantity.toLocaleString()} ${pluralize(materialPackage.packUnit, actualImportQuantity)}`
      : 'Not Yet';

  const displayFailed =
    status === PurchaseOrderDeliveryStatus.FINISHED
      ? `${failedQuantity.toLocaleString()} ${pluralize(materialPackage.packUnit, failedQuantity)}`
      : 'Not Yet';

  return (
    <Card className="w-full mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Image and Material Info */}
          <div className="flex items-center gap-4">
            <img
              src={materialVariant.image}
              alt={materialPackage.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">{materialPackage.name}</h2>
                <Badge className="bg-blue-500">{materialVariant.code}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge className="bg-green-500">{material.code}</Badge>
              </div>
              <div className="text-sm text-gray-500 mt-2 flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      <Package size={16} />
                      {materialPackage.packUnit} ({materialPackage.uomPerPack}{' '}
                      {pluralize(material.materialUom.uomCharacter, materialPackage.uomPerPack)})
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pack Unit and Quantity per Pack</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      <CalendarX2 size={16} className="text-gray-600" />
                      <span>{convertDate(expiredDate || '')}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expiration Date</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Quantity and Expiry Info */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <Box size={24} className="" />
              <span className="text-3xl font-bold ">{quantityByPack.toLocaleString()}</span>
              <span className="text-lg font-semibold text-gray-600 lowercase">
                {pluralize(materialPackage.packUnit, quantityByPack)}
              </span>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-lg font-semibold text-green-600">
                  Imported: {displayImported}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={20} className="text-red-500" />
                <span className="text-lg font-semibold text-red-600">Failed: {displayFailed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Material Details */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Ruler size={16} />
                {materialPackage.packedLength} x {materialPackage.packedWidth} x{' '}
                {materialPackage.packedHeight} {material.materialUom.name}
              </TooltipTrigger>
              <TooltipContent>
                <p>Packed Dimensions (L x W x H)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Weight size={16} />
                {materialPackage.packedWeight} kg
              </TooltipTrigger>
              <TooltipContent>
                <p>Packed Weight</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialList;
