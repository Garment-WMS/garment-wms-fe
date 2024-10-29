'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
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

type ApprovalStatus = 'APPROVED' | 'ARRIVED' | 'approved' | 'REJECT' | 'PENDING';

interface WarehouseApprovalProps {
  requestId: string;
  managerName?: string;
  managerEmail?: string;
  currentStatus: string;
  requestDetails: string;
  requestDate: string;
}

const getStatusDetails = (status: ApprovalStatus) => {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Waiting for Approval',
        color: 'bg-blue-500 text-blue-950',
        icon: InfoIcon
      };
    case 'REJECT':
      return {
        label: 'Rejected',
        color: 'bg-red-500 text-red-950',
        icon: AlertCircle
      };
    case 'APPROVED':
      return {
        label: 'Approved',
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

export default function WarehouseApproval({
  requestId,
  managerName,
  managerEmail,
  currentStatus,
  requestDetails,
  requestDate
}: WarehouseApprovalProps) {
  const { label, color, icon: StatusIcon } = getStatusDetails(currentStatus as ApprovalStatus);
  const [approveNote, setApproveNote] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [declineImpact, setDeclineImpact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Approved with note:', approveNote);
    toast({
      title: 'Request Approved',
      description: 'The warehouse request has been successfully approved.',
      duration: 5000
    });
    setIsSubmitting(false);
    setIsApproveDialogOpen(false);
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Declined with reason:', declineReason, 'and impact:', declineImpact);
    toast({
      title: 'Request Declined',
      description: 'The warehouse request has been declined.',
      duration: 5000
    });
    setIsSubmitting(false);
    setIsDeclineDialogOpen(false);
  };

  return (
    <TooltipProvider>
      <Card className="flex flex-col w-full max-w-5xl h-full justify-center">
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-2xl">Warehouse Manager Approval</CardTitle>
          <p className="text-sm text-muted-foreground">Request #{requestId}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage
                src="/placeholder.svg?height=80&width=80"
                alt={managerName || 'Warehouse Manager'}
              />
              <AvatarFallback>{getInitials(managerName)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium">Warehouse Manager</p>
              <p className="text-xs text-muted-foreground">{managerEmail || 'Not assigned'}</p>
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
                <span className="font-medium w-24">Manager:</span>
                <span>{managerName || 'Not assigned'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium w-24">Last Updated:</span>
                <span>May 17, 2023 at 10:30 UTC</span>
              </div>
              <div className="flex items-start text-sm">
                <InfoIcon className="mr-3 h-5 w-5 text-muted-foreground mt-1" />
                <span className="font-medium w-24">Details:</span>
                <span className="flex-1">{requestDetails}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-sm border-t pt-6">
          <div className="flex space-x-4">
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
                    <Label htmlFor="approveNote">Approval Note</Label>
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
                  <AlertDialogAction onClick={handleApprove} disabled={isSubmitting}>
                    {isSubmitting ? 'Approving...' : 'Confirm Approval'}
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
                    Please provide a reason for declining and the potential impact.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="declineReason">Decline Reason</Label>
                    <Textarea
                      id="declineReason"
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="h-20 resize-none"
                      placeholder="Enter the reason for declining..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="declineImpact">Potential Impact</Label>
                    <Textarea
                      id="declineImpact"
                      value={declineImpact}
                      onChange={(e) => setDeclineImpact(e.target.value)}
                      className="h-20 resize-none"
                      placeholder="Describe the potential impact of declining..."
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDeclineDialogOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDecline} disabled={isSubmitting}>
                    {isSubmitting ? 'Declining...' : 'Confirm Decline'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Approval process initiated on {requestDate}
          </p>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
