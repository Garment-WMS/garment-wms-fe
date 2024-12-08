import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';

import { Clock, ClipboardCheck, User, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import privateCall from '@/api/PrivateCaller';
import { changeStatusFn, exportReceiptApi } from '@/api/services/exportReceiptApi';
import { ProductionDepartmentGuardDiv } from '@/components/authentication/createRoleGuard';
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
import { GiConfirmed } from 'react-icons/gi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MaterialDetailsGrid } from '@/pages/ExportReceiptDetail/components/MaterialDetailsGrid';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { formatDateTimeToDDMMYYYYHHMM } from '@/helpers/convertDate';

type AssignmentStatus = 'WAITING FOR ASSIGNMENT' | 'IMPORTING' | 'IMPORTED' | 'declined';

interface WarehouseStaffAssignmentProps {
  productionDepartment?: any;
  currentStatus: string;
  requestId: string;
  warehouseManager?: any;
  warehouseStaff?: any;
  lastedUpdate: any;
  exportRequestId: any;
  onApproval: () => void;
}

const getStatusDetails = (status: any) => {
  switch (status) {
    case 'PRODUCTION_APPROVED':
      return {
        label: 'Production Approved',
        color: 'bg-green-500 text-green-950',
        icon: ClipboardCheck
      };
    case 'PRODUCTION_REJECTED':
      return {
        label: 'Exported',
        color: 'bg-red-500 text-red-950',
        icon: ClipboardCheck
      };
    default:
      return {
        label: 'Not Reached yet',
        color: 'bg-muted text-muted-foreground',
        icon: AlertCircle
      };
  }
};

const getInitials = (name: string | undefined): string => {
  if (!name) return 'WM';
  return (
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'WM'
  );
};

export default function ExportRequestConfirmation({
  currentStatus,
  requestId,
  warehouseManager,
  warehouseStaff,
  lastedUpdate,
  productionDepartment,
  exportRequestId,
  onApproval
}: WarehouseStaffAssignmentProps) {
  const { label, color, icon: StatusIcon } = getStatusDetails(currentStatus as AssignmentStatus);
  const [exportReceipt, setExportReceipt] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [textArea, setTextArea] = useState('');

  const handleFinishExport = async (status: string, type: string) => {
    if (textArea == '' && status == 'PRODUCTION_REJECTED') {
      toast({
        variant: 'destructive',
        title: 'Missing Reject reason',
        description: 'Please fill in reject reason before confirming'
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await changeStatusFn(
        exportReceipt[0]?.materialExportRequest?.id as string,
        status,
        type
      );

      if (res.statusCode === 200) {
        toast({
          variant: 'success',
          title: 'Export finished successfully',
          description: 'The export receipt has been marked as finished.'
        });
        // Refresh the data after successful status change
        onApproval();
        setIsLoading(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Export finished unsuccessfully',
          description: 'The export receipt has not been marked as finished.'
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to start import',
        description: 'There was a problem initiating the import process.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const getExportReceipt = async () => {
      const response = await privateCall(exportReceiptApi.getOneByRequestId(exportRequestId));
      setExportReceipt(response.data.data);
      setMaterials(
        response.data.data[0]?.materialExportReceiptDetail?.map((detail: any) => ({
          id: detail.id,
          name: detail.materialReceipt.materialPackage.name,
          barcode: detail.materialReceipt.materialPackage.code,
          quantity: detail.quantityByPack,
          unit: detail.materialReceipt.materialPackage.packUnit,
          imageUrl:
            detail.materialReceipt.materialPackage.materialVariant.image ||
            '/placeholder.svg?height=200&width=200'
        }))
      );
    };

    if (
      currentStatus == 'EXPORTING' ||
      currentStatus == 'EXPORTED' ||
      currentStatus == 'PRODUCTION_APPROVED' ||
      currentStatus == 'PRODUCTION_REJECTED'
    ) {
      getExportReceipt();
    }
  }, []);
  return (
    <Card className="flex flex-col w-full max-w-5xl h-full justify-center">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-2xl">Goods Export Confirmation</CardTitle>
        <p className="text-sm text-muted-foreground">Request #{requestId}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productionDepartment ? (
          <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
            <Avatar className="">
              <AvatarImage src={productionDepartment?.account?.avatarUrl} />
              <AvatarFallback>
                {productionDepartment?.account.lastName.slice(0, 1) +
                  productionDepartment?.account.firstName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <h1>
              {productionDepartment?.account.lastName +
                ' ' +
                productionDepartment?.account.firstName}
            </h1>
            <div className="text-center">
              <p className="text-sm font-medium">Warehouse assignment</p>
              <p className="text-xs text-muted-foreground">
                {productionDepartment?.account?.email || 'Not assigned'}
              </p>
            </div>
          </div>
        ) : (
          <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
            <Avatar className="">
              <AvatarImage src={productionDepartment?.account?.avatarUrl} />
              <AvatarFallback>NY</AvatarFallback>
            </Avatar>
            <h1>Not Reached</h1>
            <div className="text-center">
              <p className="text-sm font-medium">Warehouse assignment</p>
              <p className="text-xs text-muted-foreground">
                {productionDepartment?.account?.email || 'Not assigned'}
              </p>
            </div>
          </div>
        )}
        <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-4">Assignment Status</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Badge className={`${color} text-sm py-1 px-2`}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {label}
              </Badge>
            </div>
            <div className="flex items-center text-sm">
              <User className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="font-medium w-24">Assigned by:</span>
              <span>{warehouseManager?.account?.firstName || 'Not assigned'}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="font-medium w-24">Last Updated:</span>
              <span>{formatDateTimeToDDMMYYYYHHMM(lastedUpdate) || 'N/A'}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm border-t pt-6">
        <div className="flex items-center justify-center w-full">
          {currentStatus == 'EXPORTED' && exportReceipt && (
            <ProductionDepartmentGuardDiv className="flex w-full justify-center">
              <AlertDialog>
                <AlertDialogTrigger asChild className="m-2">
                  <Button className="flex justify-center items-center gap-2" disabled={isLoading}>
                    <GiConfirmed /> Approve request
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
              <AlertDialog>
                <AlertDialogTrigger asChild className="m-2">
                  <Button
                    variant="destructive"
                    className="flex justify-center items-center gap-2"
                    disabled={isLoading}>
                    <AlertCircle /> Reject request
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Export Rejection</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this export request?{' '}
                      <br className="mt-2"></br>This action will reject all provided material and
                      return all the materials to the warehouse!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Label>Reject reason*</Label>
                  <Textarea
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    placeholder="Type in reason of rejecting, this is required"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500"
                      onClick={() => handleFinishExport('PRODUCTION_REJECTED', 'production')}>
                      Confirm Rejection
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ProductionDepartmentGuardDiv>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
