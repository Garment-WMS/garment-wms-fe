import React from 'react';
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

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  importRequests: ImportRequest[];
  exportRequests: MaterialExportRequest[];
}

export function ErrorDialog({ isOpen, onClose, importRequests, exportRequests }: ErrorDialogProps) {
  //   const importingRequests = importRequests.filter(request => request.status === 'IMPORTING')

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
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
