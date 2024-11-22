'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { getAllProductionPlanFn } from '@/api/services/productionPlanApi';
import { ProductionPlanData, PurchaseOrder, PODelivery, ProductionPlanDetail } from '@/types/ProductionPlan';
import Loading from '@/components/common/Loading';
import { PoDeliveryStatus } from '@/types/tempFile';
import { ProductionBatch } from '@/types/ProductionBatch';
export interface Props {
  selectedPlanDetails: any;
  setSelectedPlanDetails: any;
  selectedProductionBatch: any;
  setSelectedProductionBatch: any;
}
function SelectionSummary({
  selectedPlan,
  selectedPlanDetails,
  selectedProductionBatch,
  onEdit
}: {
  selectedPlan: ProductionPlanData | null;
  selectedPlanDetails: ProductionPlanDetail | null;
  selectedProductionBatch: ProductionBatch | null;
  onEdit: (step: number) => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2>Current Selections</h2>
          <Button onClick={() => onEdit(1)} className="text-sm">
            {selectedProductionBatch ? 'Edit' : 'Select'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Production Plan:</span>
          {selectedPlan ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedPlan.name} - {selectedPlan.code}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onEdit(1)}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit Production Plan</span>
              </Button>
            </Badge>
          ) : (
            <span className="text-muted-foreground">Not selected</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span>Plan details:</span>
          {selectedPlanDetails ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedPlanDetails.code}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onEdit(2)}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit Purchase Order</span>
              </Button>
            </Badge>
          ) : (
            <span className="text-muted-foreground">Not selected</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span>Production Batch:</span>
          {selectedProductionBatch ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedProductionBatch?.name} - {selectedPlanDetails?.productSize?.name}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onEdit(3)}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit Production Batch</span>
              </Button>
            </Badge>
          ) : (
            <span className="text-muted-foreground">Not selected</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WarehouseImportDialog({
  selectedPlanDetails,
  setSelectedPlanDetails,
  selectedProductionBatch,
  setSelectedProductionBatch,

}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [productionPlans, setProductionPlan] = useState<ProductionPlanData[] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ProductionPlanData | null>(null);
  const [planDetails, setPlanDetails] = useState<ProductionPlanDetail[] | null>(null);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const handleNext = (selectedDetail: ProductionPlanDetail) => {
    if (step < 3) setStep(step + 1);
    else {
      setSelectedProductionBatch(selectedProductionBatch);
      setIsOpen(false);
      //   resetSelection();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 3) setSelectedProductionBatch(null);
      if (step === 2) setSelectedPlanDetails(null);
    }
  };

  useEffect(() => {
    const getAllProductionPlan = async () => {
      try {
        setLoading(true);
        const data = await getAllProductionPlanFn();
        setProductionPlan(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    getAllProductionPlan();
  }, []);

  const handleSelectProductionPlan = (plan: ProductionPlanData) => {
    setSelectedPlan(plan);
    setPlanDetails(plan.productionPlanDetail);
  };
  const handleSelectPlanDetails = (details: ProductionPlanDetail) => {
    setSelectedPlanDetails(details);
    setProductionBatches(details.productionBatch);
  };
  const handleSelectProductionBatch = (batch: ProductionBatch) => {
    setSelectedProductionBatch(batch); // Set a single batch
  };
  // const resetSelection = () => {
  //   setStep(1);
  //   setSelectedPlan(null);
  //   setSelectedPO(null);
  //   setSelectedPoDelivery(null);
  // };

  const handleChooseStep = (selectedStep: number) => {
    if (selectedStep <= step) {
      setStep(selectedStep);
      setIsOpen(true);
      if (selectedStep === 1) {
        setSelectedPlanDetails(null);
        setSelectedProductionBatch(null);
      } else if (selectedStep === 2) {
        setSelectedProductionBatch(null);
      }
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center items-center mb-4">
        {[1, 2,3].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`flex items-center ${
              stepNumber < step
                ? 'text-primary'
                : stepNumber === step
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground'
            }`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stepNumber <= step ? 'border-primary' : 'border-muted-foreground'
              }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && <ChevronRight className="mx-2" />}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = (isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="flex justify-between items-center h-[300px]">
          <Loading /> {/* Assuming Loading is a spinner or similar component */}
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {productionPlans &&
              productionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`mb-4 p-4 rounded-lg cursor-pointer ${
                    selectedPlan?.id === plan.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                  onClick={() => handleSelectProductionPlan(plan)}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold">{plan.name} - {plan.code}</h3>
                      <h4 className="text-sm">
                        {new Date(plan.expectedStartDate).toLocaleDateString()} To{' '}
                        {new Date(plan.expectedEndDate).toLocaleDateString()}
                      </h4>
                    </div>
                    <span>{90}%</span>
                  </div>
                  <Progress value={90} className="w-full" />
                </div>
              ))}
          </ScrollArea>
        );
      case 2:
        return (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {planDetails &&
              planDetails.map((detail) => detail.productionBatch.length>0 && (
                <div
                  key={detail.id}
                  className={`mb-4 p-4 rounded-lg cursor-pointer ${
                    selectedPlanDetails?.id === detail.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  onClick={() => handleSelectPlanDetails(detail)}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold">Plan detail: {detail?.code}</h3>
                    <h4>Product size: {detail.productSize.name}</h4>
                    <h4>Quantity to produce: {detail.quantityToProduce}</h4>
                    </div>
                    
                    <span>{90}%</span>
                  </div>
                  <Progress value={90} className="w-full" />
                </div>
              ))}
          </ScrollArea>
        );
      case 3:
        return (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {productionBatches &&
              productionBatches.map((batch) => (
                <div
                  key={batch.id}
                  className={`mb-4 p-4 rounded-lg ${
                    batch.status != 'EXECUTING'
                      ? 'bg-muted cursor-not-allowed'
                      : selectedProductionBatch?.id === batch.id
                        ? 'bg-primary text-primary-foreground cursor-pointer'
                        : 'bg-secondary cursor-pointer'
                  }`}
                  onClick={() => !(batch.status != 'EXECUTING') && handleSelectProductionBatch(batch)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{batch.name} - {batch.code}</h3>
                      <h4>Quantity to produce {batch.quantityToProduce}</h4>
                    </div>
                    

                    {batch.status != 'EXECUTING' ? (
                      <AlertCircle className="text-yellow-500" />
                    ) : (
                      <CheckCircle className="text-green-500" />
                    )}
                  </div>
                  {batch.status != 'EXECUTING' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Import request already exists
                    </p>
                  )}
                </div>
              ))}
          </ScrollArea>
        );
    }
  };

  return (
    <div className="space-y-4">
      <SelectionSummary
        selectedPlan={selectedPlan}
        selectedPlanDetails={selectedPlanDetails}
        selectedProductionBatch={selectedProductionBatch}
        onEdit={handleChooseStep}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && 'Select Production Plan'}
              {step === 2 && 'Select Purchase Order'}
              {step === 3 && 'Select Production Batch'}
            </DialogTitle>
          </DialogHeader>
          {renderStepIndicator()}
          {renderStepContent(isLoading)}
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
            <Button
              onClick={() => handleNext(selectedPlanDetails)}
              disabled={
                (step === 1 && !selectedPlan) ||
                (step === 2 && !selectedPlanDetails) ||
                (step === 3 && !selectedProductionBatch)
                }
                >
              {step < 3 ? 'Next' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
