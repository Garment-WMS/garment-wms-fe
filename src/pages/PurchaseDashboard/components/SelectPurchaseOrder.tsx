import { PurchaseOrder } from '@/types/PurchaseOrder';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import { ScrollArea } from '@/components/ui/ScrollArea';
interface SelectPOProps {
  purchaseOrderList: PurchaseOrder[];
  isLoading?: boolean;
  onPOSelect: (planId: string) => void; // Callback for selecting a plan
}

const SelectPurchaseOrder = ({ purchaseOrderList, onPOSelect, isLoading }: SelectPOProps) => {
  const formattedPurchaseOrderList = Array.isArray(purchaseOrderList)
    ? purchaseOrderList.map((purchaseOrder) => ({
        label: purchaseOrder.poNumber,
        value: purchaseOrder.id
      }))
    : [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (purchaseOrderList.length > 0 && !isInitialized) {
      const initialPlanId = purchaseOrderList[0].id;
      setSelectedId(initialPlanId); 
      onPOSelect(initialPlanId); 
      setIsInitialized(true); 
    }
  }, [purchaseOrderList]);
  return (
    <Select
      disabled={isLoading || formattedPurchaseOrderList.length === 0}
      value={selectedId ?? undefined}
      onValueChange={(value) => {
        setSelectedId(value); 
        onPOSelect(value); 
      }}
    >
      <SelectTrigger className="max-w-[1000px] w-auto">
        <SelectValue placeholder={isLoading ? 'Loading plans...' : 'Select a Purchase Order'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Purchase Order</SelectLabel>
          <ScrollArea className='h-32 rounded-md '>
            {formattedPurchaseOrderList.map((plan) => (
              <SelectItem key={plan.value} value={plan.value}>
                {plan.label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectPurchaseOrder;
