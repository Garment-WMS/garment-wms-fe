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
import { ProductionPlanData, PurchaseOrder, PODelivery } from '@/types/ProductionPlan';
import Loading from '@/components/common/Loading';
import { PoDeliveryStatus } from '@/types/tempFile';
export interface Props {
  selectedPo: any;
  setSelectedPO: any;
  setSelectedPoDelivery: any;
  selectedPoDelivery: any;
  setPoDeliverydetails: any;
}
function SelectionSummary({
  selectedPlan,
  selectedPo,
  selectedPoDelivery,
  onEdit
}: {
  selectedPlan: ProductionPlanData | null;
  selectedPo: PurchaseOrder | null;
  selectedPoDelivery: PODelivery | null;
  onEdit: (step: number) => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2>Current Selections</h2>
          <Button onClick={() => onEdit(1)} className="text-sm">
            {selectedPoDelivery ? 'Edit' : 'Select'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Production Plan:</span>
          {selectedPlan ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedPlan.name}
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
          <span>Purchase Order:</span>
          {selectedPo ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedPo.poNumber}
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
          <span>PO Batch:</span>
          {selectedPoDelivery ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedPoDelivery.code}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onEdit(3)}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit PO Batch</span>
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
  selectedPo,
  selectedPoDelivery,
  setSelectedPO,
  setSelectedPoDelivery,
  setPoDeliverydetails
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [productionPlans, setProductionPlan] = useState<ProductionPlanData[] | null>(null);
  const [purchaseOrders, setPurchaseOrder] = useState<PurchaseOrder[]>([]);
  const [poBatches, setPoBatch] = useState<PODelivery[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ProductionPlanData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const handleNext = (selectedPoDelivery: PODelivery) => {
    if (step < 3) setStep(step + 1);
    else {
      setPoDeliverydetails(selectedPoDelivery.poDeliveryDetail);
      console.log(selectedPoDelivery.poDeliveryDetail);
      setIsOpen(false);
      //   resetSelection();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 3) setSelectedPoDelivery(null);
      if (step === 2) setSelectedPO(null);
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
    setPurchaseOrder(plan.purchaseOrder);
  };
  const handleSelectPurchaseOrder = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setPoBatch(po.poDelivery);
  };
  const resetSelection = () => {
    setStep(1);
    setSelectedPlan(null);
    setSelectedPO(null);
    setSelectedPoDelivery(null);
  };

  const handleChooseStep = (selectedStep: number) => {
    if (selectedStep <= step) {
      setStep(selectedStep);
      setIsOpen(true);
      if (selectedStep === 1) {
        setSelectedPO(null);
        setSelectedPoDelivery(null);
      } else if (selectedStep === 2) {
        setSelectedPoDelivery(null);
      }
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3].map((stepNumber) => (
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
        <div className="flex justify-center items-center h-[300px]">
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
                      <h3 className="font-semibold">{plan.name}</h3>
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
            {purchaseOrders &&
              purchaseOrders.map((po) => (
                <div
                  key={po.id}
                  className={`mb-4 p-4 rounded-lg cursor-pointer ${
                    selectedPo?.id === po.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  onClick={() => handleSelectPurchaseOrder(po)}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Purchase Order: {po.poNumber}</h3>
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
            {poBatches &&
              poBatches.map((batch) => (
                <div
                  key={batch.id}
                  className={`mb-4 p-4 rounded-lg ${
                    batch.status != 'PENDING'
                      ? 'bg-muted cursor-not-allowed'
                      : selectedPoDelivery?.id === batch.id
                        ? 'bg-primary text-primary-foreground cursor-pointer'
                        : 'bg-secondary cursor-pointer'
                  }`}
                  onClick={() => !(batch.status != 'PENDING') && setSelectedPoDelivery(batch)}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{batch.code}</h3>
                    {batch.status != 'PENDING' ? (
                      <AlertCircle className="text-yellow-500" />
                    ) : (
                      <CheckCircle className="text-green-500" />
                    )}
                  </div>
                  {batch.status != 'PENDING' && (
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
        selectedPo={selectedPo}
        selectedPoDelivery={selectedPoDelivery}
        onEdit={handleChooseStep}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && 'Select Production Plan'}
              {step === 2 && 'Select Purchase Order'}
              {step === 3 && 'Select Purchase Order Batch'}
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
              onClick={() => handleNext(selectedPoDelivery)}
              disabled={
                (step === 1 && !selectedPlan) ||
                (step === 2 && !selectedPo) ||
                (step === 3 && !selectedPoDelivery)
              }>
              {step < 3 ? 'Next' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
