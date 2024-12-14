import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import empty from '@/assets/images/null_placeholder.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
type Props = {
  product: any;
};

const KanbanDisplayCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleMaterialViewClick = (requestId: string) => {
    // const basePath = location.pathname.split('/material')[0]; // Get base path (either manager or purchase-staff)

    // Navigate to the new route
    navigate(`/material-variant/${requestId}`);
  };

  const handleProductViewClick = (requestId: string) => {
    const basePath = location.pathname.split('/product-variant')[0];

    // Navigate to the new route
    navigate(`${basePath}/product-variant/${requestId}`);
  };

  return (
    <Link
      to="#"
      key={product.id}
      onClick={() =>
        product.id && product.material
          ? handleMaterialViewClick(product.id)
          : handleProductViewClick(product.id)
      }>
      <Card key={product.id} className="overflow-hidden relative">
        {product?.onHandUom < product?.reorderLevel && (
          <HoverCard>
            <HoverCardTrigger>
              <AlertCircle className="absolute top-1 right-1 p-1  text-yellow-500 rounded-full" />
            </HoverCardTrigger>
            <HoverCardContent side="bottom" align="start" className="mt-2 ml-8">
              <Alert variant={'warning'} className=" ">
                <AlertCircle size={22} className="text-yellow-500" />
                <AlertTitle className="font-bold">Low Quantity</AlertTitle>
                <AlertDescription className="flex items-center gap-1">
                  The quantity is low.
                </AlertDescription>
              </Alert>{' '}
            </HoverCardContent>
          </HoverCard>
        )}
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="w-full max-w-[170px] truncate">
              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
              {product.code && <p className="text-xs text-gray-500 truncate">[{product.code}]</p>}
              {product.materialPackage && (
                <p className="text-xs text-gray-500">
                  {product.materialPackage.length} Package Variants
                </p>
              )}
              {product.productSize && (
                <p className="text-xs text-gray-500">{product.productSize.length} Sizes</p>
              )}

              {product.material && (
                <p className="text-xs text-gray-500 truncate">{product.material.name}</p>
              )}
              {product.product && (
                <p className="text-xs text-gray-500 truncate">{product.product.name}</p>
              )}
              {/* {product.onHand !== null && product.onHand !== undefined && (
                <p className="text-xs text-gray-500">
                  Quantity: {product.onHand} {product?.materialPackage[0]?.packUnit}
                </p>
              )} */}
              {product.onHand !== null &&
              product.onHand !== undefined &&
              product?.materialPackage ? (
                <>
                  <p className="text-xs text-gray-500">
                    Quantity by package: {product.onHand} {product?.materialPackage[0]?.packUnit}
                  </p>
                  <p className="text-xs text-gray-500">
                    Quantity by Uom: {product?.onHandUom}{' '}
                    {product?.material?.materialUom?.uomCharacter}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-500">Quantity: {product.onHandQualified}</p>
              )}
            </div>
            <div className="w-16 h-16">
              {product.image ? (
                <AspectRatio ratio={16 / 9}>
                  <img src={product.image} alt={product.name} className="object-cover rounded" />
                </AspectRatio>
              ) : (
                <AspectRatio ratio={16 / 9}>
                  <img src={empty} alt={product.name} className="object-cover rounded" />
                </AspectRatio>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default KanbanDisplayCard;
