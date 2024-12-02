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
import {
  WarehouseStaffGuardDiv,
  ProductionDepartmentGuardDiv
} from '@/components/authentication/createRoleGuard';
import { MaterialDetailsGrid } from './MaterialDetailsGrid';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Material {
  id: string;
  name: string;
  barcode: string;
  quantity: number;
  unit: string;
  imageUrl: string;
}

interface MaterialExportActionsProps {
  status: string;
  isLoading: boolean;
  handleFinishExport: (status: string, type: string) => Promise<void>;
  materials: Material[];
}

export function MaterialExportActions({
  status,
  isLoading,
  handleFinishExport,
  materials
}: MaterialExportActionsProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          {status === 'EXPORTING' && (
            <WarehouseStaffGuardDiv>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isLoading}>Finish</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Export Completion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please review the materials below before confirming the export. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <MaterialDetailsGrid materials={materials} />
                  </ScrollArea>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleFinishExport('EXPORTED', 'staff')}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </WarehouseStaffGuardDiv>
          )}
          {status === 'EXPORTED' && (
            <ProductionDepartmentGuardDiv>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isLoading}>Finish</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Export Completion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please review the materials below before Approving the export. Make sure that
                      you receive all the material according to export request.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <MaterialDetailsGrid materials={materials} />
                  </ScrollArea>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleFinishExport('PRODUCTION_APPROVED', 'production')}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ProductionDepartmentGuardDiv>
          )}
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
}
