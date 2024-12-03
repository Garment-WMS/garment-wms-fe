import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, Printer, Download } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/AlertDialog';
import { VscDebugStart } from 'react-icons/vsc';
import {
  WarehouseStaffGuardDiv,
  ProductionDepartmentGuardDiv
} from '@/components/authentication/createRoleGuard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaRegSave } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';
import { ImportReceipt } from '@/types/ImportReceipt';
import { useSelector } from 'react-redux';
import importReceiptSelector from '@/pages/ImportReceiptList/slice/selector';

interface Material {
  id: string;
  name: string;
  barcode: string;
  quantity: number;
  unit: string;
  imageUrl: string;
}

interface MaterialExportActionsProps {
  isLoading: boolean;
  handleFinishImporting: () => Promise<void>;
  handleFinishImport: () => Promise<void>;
}

export function ImportReceiptAction({
  isLoading,
  handleFinishImporting,
  handleFinishImport
}: MaterialExportActionsProps) {
  const importReceipt: ImportReceipt = useSelector(importReceiptSelector.importReceipt);

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-bluePrimary">
          {importReceipt?.type === 'MATERIAL' ? (
            <div>Material Import Receipt {importReceipt?.code}</div>
          ) : (
            <div>Product Import Receipt {importReceipt?.code}</div>
          )}
        </h1>

        <div className="space-x-2 flex justify-center items=center">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <WarehouseStaffGuardDiv>
            {importReceipt?.status === 'IMPORTING' && (
              <Button onClick={handleFinishImport} disabled={isLoading}>
                Add Label
              </Button>
            )}
          </WarehouseStaffGuardDiv>
          <WarehouseStaffGuardDiv>
            {importReceipt?.status === 'AWAIT_TO_IMPORT' && (
              <Button onClick={handleFinishImporting} disabled={isLoading}>
                Start Importing
              </Button>
            )}
          </WarehouseStaffGuardDiv>
        </div>
      </div>
    </Card>
  );
}
