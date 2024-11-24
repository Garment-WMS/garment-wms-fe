'use client';

import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import {
  approveExportRequestFn,
  getRecommendedMaterialReceiptFn
} from '@/api/services/exportRequestApi';
import AssignStaffPopup from './StaffAssignment';
import { useNavigate } from 'react-router-dom';

type ApprovalStatus = 'APPROVED' | 'ARRIVED' | 'approved' | 'REJECTED' | 'PENDING';

interface WarehouseApprovalProps {
  requestId: string;
  manager?: any;
  currentStatus: string;
  requestDetails: string;
  requestDate: string;
  onApproval: () => void;
}

const getStatusDetails = (status: ApprovalStatus) => {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Waiting for Approval',
        color: 'bg-blue-500 text-blue-950',
        icon: InfoIcon
      };
    case 'REJECTED':
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
  if (name == 'undefined undefined') {
    return 'NY';
  }
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
  onApproval
}: WarehouseApprovalProps) {
  const { label, color, icon: StatusIcon } = getStatusDetails(currentStatus as ApprovalStatus);
  const [approveNote, setApproveNote] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [recommendedMaterials, setRecommendedMaterials] = useState<any[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleApprove = async () => {
    if (!selectedAlgorithm) {
      toast({
        title: 'Algorithm Required',
        description: 'Please select an export algorithm.',
        variant: 'destructive',
        duration: 5000
      });
      return;
    }

    if (!selectedAssignee) {
      toast({
        title: 'Staff Assignment Required',
        description: 'Please assign a staff member.',
        variant: 'destructive',
        duration: 5000
      });
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  const confirmApprove = async () => {
    setIsSubmitting(true);
    try {
      const materialExportReceipt = {
        materialExportReceiptDetail: recommendedMaterials.map((material) => ({
          materialReceiptId: material.materialReceipt.id,
          quantityByPack: material.quantityByPack
        }))
      };

      await approveExportRequestFn(
        requestId,
        'APPROVED',
        approveNote,
        selectedAssignee.id,
        materialExportReceipt
      );

      toast({
        title: 'Request Approved',
        description: 'The warehouse request has been successfully approved.',
        duration: 5000
      });

      onApproval();
    } catch (error) {
      console.error('Error during approval:', error);
      toast({
        title: 'Approval Failed',
        description: 'An error occurred while approving the request.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
      setIsApproveDialogOpen(false);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    try {
      await approveExportRequestFn(requestId, 'REJECTED', declineReason, '', null);
      toast({
        title: 'Request Declined',
        description: 'The warehouse request has been declined.',
        duration: 5000
      });
      onApproval();
    } catch (error) {
      console.error('Error during decline:', error);
      toast({
        title: 'Decline Failed',
        description: 'An error occurred while declining the request.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
      setIsDeclineDialogOpen(false);
    }
  };

  const handleExportAlgorithmSelect = async () => {
    if (!selectedAlgorithm) {
      toast({
        title: 'Algorithm Required',
        description: 'Please select an export algorithm.',
        variant: 'destructive',
        duration: 5000
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await getRecommendedMaterialReceiptFn(requestId, selectedAlgorithm);
      setRecommendedMaterials(data.data);
      toast({
        title: 'Recommendations Fetched',
        description: 'Material export recommendations have been retrieved.',
        duration: 5000
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch material export recommendations.',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedAlgorithm) {
      handleExportAlgorithmSelect();
    }
  }, [selectedAlgorithm]);

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
                {manager?.account?.firstName
                  ? manager?.account?.firstName + ' ' + manager?.account?.lastName
                  : 'Not assigned'}
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
                <span className="font-medium w-24">Manager:</span>
                <span>
                  {manager?.account?.firstName
                    ? manager?.account?.firstName + ' ' + manager?.account?.lastName
                    : 'Not assigned'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium w-24">Last Updated:</span>
                <span>{new Date(requestDate).toLocaleString()}</span>
              </div>
              <div className="flex items-start text-sm">
                <InfoIcon className="mr-3 h-5 w-5 text-muted-foreground mt-1" />
                <span className="font-medium w-24">Notes:</span>
                <span className="flex-1">{requestDetails ? requestDetails : 'Not yet'}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-sm border-t pt-6">
          {currentStatus === 'PENDING' && (
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
                <AlertDialogContent className="max-w-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please complete the following steps to approve the request.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="algorithm">Export Algorithm</Label>
                      <h5 className="text-sm text-gray-600">
                        The Algirithom will find the most suitable Package of material that suit the
                        nee{' '}
                      </h5>
                      <Select onValueChange={setSelectedAlgorithm} value={selectedAlgorithm}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIFO">First In, First Out (FIFO)</SelectItem>
                          <SelectItem value="LIFO">Last In, First Out (LIFO)</SelectItem>
                          <SelectItem value="FEFO">First Expired, First Out (FEFO)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {recommendedMaterials.length > 0 && (
                      <div className="space-y-2">
                        <Label>Recommended Materials</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {recommendedMaterials.map((material, index) => (
                            <Card key={index} className="overflow-hidden">
                              <img
                                src={
                                  material.materialReceipt.materialPackage.materialVariant.image ||
                                  '/placeholder.svg?height=100&width=100'
                                }
                                alt={material.materialReceipt.materialPackage.name}
                                className="w-full h-32 object-cover"
                              />
                              <CardContent className="p-2">
                                <p className="font-medium text-sm truncate">
                                  {material.materialReceipt.materialPackage.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Quantity: {material.quantityByPack}{' '}
                                  {material.materialReceipt.materialPackage.packUnit}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Assign Staff</Label>
                      <AssignStaffPopup
                        setStaff={setSelectedAssignee}
                        staff={selectedAssignee}
                        type={'warehouse-staff'}
                      />
                    </div>
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
                    <AlertDialogAction onClick={handleApprove}>Approve</AlertDialogAction>
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
                    <AlertDialogAction onClick={handleDecline}>Decline</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this warehouse request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} disabled={isSubmitting}>
              {isSubmitting ? 'Approving...' : 'Confirm Approval'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
