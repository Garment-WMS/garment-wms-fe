import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';

import { Clock, ClipboardCheck, User, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { exportReceiptApi } from '@/api/services/exportReceiptApi';
import privateCall from '@/api/PrivateCaller';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type AssignmentStatus = 'WAITING FOR ASSIGNMENT' | 'EXPORTING' | 'EXPORTED' | 'declined';

interface WarehouseStaffAssignmentProps {
  currentStatus: string;
  requestId: string;
  exportRequestId: string;
  warehouseManager?: any;
  warehouseStaff?: any;
  lastedUpdate: any;
}

const getStatusDetails = (status: any) => {
  switch (status) {
    case 'PRODUCTION_APPROVED':
      return {
        label: 'Exported',
        color: 'bg-green-500 text-green-950',
        icon: ClipboardCheck
      };
    case 'EXPORTING':
      return {
        label: 'Exporting',
        color: 'bg-blue-500 text-blue-950',
        icon: ClipboardCheck
      };
    case 'EXPORTED':
      return {
        label: 'Exported',
        color: 'bg-green-500 text-green-950',
        icon: ClipboardCheck
      };
    case 'PRODUCTION_REJECTED':
      return {
        label: 'Exported',
        color: 'bg-green-500 text-green-950',
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

export default function WarehouseStaffAssignment({
  currentStatus,
  requestId,
  exportRequestId,
  warehouseManager,
  warehouseStaff,
  lastedUpdate
}: WarehouseStaffAssignmentProps) {
  const { label, color, icon: StatusIcon } = getStatusDetails(currentStatus as AssignmentStatus);
  const [exportReceipt, setExportReceipt] = useState<any>();
  useEffect(() => {
    const getExportReceipt = async () => {
      const response = await privateCall(exportReceiptApi.getOneByRequestId(exportRequestId));
      setExportReceipt(response.data.data);
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
        <CardTitle className="text-2xl">Export to warehouse</CardTitle>
        <p className="text-sm text-muted-foreground">Request #{requestId}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouseStaff ? (
          <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
            <Avatar className="">
              <AvatarImage src={warehouseStaff?.account?.avatarUrl} />
              <AvatarFallback className="bg-gray-200 rounded-full p-2 m-1">
                {warehouseStaff?.account.lastName.slice(0, 1) +
                  warehouseStaff?.account.firstName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <h1>{warehouseStaff?.account.lastName + ' ' + warehouseStaff?.account.firstName}</h1>
            <div className="text-center">
              <p className="text-sm font-medium">Warehouse Staff</p>
              <p className="text-xs text-muted-foreground">
                {warehouseStaff?.account?.email || 'Not assigned'}
              </p>
            </div>
          </div>
        ) : (
          <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
            <Avatar className="flex">
              <AvatarImage src={warehouseStaff?.account?.avatarUrl} />
              <AvatarFallback>NY</AvatarFallback>
            </Avatar>
            <h1>Not Reached</h1>
            <div className="text-center">
              <p className="text-sm font-medium">Warehouse assignment</p>
              <p className="text-xs text-muted-foreground">
                {warehouseStaff?.account?.email || 'Not assigned'}
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
              <span>
                {warehouseManager?.account ? (
                  <div className="flex items-center">
                    <Avatar className="mr-2">
                      <AvatarImage src={warehouseManager.account.avatarUrl} />
                      <AvatarFallback>
                        {warehouseManager.account.firstName.slice(0, 1)}
                        {warehouseManager.account.lastName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center">
                      {warehouseManager.account.firstName} {warehouseManager.account.lastName}
                    </div>
                  </div>
                ) : (
                  <span>Not yet</span>
                )}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="font-medium w-24">Last Updated:</span>
              <span>
                {new Date(lastedUpdate).toLocaleDateString() +
                  ' ' +
                  new Date(lastedUpdate).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm border-t pt-6">
        <div className="flex items-center justify-center w-full">
          {(currentStatus == 'EXPORTING' ||
            currentStatus == 'EXPORTED' ||
            currentStatus == 'PRODUCTION_APPROVED' ||
            currentStatus == 'PRODUCTION_REJECTED'||
            currentStatus == 'AWAIT_FOR_EXPORT'
          ) &&
            exportReceipt && (
              <Link to={`/export-receipt/${exportReceipt[0]?.id}`}>
                <Button variant={'default'} className="ml-4">
                  Go to Receipt
                </Button>
              </Link>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
