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
import { MaterialDetailsGrid } from './MaterialDetailsGrid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaRegSave } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';

interface Material {
  id: string;
  name: string;
  barcode: string;
  quantity: number;
  unit: string;
  imageUrl: string;
}

interface MaterialExportActionsProps {
  code: string;
  status: string;
  isLoading: boolean;
  handleFinishExport: (status: string, type: string) => Promise<void>;
  materials: Material[];
}

export function MaterialExportActions({
  code,
  status,
  isLoading,
  handleFinishExport,
  materials
}: MaterialExportActionsProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-bluePrimary">
            <div>Material Export Receipt {code}</div>
          </h1>
        <div className="space-x-2">
          
        </div>
        <div className="space-x-2 flex justify-center items=center">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          {/* <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          {status === 'EXPORTING' && (
            <WarehouseStaffGuardDiv>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isLoading}>
                    <FaRegSave />
                    Finish
                  </Button>
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
          {status === 'AWAIT_TO_EXPORT' && (
            <WarehouseStaffGuardDiv>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isLoading}>
                    {' '}
                    <VscDebugStart className="mr-2" />
                    Start Exporting
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start Emporting</AlertDialogTitle>
                    <AlertDialogDescription>
                      Starting this task will initiate the export process immediately.
                      <br />
                      Please ensure all necessary preparations are complete before proceeding.
                      <br />
                      Are you sure you want to begin?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleFinishExport('EXPORTING', 'staff')}>
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
                  <Button disabled={isLoading}>
                    <GiConfirmed />
                    Finish
                  </Button>
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
      </div>
    </Card>
  );
}
