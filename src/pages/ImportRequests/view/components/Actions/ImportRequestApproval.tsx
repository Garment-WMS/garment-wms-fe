'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { importRequestApprovalFn, postChatFn } from '@/api/purchase-staff/importRequestApi';
import { useParams } from 'react-router-dom';
import { statusOrder } from '@/pages/ImportRequests/constants';
import { IoIosSearch } from 'react-icons/io';
import AssignStaffPopup from './StaffAssignment';
import { WarehouseManagerGuardDiv } from '@/components/authentication/createRoleGuard';
import { useSelector } from 'react-redux';
import importRequestSelector from '@/pages/ImportRequests/slice/selector';

type ApprovalStatus = 'APPROVED' | 'ARRIVED' | 'approved' | 'REJECTED' | 'INSPECTED';

interface WarehouseApprovalProps {
  requestId: string;
  manager?: any;
  currentStatus: string;
  requestDetails: string;
  requestDate: string;
  warehouseStaff?: any;
  inspectionDepartment?: any;
  onApproval: () => void;
}

interface StaffMember {
  id: string;
  name: string;
  taskCount: number;
  department: string;
  efficiency: number;
}

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
  requestDate,
  warehouseStaff,
  inspectionDepartment,
  onApproval
}: WarehouseApprovalProps) {
  const { label, color, icon: StatusIcon } = getStatusDetails(currentStatus as ApprovalStatus);
  const [approveNote, setApproveNote] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [isConfirmApproveDialogOpen, setIsConfirmApproveDialogOpen] = useState(false);
  const [isConfirmDeclineDialogOpen, setIsConfirmDeclineDialogOpen] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState<StaffMember | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<StaffMember | null>(null);
  const chat: any = useSelector(importRequestSelector.importRequest);
  const { toast } = useToast();
  const { id } = useParams();
  const [selectedInspectionTimeFrame, setSelectedInspectionTimeFrame] = useState();
  const [selectedWareHouseTimeFrame, setSelectedWareHouseTimeFrame] = useState();
  const handleApprove = async () => {
    if (!selectedInspector || !selectedAssignee) {
      toast({
        variant: 'destructive',
        title: 'Selection Required',
        description: 'Please select both an inspector and an assignee before approving.',
        duration: 5000
      });
      setIsApproveDialogOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the approval function
      const res = await importRequestApprovalFn(
        'APPROVED',
        approveNote,
        id as string,
        selectedInspector.id,
        selectedAssignee.id
      );

      if (res.statusCode === 200) {
        toast({
          variant: 'success',
          title: 'Request Approved',
          description: 'The warehouse request has been successfully approved.',
          duration: 5000
        });
        if (chat?.discussion) {
          const response = await postChatFn(chat?.discussion?.id, 'status:Arrvied->Approved');
        }
        onApproval();
      } else {
        throw new Error(res.errors[0] || 'Unknown error occurred');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Approve Failed',
        description: error.message || 'An error occurred while approving the request.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
      setIsApproveDialogOpen(false);
      setIsConfirmApproveDialogOpen(false);
    }
  };

  const handleDecline = async () => {
    // Open dialog to capture reason if not provided
    if (!declineReason) {
      toast({
        variant: 'destructive',
        title: 'Reason Required',
        description: 'Please provide a reason for declining the request.',
        duration: 5000
      });
      setIsDeclineDialogOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the decline function
      const res = await importRequestApprovalFn('REJECTED', declineReason, id as string);

      if (res.statusCode === 200) {
        toast({
          variant: 'success',
          title: 'Request Declined',
          description: 'The warehouse request has been successfully declined.',
          duration: 5000
        });
        if (chat?.discussion) {
          const response = await postChatFn(chat?.discussion?.id, 'status:Arrvied->Rejected');
        }
        onApproval();
      } else {
        throw new Error(res.errors[0] || 'Unknown error occurred');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Decline Failed',
        description: error.message || 'An error occurred while declining the request.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
      setIsDeclineDialogOpen(false);
      setIsConfirmDeclineDialogOpen(false);
    }
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
              <div className="flex items-center text-sm  ">
                <User className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium w-24">Assigned to:</span>
                {warehouseStaff?.account ? (
                  <Badge variant={'outline'}>
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={warehouseStaff?.account?.avaUrl} alt="Profile picture" />
                      <AvatarFallback>Staff</AvatarFallback>
                    </Avatar>
                    {warehouseStaff?.account?.lastName + ' ' + warehouseStaff?.account?.firstName}
                  </Badge>
                ) : (
                  <h4>Not yet</h4>
                )}
              </div>
              <div className="flex items-center text-sm ">
                <IoIosSearch className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium w-24">Inspect by:</span>
                {inspectionDepartment?.account ? (
                  <Badge variant={'outline'}>
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={inspectionDepartment?.account?.avaUrl}
                        alt="Profile picture"
                      />
                      <AvatarFallback>Inspec</AvatarFallback>
                    </Avatar>
                    {inspectionDepartment?.account?.lastName +
                      ' ' +
                      inspectionDepartment?.account?.firstName}
                  </Badge>
                ) : (
                  <h4>Not Yet</h4>
                )}
              </div>
              <div className="flex items-center text-sm ">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium w-24">Last Updated:</span>
                <span>
                  {new Date(requestDate).toLocaleDateString() +
                    ' ' +
                    new Date(requestDate).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-start text-sm">
                <InfoIcon className="mr-3 h-5 w-5 text-muted-foreground " />
                <span className="font-medium w-24">Notes:</span>
                <span className="flex-1">{requestDetails || 'Not yet'}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-sm border-t pt-6">
          {currentStatus == 'ARRIVED' && (
            <div className="flex flex-col space-y-4 w-full">
              <div className="flex justify-between w-full"></div>

              <WarehouseManagerGuardDiv className="flex space-x-4 items-center w-full justify-center">
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
                            type={'inspectionDepartmentId'}
                            setSelectedTimeFrame={setSelectedInspectionTimeFrame}
                            role="inspection-department"
                          />
                        </div>
                        <div className="w-full flex items-center py-4 ">
                          <Label className="mr-2"> Warehouse staff:</Label>
                          <AssignStaffPopup
                            setStaff={setSelectedAssignee}
                            staff={selectedAssignee}
                            type={'warehouseStaffId'}
                            setSelectedTimeFrame={setSelectedWareHouseTimeFrame}
                            role="warehouse-staff"
                            selectedInspectionTimeFrame={selectedInspectionTimeFrame}
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
              </WarehouseManagerGuardDiv>
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
