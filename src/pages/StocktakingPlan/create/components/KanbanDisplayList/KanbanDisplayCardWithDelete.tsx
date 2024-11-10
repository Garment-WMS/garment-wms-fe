import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import empty from '@/assets/images/null_placeholder.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanDisplayCardProps {
  product: any;
  onDelete: () => void; 
}

const KanbanDisplayCardWithDelete: React.FC<KanbanDisplayCardProps> = ({ product, onDelete }) => {


  return (
    <div>
       <Card key={product.id} className="overflow-hidden relative">
       
        <button
          onClick={onDelete}  
          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X size={16} />
        </button>
        <CardContent className="p-4">
              <div className="flex justify-between items-start">
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
  );
};

export default KanbanDisplayCardWithDelete;
