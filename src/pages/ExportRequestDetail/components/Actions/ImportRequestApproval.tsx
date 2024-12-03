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
import { ScrollArea } from '@/components/ui/scroll-area';
import Barcode from 'react-barcode';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Loading from '@/components/common/Loading';
import { WarehouseManagerGuardDiv } from '@/components/authentication/createRoleGuard';
import { Textarea } from '@/components/ui/Textarea';

type ApprovalStatus = any;

interface WarehouseApprovalProps {
  requestId: string;
  code: string;
  manager?: any;
  currentStatus: string;
  requestDetails: string;
  requestDate: string;
  onApproval: () => void;
  warehouseStaff: any;
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
    case 'AWAIT_TO_EXPORT':
      return {
        label: 'Approved',
        color: 'bg-green-500 text-green-950',
        icon: ClipboardCheck
      };
    case 'PRODUCTION_APPROVED':
      return {
        label: 'Approved',
        color: 'bg-green-500 text-green-950',
        icon: ClipboardCheck
      };
    case 'EXPORTING':
      return {
        label: 'Approved',
        color: 'bg-green-500 text-green-950',
        icon: ClipboardCheck
      };
    case 'EXPORTED':
      return {
        label: 'Approved',
        color: 'bg-green-500 text-green-950',
        icon: ClipboardCheck
      };
    case 'PRODUCTION_REJECTED':
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
  warehouseStaff,
  code,
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
  const [fullFilledMaterialExportRequestDetails, setFullFilledMaterialExportRequestDetails] =
    useState([]);
  const [selectedWareHouseTimeFrame, setSelectedWareHouseTimeFrame] = useState<any>();
  const [notFullFilledMaterialExportRequestDetails, setNotFullFilledMaterialExportRequestDetails] =
    useState([]);
  const [isLoading, setLoading] = useState<boolean>(false);
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
        materialExportReceipt,
        selectedWareHouseTimeFrame.expectedStartedAt,
        selectedWareHouseTimeFrame.expectedFinishedAt
      );

      toast({
        variant: 'success',
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
    setLoading(true);
    setRecommendedMaterials([]);
    try {
      const data = await getRecommendedMaterialReceiptFn(requestId, selectedAlgorithm);
      setRecommendedMaterials(data.data);
      toast({
        title: 'Recommendations Fetched',
        description: 'Material export recommendations have been retrieved.',
        duration: 5000
      });
    } catch (error: any) {
      console.error('Error fetching recommendations:', error.response);

      setNotFullFilledMaterialExportRequestDetails(
        error.response.data.data.notFullFilledMaterialExportRequestDetails
      );
      setFullFilledMaterialExportRequestDetails(
        error.response.data.data.fullFilledMaterialExportRequestDetails
      );
      toast({
        title: 'Error',
        description: `${error.response.data.message}`,
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setLoading(false);
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
          <p className="text-sm text-muted-foreground">Request #{code}</p>
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
                <span className="font-medium w-40">Staff Export Assigned:</span>
                <span>
                  {warehouseStaff?.account ? (
                    <Badge variant={'outline'}>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={warehouseStaff?.account?.avaUrl}
                            alt="Profile picture"
                          />
                          <AvatarFallback>Staff</AvatarFallback>
                        </Avatar>
                        {warehouseStaff?.account?.lastName +
                          ' ' +
                          warehouseStaff?.account?.firstName}
                      </div>
                      <div></div>
                    </Badge>
                  ) : (
                    <h4>Not yet</h4>
                  )}
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
            <WarehouseManagerGuardDiv className="flex space-x-4">
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
                  <ScrollArea className="space-y-4 py-4 h-[500px]">
                    <div className="space-y-2">
                      <Label htmlFor="algorithm">Export Algorithm</Label>
                      <h5 className="text-sm text-gray-600">
                        The Algirithom will find the most suitable Package of material that suit the
                        need.
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
                    {isLoading && (
                      <div className="flex items-center justify-center m-10">
                        <Loading size="40" />
                      </div>
                    )}
                    {notFullFilledMaterialExportRequestDetails.length > 0 && (
                      <Alert variant="destructive" className="mt-4 mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Insufficient Materials</AlertTitle>
                        <AlertDescription>
                          There are not enough materials to fulfill this export request. Please
                          contact the Purchasing department to order additional materials.
                        </AlertDescription>
                      </Alert>
                    )}
                    {recommendedMaterials.length > 0 && (
                      <div className="space-y-2">
                        <Label>Recommended Materials</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {recommendedMaterials.map((material, index) => (
                            <Card key={index} className="overflow-hidden">
                              <div className="aspect-square relative flex items-center justify-center">
                                <img
                                  src={
                                    material.materialReceipt.materialPackage.materialVariant
                                      .image || '/placeholder.svg'
                                  }
                                  alt={material.materialReceipt.materialPackage.name}
                                  className="object-cover"
                                />
                              </div>
                              <CardContent className="p-4 space-y-3">
                                <div>
                                  <h3 className="font-semibold truncate">
                                    {material.materialReceipt.materialPackage.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Used Quantity: {material.quantityByPack}{' '}
                                    {material.materialReceipt.materialPackage.packUnit}
                                  </p>
                                </div>
                                <div className="pt-2 border-t flex">
                                  <Barcode
                                    value={material.materialReceipt.code}
                                    width={1}
                                    height={40}
                                    fontSize={15}
                                    format="CODE128"
                                    displayValue={true}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedAlgorithm &&
                      (fullFilledMaterialExportRequestDetails.length > 0 ||
                        notFullFilledMaterialExportRequestDetails.length > 0) && (
                        <>
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Fulfilled Items</h3>
                            {fullFilledMaterialExportRequestDetails.length > 0 ? (
                              fullFilledMaterialExportRequestDetails.map(
                                (item: any, index: number) => (
                                  <Card key={index} className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium">{item.materialVariant.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Code: {item.materialVariant.code}
                                        </p>
                                      </div>
                                      <Badge className="bg-green-500">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Fulfilled
                                      </Badge>
                                    </div>
                                    <p className="mt-2">
                                      Quantity: {item.targetQuantityUom}{' '}
                                      {item.materialVariant.material.materialUom.uomCharacter}
                                    </p>
                                  </Card>
                                )
                              )
                            ) : (
                              <p className="text-muted-foreground">No fulfilled items.</p>
                            )}
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Unfulfilled Items</h3>
                            {notFullFilledMaterialExportRequestDetails.map(
                              (item: any, index: number) => (
                                <Card key={index} className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <img
                                        src={item.materialVariant.image}
                                        className="rounded w-16 h-16"
                                      />
                                      <h4 className="font-medium">{item.materialVariant.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Code: {item.materialVariant.code}
                                      </p>
                                    </div>
                                    <Badge variant="destructive">
                                      <XCircle className="mr-1 h-3 w-3" />
                                      Unfulfilled
                                    </Badge>
                                  </div>
                                  <p className="mt-2">
                                    Requested: {item.targetQuantityUom}{' '}
                                    {item.materialVariant.material.materialUom.uomCharacter}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Missing: {item.missingQuantityUom}{' '}
                                    {item.materialVariant.material.materialUom.uomCharacter}
                                  </p>
                                </Card>
                              )
                            )}
                          </div>
                        </>
                      )}
                    <div className="space-y-2 mt-4 mb-4">
                      <Label className="mr-4">Assign Staff</Label>
                      <AssignStaffPopup
                        setStaff={setSelectedAssignee}
                        staff={selectedAssignee}
                        type={'warehouseStaffId'}
                        setSelectedTimeFrame={setSelectedWareHouseTimeFrame}
                        role="warehouse-staff"
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
                  </ScrollArea>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsApproveDialogOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleApprove}
                      disabled={notFullFilledMaterialExportRequestDetails.length > 0}>
                      Approve
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
                    <AlertDialogAction onClick={handleDecline} className="bg-red-500">
                      Decline
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </WarehouseManagerGuardDiv>
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
