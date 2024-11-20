import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import empty from '@/assets/images/null_placeholder.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type Props = {
  product : any
};

const KanbanDisplayCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleViewClick = (requestId: string) => {
    // const basePath = location.pathname.split('/material')[0]; // Get base path (either manager or purchase-staff)

    // Navigate to the new route
    navigate(`/material-variant/${requestId}`);
  };

  return (
    <Link to="#" key={product.id} onClick={() => product.id && handleViewClick(product.id)}>
      <Card key={product.id} className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="w-full max-w-[130px] truncate">
              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
              {product.code && <p className="text-xs text-gray-500 truncate">[{product.code}]</p>}
              {product.materialPackage && (
                <p className="text-xs text-gray-500">
                  {product.materialPackage.length} Package Variants
                </p>
              )}
              {product.productSize && (
                <p className="text-xs text-gray-500">
                  {product.productSize.length} Size 
                </p>
              )}

              {product.material && <p className="text-xs text-gray-500 text-ellipsis">{product.material.name}</p>}
              {product.product && <p className="text-xs text-gray-500 text-ellipsis">{product.product.name}</p>}
              {product.onHand !== null && product.onHand !== undefined && (
                <p className="text-xs text-gray-500">Quantity: {product.onHand}</p>
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
