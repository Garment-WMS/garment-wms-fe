import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import empty from '@/assets/images/null_placeholder.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface KanbanDisplayCardProps {
  product: any;
  onSelectItem?: (item: any) => void;
  isChoosen?: boolean;
}

const KanbanDisplayCard: React.FC<KanbanDisplayCardProps> = ({
  product,
  onSelectItem = () => {},
  isChoosen
}) => {
  const handleSelect = () => {
    onSelectItem(product);
  };

  return (
    <>
      <div className={cn(isChoosen ? 'opacity-45' : 'cursor-pointer')}>
          <Card key={product.id} className="overflow-hidden" onClick={!isChoosen ? handleSelect : undefined}>
          <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-sm flex items-center">{product.name}</h3>
                  {product.code && <p className="text-xs text-gray-500">[{product.code}]</p>}
                  {product.materialPackage && (
                    <p className="text-xs text-gray-500">
                      {product.materialPackage.length} Package Variants
                    </p>
                  )}
                  {product.productSize && (
                    <p className="text-xs text-gray-500">
                      {product.productSize.length} Package Variants
                    </p>
                  )}
                  {product.material && (
                    <p className="text-xs text-gray-500">{product.material.name}</p>
                  )}
                  {product.product && (
                    <p className="text-xs text-gray-500">{product.product.name}</p>
                  )}
                  {product.onHand !== undefined && (
                    <p className="text-xs text-gray-500">Quantity: {product.onHand}</p>
                  )}
                </div>
                <div className="w-16 h-16">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="object-cover rounded" />
                  ) : (
                    <img src={empty} alt={product.name} className="object-cover rounded" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  );
};

export default KanbanDisplayCard;
