import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

import { Clock, ClipboardCheck, User, AlertCircle, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import Waiting from '@/assets/images/wait-2.svg';
type AssignmentStatus = 'WAITING FOR ASSIGNMENT' | 'IMPORTING' | 'IMPORTED' | 'declined';

interface WarehouseStaffAssignmentProps {
  currentStatus: string;
  requestId: string;
  warehouseManager?: any;
  warehouseStaff?: any;
  lastedUpdate: any;
}

const getStatusDetails = (status: AssignmentStatus) => {
  switch (status) {
    case 'WAITING FOR ASSIGNMENT':
      return { label: 'Not Reached', color: 'bg-muted text-muted-foreground', icon: Clock };
    case 'IMPORTING':
      return {
        label: 'In Progress',
        color: 'bg-blue-500 text-white',
        icon: Info
      };
    case 'IMPORTED':
      return { label: 'Imported', color: 'bg-green-500 text-green-950', icon: ClipboardCheck };

    default:
      return { label: 'Not Reached', color: 'bg-muted text-muted-foreground', icon: AlertCircle };
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
  warehouseManager,
  warehouseStaff,
  lastedUpdate
}: WarehouseStaffAssignmentProps) {
  console.log(currentStatus);
  const { label, color, icon: StatusIcon } = getStatusDetails(currentStatus as AssignmentStatus);

  return (
    <Card className="flex flex-col w-full max-w-5xl h-full justify-center">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-2xl">Label and Import to warehouse</CardTitle>
        <p className="text-sm text-muted-foreground">Request #{requestId}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
          <Avatar className="">
            <AvatarImage src={warehouseStaff?.account?.avatarUrl} />
            <AvatarFallback>
              {warehouseStaff?.account.lastName.slice(0, 1) +
                warehouseStaff?.account.firstName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <h1>{warehouseStaff?.account.lastName + ' ' + warehouseStaff?.account.firstName}</h1>
          <div className="text-center">
            <p className="text-sm font-medium">Warehouse assignment</p>
            <p className="text-xs text-muted-foreground">
              {warehouseManager?.account?.email || 'Not assigned'}
            </p>
          </div>
        </div>
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
          <Button variant={'outline'}>Re-Assign Staff</Button>
          <Button variant={'default'} className="ml-4">
            Go to Receipt
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
