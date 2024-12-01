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

interface ErrorDialogProps {
  id: string | undefined;
  isOpen: boolean;
  fetchData: () => void;
  onClose: () => void;
  importRequests: ImportRequest[];
  exportRequests: MaterialExportRequest[];
}

export function ErrorDialog({ id,fetchData,isOpen, onClose, importRequests, exportRequests }: ErrorDialogProps) {
  const handleAwaitPlan = async () => {
    try {
      if (!id) throw new Error('Plan ID is required');
      const response = await privateCall(inventoryReportPlanApi.awaitInventoryReportPlan(id));
      if (response.status === 204) {
        toast({
          variant: 'success',
          title: 'Plan is now awaiting',
          description: 'The plan will automatically start when the import/export requests are completed.'});
        fetchData();
        onClose()
        }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error awaiting plan',
        description: 'An error occurred while awaiting the plan.'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Unable to Start Plan
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="mb-4">
            {(importRequests.length > 0 || exportRequests.length > 0) &&
              "There are import and export requests currently in the 'IMPORTING' and 'EXPORTING' status. The plan cannot be started until these requests are completed."}
          </p>
          {importRequests.length > 0 && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">Affected Import Requests:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {importRequests.map((request) => (
                  <li key={request.id}>{request.code}</li>
                ))}
              </ul>
            </div>
          )}
          {exportRequests.length > 0 && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">Affected Export Requests:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {exportRequests.map((request) => (
                  <li key={request.id}>{request.code}</li>
                ))}
              </ul>
            </div>
          )}
          <div className='my-2'>You can also await plan to automatically start when Import/Export requests are done</div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={handleAwaitPlan} variant="outline">
            Await Plan
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
