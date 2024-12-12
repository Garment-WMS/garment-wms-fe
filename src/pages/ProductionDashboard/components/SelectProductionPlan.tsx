import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import { ProductionPlan } from '@/types/ProductionPlan';

interface SelectProductionPlanProps {
  productionPlanList: ProductionPlan[];
  isLoading?: boolean;
  onPlanSelect: (planId: string) => void; // Callback for selecting a plan

}
export function SelectProductionPlan({ productionPlanList, onPlanSelect, isLoading  }: SelectProductionPlanProps) {
  const formattedProductionPlanList = Array.isArray(productionPlanList)
  ? productionPlanList.map((productionPlan) => ({
      label: productionPlan.name,
      value: productionPlan.id,
    }))
  : [];
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (productionPlanList.length > 0 && !isInitialized) {
      const initialPlanId = productionPlanList[0].id;
      setSelectedPlanId(initialPlanId); // Set the initial selected plan
      onPlanSelect(initialPlanId); // Notify parent about the initial selection
      setIsInitialized(true); // Mark as initialized
    }
  }, [productionPlanList]);
  return (
    <Select
      disabled={isLoading || formattedProductionPlanList.length === 0}
      value={selectedPlanId ?? undefined}
      onValueChange={(value) => (
        onPlanSelect(value)
      )} // Handle plan selection
    >
      <SelectTrigger className="max-w-[1000px] w-auto">
        <SelectValue placeholder={isLoading ? "Loading plans..." : "Select a production plan"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Production Plans</SelectLabel>
          {formattedProductionPlanList.map((plan) => (
            <SelectItem key={plan.value} value={plan.value}>
              {plan.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
