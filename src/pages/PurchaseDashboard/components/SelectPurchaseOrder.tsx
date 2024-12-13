import { PurchaseOrder } from '@/types/PurchaseOrder';
import React from 'react'

interface SelectPOProps {
  purchaseOrderList: PurchaseOrder[];
  isLoading?: boolean;
  onPOSelect: (planId: string) => void; // Callback for selecting a plan

}

const SelectPurchaseOrder = ({
    purchaseOrderList,
    onPOSelect,
    isLoading
}:SelectPOProps) => {
  return (
    <div>SelectPurchaseOrder</div>
  )
}

export default SelectPurchaseOrder