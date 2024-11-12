'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Clock,
  ClipboardCheck,
  User,
  AlertCircle,
  InfoIcon,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/Label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { importRequestApprovalFn } from '@/api/purchase-staff/importRequestApi';
import { useParams } from 'react-router-dom';
import { statusOrder } from '@/pages/ImportRequests/constants';

import AssignStaffPopup from './StaffAssignment';

type ApprovalStatus = 'APPROVED' | 'ARRIVED' | 'approved' | 'REJECTED' | 'INSPECTED';

interface WarehouseApprovalProps {
  requestId: string;
  manager?: any;
  currentStatus: string;
  requestDetails: string;
  requestDate: string;
}

interface StaffMember {
  id: number;
  name: string;
  taskCount: number;
  department: string;
  efficiency: number;
}

const staffMembers: StaffMember[] = [
  { id: 1, name: 'John Doe', taskCount: 5, department: 'Packaging', efficiency: 92 },
  { id: 2, name: 'Jane Smith', taskCount: 3, department: 'Shipping', efficiency: 88 },
  { id: 3, name: 'Mike Johnson', taskCount: 7, department: 'Inventory', efficiency: 95 },
  { id: 4, name: 'Emily Brown', taskCount: 2, department: 'Receiving', efficiency: 90 },
  { id: 5, name: 'Chris Lee', taskCount: 4, department: 'Quality Control', efficiency: 87 }
];

const getStatusDetails = (status: ApprovalStatus) => {
  if (status == 'ARRIVED') {
    return {
      label: 'Waiting for Approval',
      color: 'bg-blue-500 text-blue-950',
      icon: InfoIcon
    };
  } else if (status == 'REJECTED') {
    return {
      label: 'Rejected',
      color: 'bg-red-500 text-red-950',
      icon: AlertCircle
    };
  } else if (statusOrder.indexOf(status) >= 3) {
    return {
      label: 'Approved',
      color: 'bg-green-500 text-green-950',
      icon: ClipboardCheck
    };
  } else
    return {
      label: 'Not Reached yet',
      color: 'bg-muted text-muted-foreground',
      icon: AlertCircle
    };
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

export default function WarehouseApproval({
  requestId,
  manager,
  currentStatus,
  requestDetails,
  requestDate
}: WarehouseApprovalProps) {
  const { label, color, icon: StatusIcon } = getStatusDetails(currentStatus as ApprovalStatus);
  const [approveNote, setApproveNote] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [isConfirmApproveDialogOpen, setIsConfirmApproveDialogOpen] = useState(false);
  const [isConfirmDeclineDialogOpen, setIsConfirmDeclineDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInspector, setSelectedInspector] = useState<StaffMember | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  const { id } = useParams();

  const handleApprove = async () => {
    if (!selectedInspector || !selectedAssignee) {
      toast({
        title: 'Selection Required',
        description: 'Please select both an inspector and an assignee before approving.',
        duration: 5000
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await importRequestApprovalFn('APPROVED', approveNote, id as string);
    toast({
      title: 'Request Approved',
      description: 'The warehouse request has been successfully approved.',
      duration: 5000
    });
    setIsSubmitting(false);
    setIsApproveDialogOpen(false);
    setIsConfirmApproveDialogOpen(false);
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Declined with reason:', declineReason);
    toast({
      title: 'Request Declined',
      description: 'The warehouse request has been declined.',
      duration: 5000
    });
    setIsSubmitting(false);
    setIsDeclineDialogOpen(false);
    setIsConfirmDeclineDialogOpen(false);
  };

  return (
    <TooltipProvider>
      <Card className="flex flex-col w-full max-w-5xl h-full justify-center ml-2">
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-2xl">Warehouse Manager Approval</CardTitle>
          <p className="text-sm text-muted-foreground">Request #{requestId}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage
                src={manager?.account?.avatarUrl}
                alt={
                  manager?.account?.firstName + ' ' + manager?.account?.lastName ||
                  'Warehouse Manager'
                }
              />
              <AvatarFallback>
                {getInitials(manager?.account?.firstName + ' ' + manager?.account?.firstName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium">Warehouse Manager</p>
              <p className="text-xs text-muted-foreground">
                {manager?.account?.firstName + ' ' + manager?.account?.lastName || 'Not assigned'}
              </p>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-4">Approval Status</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Badge className={`${color} text-sm py-1 px-2`}>
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {label}
                </Badge>
              </div>
              <div className="flex items-center text-sm">
                <User className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium w-24">Assigned to:</span>
                <span>
                  {manager?.account?.firstName + ' ' + manager?.account?.lastName || 'Not assigned'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium w-24">Last Updated:</span>
                <span>{requestDate}</span>
              </div>
              <div className="flex items-start text-sm">
                <InfoIcon className="mr-3 h-5 w-5 text-muted-foreground mt-1" />
                <span className="font-medium w-24">Notes:</span>
                <span className="flex-1">{requestDetails}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-sm border-t pt-6">
          {currentStatus == 'ARRIVED' && (
            <div className="flex flex-col space-y-4 w-full">
              <div className="flex justify-between w-full"></div>
              {selectedInspector && (
                <div className="flex items-center space-x-2">
                  <Label>Selected Inspector:</Label>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedInspector.name}`}
                    />
                    <AvatarFallback>
                      {selectedInspector.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedInspector.name}</span>
                </div>
              )}
              {selectedAssignee && (
                <div className="flex items-center space-x-2">
                  <Label>Selected Assignee:</Label>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedAssignee.name}`}
                    />
                    <AvatarFallback>
                      {selectedAssignee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedAssignee.name}</span>
                </div>
              )}
              <div className="flex space-x-4 items-center w-full justify-center">
                <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="default" onClick={() => setIsApproveDialogOpen(true)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Approve this warehouse request</p>
                      </TooltipContent>
                    </Tooltip>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please provide any additional notes for this approval.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <div className="w-full flex items-center py-4 ">
                          <Label className="mr-2"> Inspector staff:</Label>
                          <AssignStaffPopup
                            setStaff={setSelectedInspector}
                            staff={selectedInspector}
                          />
                        </div>
                        <div className="w-full flex items-center py-4 ">
                          <Label className="mr-2"> Warehouse staff:</Label>
                          <AssignStaffPopup
                            setStaff={setSelectedAssignee}
                            staff={selectedAssignee}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="approveNote">Approval Note</Label>
                        </div>
                        <Textarea
                          id="approveNote"
                          value={approveNote}
                          onChange={(e) => setApproveNote(e.target.value)}
                          className="h-20 resize-none"
                          placeholder="Enter any additional notes here..."
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsApproveDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={() => setIsConfirmApproveDialogOpen(true)}>
                        Proceed
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="destructive" onClick={() => setIsDeclineDialogOpen(true)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Decline this warehouse request</p>
                      </TooltipContent>
                    </Tooltip>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Decline Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please provide a reason for declining this request.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="declineReason">Reason for Decline</Label>
                        <Textarea
                          id="declineReason"
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          className="h-20 resize-none"
                          placeholder="Enter reason here..."
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsDeclineDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => setIsConfirmDeclineDialogOpen(true)}
                        className="bg-red-500">
                        Proceed
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={isConfirmApproveDialogOpen} onOpenChange={setIsConfirmApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this warehouse request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmApproveDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={isSubmitting}>
              {isSubmitting ? 'Approving...' : 'Confirm Approval'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isConfirmDeclineDialogOpen} onOpenChange={setIsConfirmDeclineDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Decline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this warehouse request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDeclineDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDecline} disabled={isSubmitting}>
              {isSubmitting ? 'Declining...' : 'Confirm Decline'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
