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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  getMaterialVariantFn,
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
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import exportRequestSelector from '../../slice/selector';
import { Input } from '@/components/ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

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

const algorithmLabels = {
  FIFO: 'First In, First Out (FIFO)',
  LIFO: 'Last In, First Out (LIFO)',
  FEFO: 'First Expired, First Out (FEFO)',
  CUS: 'Manual Choosen'
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
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>('');
  const [recommendedMaterials, setRecommendedMaterials] = useState<any[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<any>(null);
  const [fullFilledMaterialExportRequestDetails, setFullFilledMaterialExportRequestDetails] =
    useState([]);
  const [selectedWareHouseTimeFrame, setSelectedWareHouseTimeFrame] = useState<any>();
  const [notFullFilledMaterialExportRequestDetails, setNotFullFilledMaterialExportRequestDetails] =
    useState([]);
  // const [totalExceedPercentage, setTotalExceedPercentage] = useState(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [exceedingMaterialsCount, setExceedingMaterialsCount] = useState(0);
  const exportRequest: any = useSelector(exportRequestSelector.exportRequest);
  const materialVariants = exportRequest?.materialExportRequestDetail;
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedReceipts, setSelectedReceipts] = useState<any[]>([]);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [materialReceipts, setMaterialReceipts] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const fetchMaterialReceipts = async (materialVariantId: string) => {
    setLoading(true);
    try {
      const data = await getMaterialVariantFn(materialVariantId);
      setMaterialReceipts(data.data);
    } catch (error) {
      console.error('Error fetching material receipts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch material receipts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (materialVariants?.length > 0) {
      fetchMaterialReceipts(materialVariants[currentStep].materialVariant.id);
    }
  }, [currentStep]);

  const calculateExceedStats = () => {
    console.log('Recommended Materials:', recommendedMaterials.length);
    console.log('Selected Receipts:', selectedReceipts.length);

    if (recommendedMaterials.length > 0) {
      // For algorithm-recommended materials
      const exceedingMaterials = recommendedMaterials.filter(
        (material) => material.exceedQuantityUom > 0
      );
      const exceedingCount = exceedingMaterials.length;

      const totalExceedPercentage = recommendedMaterials.reduce((sum, material) => {
        return sum + (material.exceedPercentage || 0);
      }, 0);

      return {
        exceedingCount,
        totalExceedPercentage: (totalExceedPercentage / recommendedMaterials.length).toFixed(2)
      };
    } else if (selectedReceipts.length > 0) {
      // For custom selection
      let exceedingCount = 0;
      let totalExceedPercentage = 0;

      materialVariants.forEach((variant: any, index: any) => {
        const targetQuantity = variant.quantityByUom || 0;
        const selectedQuantity = selectedReceipts[index]?.totalQuantity || 0;

        if (selectedQuantity > targetQuantity) {
          exceedingCount++;
          const exceedPercentage = ((selectedQuantity - targetQuantity) / targetQuantity) * 100;
          totalExceedPercentage += exceedPercentage;
        }
      });
      console.log(totalExceedPercentage / materialVariants.length);
      return {
        exceedingCount,
        totalExceedPercentage: (totalExceedPercentage / materialVariants.length).toFixed(2)
      };
    }

    return { exceedingCount: 0, totalExceedPercentage: 0 };
  };

  const { exceedingCount, totalExceedPercentage } = calculateExceedStats();
  const handleReceiptSelection = (receipt: any, index: number) => {
    if (receipt.rollCount < 0) {
      receipt.rollCount = 0;
    }
    if (receipt.remainQuantityByPack < receipt.rollCount) {
      toast({
        variant: 'destructive',
        title: 'Invalid input',
        description: 'Quantity must be less then availabe'
      });
      receipt.rollCount = receipt.remainQuantityByPack;
    }
    setSelectedReceipts((prevReceipts) => {
      const updatedReceipts = [...prevReceipts];
      if (!updatedReceipts[currentStep]) {
        updatedReceipts[currentStep] = { materialReceipts: [] };
      }
      if (!updatedReceipts[currentStep].materialReceipts) {
        updatedReceipts[currentStep].materialReceipts = [];
      }
      updatedReceipts[currentStep].materialReceipts[index] = receipt;
      // Calculate total quantity
      const totalQuantity = updatedReceipts[currentStep].materialReceipts.reduce(
        (sum: any, r: any) => {
          return sum + (r.rollCount || 0) * (r.materialPackage.uomPerPack || 0);
        },
        0
      );
      updatedReceipts[currentStep].totalQuantity = totalQuantity;
      return updatedReceipts;
    });
  };
  const formatSelectedReceipts = () => {
    return selectedReceipts.flatMap((receipt, index) => {
      if (!receipt || !receipt.materialReceipts) return [];
      return receipt.materialReceipts
        .filter((r: any) => r.rollCount && r.rollCount > 0)
        .map((r: any) => ({
          materialReceiptId: r.id,
          materialReceipt: r,
          quantityByPack: r.rollCount,
          targetQuantityUom: materialVariants[index].quantityByUom,
          missingQuantityUom: Math.max(
            0,
            materialVariants[index].quantityByUom - r.rollCount * r.uomPerPack
          ),
          exceedQuantityUom: Math.max(
            0,
            r.rollCount * r.uomPerPack - materialVariants[index].quantityByUom
          ),
          exceedPercentage:
            ((r.rollCount * r.uomPerPack) / materialVariants[index].quantityByUom - 1) * 100
        }));
    });
  };

  const handleNext = () => {
    if (currentStep < materialVariants?.length - 1) {
      setCurrentStep(currentStep + 1);
      fetchMaterialReceipts(materialVariants[currentStep + 1]?.materialVariant.id);
    } else {
      setIsReceiptDialogOpen(false);
      const formattedReceipts = formatSelectedReceipts();
      setRecommendedMaterials(formattedReceipts);
      console.log('Formatted Selected Receipts:', formattedReceipts);
    }
  };
  const handleClose = () => {
    setIsReceiptDialogOpen(false);
    setRecommendedMaterials([]);
    setSelectedAlgorithm(null);
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      fetchMaterialReceipts(materialVariants[currentStep - 1]?.materialVariant.id);
    }
  };
  const renderReceiptSelectionDialog = () => {
    let currentMaterial =
      materialVariants && materialVariants[currentStep] ? materialVariants[currentStep] : null;
    const handleChangeTab = (index: number) => {
      setCurrentStep(index);
    };
    return (
      <AlertDialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <AlertDialogContent className="max-w-5xl ">
          <ScrollArea className="max-h-[600px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Select Receipt for{' '}
                {currentMaterial?.materialReceipt?.materialPackage.materialVariant.name}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <Tabs defaultValue={currentMaterial?.materialVariant?.id} className="w-full">
                <TabsList className="w-full">
                  {materialVariants?.map((variant: any, index: number) => (
                    <TabsTrigger
                      key={variant.materialVariant.id}
                      value={variant.materialVariant.id}
                      className="flex-1"
                      onClick={() => handleChangeTab(index)}>
                      {variant.materialVariant.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <ScrollArea className="h-[300px] p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loading size={40} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materialReceipts.length > 0 ? (
                      materialReceipts.map((receipt, index) => (
                        <Card
                          key={index}
                          className={`overflow-hidden ${selectedReceipts[currentStep]?.id === receipt.id ? 'border-2 border-blue-500' : ''}`}>
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold truncate">
                                {receipt.materialPackage.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">Code: {receipt.code}</p>
                              <p className="text-sm text-muted-foreground">
                                Available Package: {Number(receipt.remainQuantityByPack)} {'Roll'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quantity : {Number(receipt.remainQuantityByUom)}{' '}
                                {
                                  receipt?.materialPackage?.materialVariant?.material.materialUom
                                    .uomCharacter
                                }
                              </p>
                            </div>
                            <div className="pt-2 border-t flex">
                              <Barcode
                                value={receipt.code}
                                width={1}
                                height={40}
                                fontSize={10}
                                format="CODE128"
                                displayValue={true}
                              />
                            </div>
                            <Input
                              type="number"
                              placeholder="Enter number of rolls"
                              onChange={(e) => {
                                const updatedReceipt = {
                                  ...receipt,
                                  rollCount: parseInt(e.target.value, 10)
                                };
                                handleReceiptSelection(updatedReceipt, index);
                              }}
                              value={
                                selectedReceipts[currentStep]?.materialReceipts[index]?.rollCount ||
                                ''
                              }
                            />
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div>No available Material</div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {materialVariants &&
                      materialVariants.map((variant: any, index: any) => {
                        const targetQuantity = variant.quantityByUom || 0;
                        const selectedQuantity = selectedReceipts[index]?.totalQuantity || 0;
                        const isQuantityMet = selectedQuantity >= targetQuantity;
                        const exceedQuantity = Math.max(0, selectedQuantity - targetQuantity);
                        const exceedPercentage =
                          targetQuantity > 0 ? (exceedQuantity / targetQuantity) * 100 : 0;

                        return (
                          <div key={index} className="flex items-center space-x-4 py-2">
                            <img
                              src={variant.materialVariant.image || '/placeholder.svg'}
                              alt={variant.materialVariant.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-grow">
                              <span className="font-medium">{variant.materialVariant.name}:</span>
                              <div className="flex justify-between items-center mt-1">
                                <span className={isQuantityMet ? 'text-green-500' : 'text-red-500'}>
                                  {selectedQuantity} / {targetQuantity}{' '}
                                  {variant.materialVariant.material.materialUom.uomCharacter}
                                  {isQuantityMet ? ' ✓' : ' ✗'}
                                </span>
                                {exceedQuantity > 0 && (
                                  <span className="text-yellow-500 text-sm">
                                    Exceeds by: {exceedQuantity.toFixed(2)} (
                                    {exceedPercentage.toFixed(2)}%)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
            <AlertDialogFooter>
              <Button onClick={() => handleClose()} variant={'outline'} className="mr-2">
                Close
              </Button>
              <Button onClick={handleBack} disabled={currentStep === 0}>
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === materialVariants?.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </AlertDialogFooter>
          </ScrollArea>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
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
  const handleRemoveStaff = (type: string) => {
    if (type == 'inspection-department') {
      setSelectedAssignee(null);
      setSelectedWareHouseTimeFrame(null);
    } else {
      setSelectedAssignee(null);
      setSelectedWareHouseTimeFrame(null);
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
      // Calculate the number of exceeding materials
      const exceedingCount = data.data.filter(
        (material: any) => material.exceedQuantityUom > 0
      ).length;
      const totalExceed = data.data.reduce(
        (sum: any, material: any) => sum + material.exceedPercentage,
        0
      );
      const avgExceedPercentage = (totalExceed / data.data.length).toFixed(2);
      setExceedingMaterialsCount(exceedingCount);
      toast({
        variant: 'success',
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
      if (selectedAlgorithm != 'CUS') {
        handleExportAlgorithmSelect();
      } else if (selectedAlgorithm == 'CUS') {
        setIsReceiptDialogOpen(true);
      }
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
                      <div>
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
                        <div>
                          {(() => {
                            const startedAt =
                              exportRequest?.materialExportReceipt?.expectedStartedAt;
                            const finishedAt =
                              exportRequest?.materialExportReceipt?.expectedFinishedAt;

                            const isValidDate = (date: any) => !isNaN(new Date(date).getTime());

                            if (isValidDate(startedAt) && isValidDate(finishedAt)) {
                              return `${new Date(startedAt).toLocaleString('en-GB', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false // Use 24-hour format
                              })} - ${new Date(finishedAt).toLocaleString('en-GB', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false // Use 24-hour format
                              })}`;
                            }

                            return 'Invalid date range';
                          })()}
                        </div>
                      </div>
                    </Badge>
                  ) : (
                    <h4>Not yet</h4>
                  )}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium w-24">Last Updated:</span>
                <span>
                  {new Date(requestDate).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // Use 24-hour format
                  })}
                </span>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {selectedAlgorithm
                              ? algorithmLabels[selectedAlgorithm]
                              : 'Select an algorithm'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-160">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(algorithmLabels).map(([value, label]) => (
                              <Button
                                key={value}
                                variant={selectedAlgorithm === value ? 'default' : 'outline'}
                                className="justify-start"
                                onClick={() => setSelectedAlgorithm(value)}>
                                {label}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
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
                        {totalExceedPercentage != 0 && (
                          <Alert variant="default" className="mb-4">
                            <InfoIcon className="h-4 w-4 mr-2" />
                            <AlertTitle>Exceeding Materials</AlertTitle>
                            <AlertDescription>
                              {exceedingMaterialsCount} out of {recommendedMaterials.length}{' '}
                              materials exceed the requested amount.
                              <br />
                              Total exceed percentage:{' '}
                              <span className="text-yellow-300 text-bold">
                                {totalExceedPercentage}%
                              </span>
                            </AlertDescription>
                          </Alert>
                        )}
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
                                  {material.exceedQuantityUom > 0 && (
                                    <p className="text-sm text-yellow-600">
                                      Exceeds by: {material.exceedQuantityUom}{' '}
                                      {
                                        material.materialReceipt.materialPackage.materialVariant
                                          .material.materialUom.uomCharacter
                                      }
                                    </p>
                                  )}
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
                      <div className="flex">
                        <AssignStaffPopup
                          setStaff={setSelectedAssignee}
                          staff={selectedAssignee}
                          type={'warehouseStaffId'}
                          setSelectedTimeFrame={setSelectedWareHouseTimeFrame}
                          role="warehouse-staff"
                        />
                        {selectedAssignee && (
                          <Button
                            variant={'ghost'}
                            className="hover:bg-red-400 ml-2"
                            onClick={() => handleRemoveStaff('warehouse-staff')}>
                            <IoMdClose />
                          </Button>
                        )}
                      </div>
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
      {renderReceiptSelectionDialog()}
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
