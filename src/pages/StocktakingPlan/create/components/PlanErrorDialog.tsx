import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { ImportRequest } from '@/types/ImportRequestType';
import { MaterialExportRequest } from '@/types/exportRequest';
import { toast } from '@/hooks/use-toast';
import privateCall from '@/api/PrivateCaller';
import { inventoryReportPlanApi } from '@/api/services/inventoryReportPlanApi';
import { Link } from 'react-router-dom';
import { InventoryReportPlan } from '@/types/InventoryReport';

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planList: InventoryReportPlan[];
}

export function PlanErrorDialog({
  isOpen,
  onClose,
  planList
}: ErrorDialogProps) {
  
  function handleClick(to: string) {
    window.open(to, '_blank', 'noopener,noreferrer');
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Unable to Create Plan
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="mb-4">
              There are different plans that are planned in this date. The plan cannot be created until these plans are completed.
          </p>
          {planList.length > 0 && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">Affected Inventory Plan:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {planList.map((request) => (
                  <div
                    className="text-blue-500 cursor-pointer w-fit"
                    onClick={() => handleClick(`/stocktaking/plan/${request.id}`)}>
                    {request.code}
                  </div>
                ))}
              </ul>
            </div>
          )}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
