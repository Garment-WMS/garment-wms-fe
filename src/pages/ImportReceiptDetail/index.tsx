'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Package,
  FileText,
  CheckCircle,
  UserCircle,
  Users,
  Printer,
  ClipboardCheck
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import {
  finishImportReceiptFn,
  getImportRequestFn,
  importReceiptApi,
  startImportReceiptFn
} from '@/api/ImportReceiptApi';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../ImportReceiptList/slice';
import { useToast } from '@/hooks/use-toast';
import { ImportReceipt } from '@/types/ImportReceipt';
import importReceiptSelector from '../ImportReceiptList/slice/selector';
import Loading from '@/components/common/Loading';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import Barcode from 'react-barcode';
import MaterialReceiptLabels from './components/MaterialreceiptLabels';
import { ScrollArea } from '@/components/ui/scroll-area';
import privateCall from '@/api/PrivateCaller';
import { DataTable } from '@/components/ui/DataTable';
import {
  materialImportReceiptColumn,
  productImportReceiptColumn
} from './components/ReceiptColumn';
import { InspectionReportDetail } from '@/types/InspectionReportDetail';
import { Badge } from '@/components/ui/Badge';
import Discussion from './components/Disscussion';

import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import ProductReceiptLabel from './components/ProductReceiptLabels';
import { ImportReceiptAction } from './components/ImportReceiptAction';
import ImportStepper from './components/ImportStepper';

const chartData = [
  { name: 'Red Button Box', quantity: 1500 },
  { name: 'Blue Switch', quantity: 2000 },
  { name: 'Green LED', quantity: 3000 },
  { name: 'Black Casing', quantity: 1000 },
  { name: 'White Cable', quantity: 5000 }
];

// const qualityData = [
//   { name: 'Passed', value: 95 },
//   { name: 'Minor Issues', value: 4 },
//   { name: 'Failed', value: 1 }
// ];

export default function MaterialReceipt() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [importRequest, setImportRequest] = useState<any>(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const importReceipt: ImportReceipt = useSelector(importReceiptSelector.importReceipt);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isBlockedDialogOpen, setIsBlockedDialogOpen] = useState(false);
  const [render, setRender] = useState<number>(0);

  const onRender = () => {
    setRender((render) => render + 1);
  };
  const handleFinishImport = async () => {
    setShowLabelModal(true);
  };
  const calculateTotalItemsReceived = (materialReceipt: any[]) => {
    return materialReceipt.reduce(
      (total, item) => total + (item.quantityByPack || 0) + (item.quantityByUom || 0),
      0
    );
  };
  const fetchData = async () => {
    setIsLoading(true); // Start loading

    try {
      const res = await axios(importReceiptApi.getOne(id as string));
      if (res.status === 200) {
        const data = res.data.data;
        dispatch(actions.setImportReceipt(data));
      } else {
        setError('Something went wrong');
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }
    } catch (error) {
      setError('Something went wrong');
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  const fetchImportRequestData = async () => {
    setIsLoading(true); // Start loading

    try {
      const res = await getImportRequestFn(id as string);

      if (res.statusCode === 200) {
        const data = res.data;
        setImportRequest(data);
      } else {
        setError('Something went wrong');
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }
    } catch (error) {
      setError('Something went wrong');
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  const handleStartImportRequest = async () => {
    setIsLoading(true);
    try {
      const res = await startImportReceiptFn(id as string);
      if (res.statusCode === 200) {
        toast({
          variant: 'success',
          title: 'Import started successfully',
          description: 'The import receipt process has begun.'
        });
        fetchImportRequestData();
        fetchData();
        setShowConfirmDialog(false);
      } else {
        throw res; // Throw the response if it's not a 200 status
      }
    } catch (error: any) {
      if (error.response.data.statusCode === 409) {
        setIsBlockedDialogOpen(true);
        setBlockingInventoryPlans(error.response.data.errors.inventoryReportPlan);
        toast({
          variant: 'destructive',
          title: 'Failed to start import',
          description: 'Inventory plan blocking importing process.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to start import',
          description: 'There was a problem initiating the import process.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleConfirmFinishImport = async () => {
    setIsLoading(true);
    try {
      const res = await finishImportReceiptFn(id as string);
      if (res.status === 200) {
        toast({
          variant: 'success',
          title: 'Import finished successfully',
          description: 'The import receipt has been marked as imported.'
        });
        setShowConfirmDialog(false);
        fetchData();
        fetchImportRequestData();
      } else {
        toast({
          variant: 'destructive',
          title: 'Import finished unsuccessfully',
          description: 'The import receipt has not been marked as imported.'
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to finish import',
        description: 'There was a problem finishing the import process.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchImportRequestData();
      fetchData();
    }
  }, [id, dispatch, render]);
  const calculateQualityData = (inspectionReportDetails: InspectionReportDetail[]) => {
    if (!inspectionReportDetails || inspectionReportDetails.length === 0) {
      return [
        { name: 'Passed', value: 0 },
        { name: 'Failed', value: 0 }
      ];
    }

    const totalApproved = inspectionReportDetails.reduce(
      (sum, detail) => sum + detail.approvedQuantityByPack,
      0
    );
    const totalDefects = inspectionReportDetails.reduce(
      (sum, detail) =>
        sum +
        detail?.inspectionReportDetailDefect?.reduce(
          (defectSum, defect) => defectSum + defect.quantityByPack,
          0
        ),
      0
    );

    const total = totalApproved + totalDefects;
    const passedPercentage = ((totalApproved / total) * 100).toFixed(1);
    const minorIssuesPercentage = ((totalDefects / total) * 100).toFixed(1);

    return [
      { name: 'Passed', value: parseFloat(passedPercentage) },
      { name: 'Failed', value: parseFloat(minorIssuesPercentage) }
    ];
  };
  const handleCloseDialog = () => {
    setShowLabelModal(false);
  };

  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };
  const inspectionReport: any | undefined = importReceipt?.inspectionReport;
  const qualityData = calculateQualityData(importReceipt?.inspectionReport?.inspectionReportDetail);
  const inspectionRequestId = inspectionReport?.inspectionRequest?.id;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [blockingInventoryPlans, setBlockingInventoryPlans] = useState<any[]>([]);
  const handleFinishImporting = async () => {
    if (importReceipt?.status === 'AWAIT_TO_IMPORT') {
      setIsDialogOpen(true); // Open the confirmation dialog
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Action',
        description: 'The importing process cannot be started due to the current status.'
      });
    }
  };
  const confirmImporting = async () => {
    await handleStartImportRequest();
    setIsDialogOpen(false); // Close the dialog
  };
  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        // Show the loading component when `isLoading` is true
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="100" />
        </div>
      ) : (
        <>
          {/* <h1 className="text-3xl font-bold mb-6 text-bluePrimary">
            {importReceipt?.type === 'MATERIAL' ? (
              <div>Material Receipt {importReceipt?.code}</div>
            ) : (
              <div>Product Receipt {importReceipt?.code}</div>
            )}
          </h1> */}
          <ImportReceiptAction
            isLoading={isLoading}
            handleFinishImporting={handleFinishImporting}
            handleFinishImport={handleFinishImport}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items Received</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {importReceipt?.type === 'MATERIAL' ? (
                  importReceipt?.materialReceipt ? (
                    <div className="text-2xl font-bold">
                      {calculateTotalItemsReceived(importReceipt.materialReceipt)}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">0</div>
                  )
                ) : importReceipt?.productReceipt ? (
                  <div className="text-2xl font-bold">
                    {' '}
                    {calculateTotalItemsReceived(importReceipt.productReceipt)}
                  </div>
                ) : (
                  <div className="text-2xl font-bold">0</div>
                )}

                <p className="text-xs text-muted-foreground">Total items from this receipt</p>
              </CardContent>
            </Card>
            <Dialog open={isBlockedDialogOpen} onOpenChange={setIsBlockedDialogOpen}>
              <DialogContent className="min-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Inventory Plans Blocking Import</DialogTitle>
                  <DialogDescription>
                    The following inventory report plans are in progress and blocking the import:
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                  {blockingInventoryPlans.map((plan) => (
                    <Card key={plan.id} className="mb-4">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl">{plan.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {plan.code}
                              </Badge>
                              <Badge
                                variant={plan.type === 'PARTIAL' ? 'secondary' : 'default'}
                                className="text-xs">
                                {plan.type}
                              </Badge>
                              <Badge
                                variant={
                                  plan.status === 'AWAIT'
                                    ? 'warning'
                                    : plan.status === 'IN_PROGRESS'
                                      ? 'default'
                                      : 'success'
                                }
                                className="text-xs">
                                {plan.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground"> Expectation start date</p>
                            <p className="text-sm font-medium">
                              {new Date(plan.from).toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Expectation end date</p>
                            <p className="text-sm font-medium">
                              {new Date(plan.to).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="link" asChild className="p-0 h-auto font-normal">
                          <Link to={`/inventory-plan/${plan.id}`}>View Plan Details →</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
                <DialogFooter>
                  <Button onClick={() => setIsBlockedDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quality Check Summary</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex flex-col items-center justify-center ">
                      <p className="text-xs font-medium text-muted-foreground">
                        Total {inspectionReport?.type === 'MATERIAL' ? 'Materials' : 'Products'}
                      </p>
                      <div className="text-2xl font-bold text-gray-800">
                        {importReceipt?.inspectionReport?.inspectionReportDetail?.length || 0}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Total Passed</p>
                    <div className="text-2xl font-bold text-green-600">
                      {importReceipt?.inspectionReport?.inspectionReportDetail?.reduce(
                        (sum: any, detail: any) => sum + detail.approvedQuantityByPack,
                        0
                      ) || 0}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Total Failed</p>
                    <div className="text-2xl font-bold text-red-600">
                      {importReceipt?.inspectionReport?.inspectionReportDetail?.reduce(
                        (sum: any, detail: any) =>
                          sum +
                          (detail.inspectionReportDetailDefect?.reduce(
                            (defectSum: any, defect: any) => defectSum + defect.quantityByPack,
                            0
                          ) || 0),
                        0
                      ) || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Import Status</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <ImportStepper currentStep={importReceipt?.status} />
                  {/* <WarehouseStaffGuardDiv>
                    {importReceipt?.status === 'IMPORTING' && (
                      <Button onClick={handleFinishImport} disabled={isLoading}>
                        Add Label
                      </Button>
                    )}
                  </WarehouseStaffGuardDiv>
                  <WarehouseStaffGuardDiv>
                    {importReceipt?.status === 'AWAIT_TO_IMPORT' && (
                      <Button onClick={handleFinishImporting} disabled={isLoading}>
                        Start Importing
                      </Button>
                    )}
                  </WarehouseStaffGuardDiv> */}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Import Inspector </CardTitle>
              </CardHeader>
              <CardContent>
                {importReceipt?.inspectionReportId ? (
                  <div>
                    <div className="flex items-center space-x-4 flex-col justify-center">
                      <Avatar className="w-[80px] h-[80px]">
                        <AvatarImage
                          src={'/placeholder.svg?height=100&width=100'}
                          alt="John Doe"
                          className="w-[80px] h-[80px]"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-center">
                        <p className="text-xl font-bold">
                          {importReceipt?.inspectionReport?.inspectionRequest.inspectionDepartment
                            .account.firstName +
                            ' ' +
                            importReceipt?.inspectionReport?.inspectionRequest.inspectionDepartment
                              .account.lastName}
                        </p>
                        <p className="text-md text-muted-foreground"></p>
                        <p className="text-md text-muted-foreground">
                          {
                            importReceipt?.inspectionReport?.inspectionRequest.inspectionDepartment
                              .account.email
                          }
                        </p>
                        <p className="text-md text-muted-foreground">
                          {
                            importReceipt?.inspectionReport?.inspectionRequest.inspectionDepartment
                              .account.phoneNumber
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-4 flex-col justify-center h-full">
                      <div className="flex flex-col items-center">
                        <p className="text-base font-semibold">No inspection report yet</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Staff Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex items-center space-x-4 flex-col justify-center">
                    <Avatar className="w-[80px] h-[80px]">
                      <AvatarImage
                        src={
                          importReceipt?.warehouseStaff?.account?.avatarUrl as string | undefined
                        }
                        alt="John Doe"
                        className="w-[80px] h-[80px]"
                      />
                      <AvatarFallback>
                        {importReceipt?.warehouseStaff?.account?.lastName.slice(0, 1) +
                          importReceipt?.warehouseStaff?.account?.firstName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <p className="text-xl font-bold">
                        {importReceipt?.warehouseStaff?.account?.lastName +
                          ' ' +
                          importReceipt?.warehouseStaff?.account?.firstName}
                      </p>
                      <p className="text-md text-muted-foreground">Import Staff</p>
                      <p className="text-md text-muted-foreground">
                        {importReceipt?.warehouseStaff?.account?.email}
                      </p>
                      <p className="text-md text-muted-foreground">
                        {importReceipt?.warehouseStaff?.account?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Basic Information
                    </h3>
                    <div className="grid gap-2">
                      <p>
                        <strong>Import Request:</strong>{' '}
                        <Link
                          to={`/import-request/${importRequest?.id}`}
                          className="text-primary underline underline-offset-2">
                          {importRequest?.code}
                        </Link>
                      </p>
                      <p>
                        <strong>Purchase Order:</strong>{' '}
                        <Link
                          to={`/purchase-order/${importRequest?.poDelivery?.purchaseOrder?.id}`}
                          className="text-primary underline underline-offset-2">
                          {importRequest?.poDelivery?.purchaseOrder?.poNumber}
                        </Link>
                      </p>
                      <p>
                        <strong>Receipt Date:</strong>{' '}
                        {new Date(importRequest?.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Provider:</strong>{' '}
                        {importRequest?.poDelivery?.purchaseOrder?.supplier?.supplierName}
                      </p>
                      <p>
                        <strong>Status:</strong> {convertTitleToTitleCase(importRequest?.status)}
                      </p>
                      <p>
                        <strong>Type:</strong> {convertTitleToTitleCase(importRequest?.type)}
                      </p>
                      {importRequest?.description && (
                        <p>
                          <strong>Description:</strong> {importRequest.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quality Check Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Inspection Report Details */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Inspection Report Summary
                    </h3>
                    <div className="grid gap-2">
                      <p>
                        <strong>Report Code:</strong>{' '}
                        <Link
                          to={`/report/${inspectionRequestId}`}
                          className="font-semibold text-primary underline">
                          <span className="text-primary font-semibold">
                            {inspectionReport?.code || 'N/A'}
                          </span>
                        </Link>
                      </p>
                      <p>
                        <strong>Type:</strong>{' '}
                        <Badge className="bg-slate-500">
                          {inspectionReport?.type === 'MATERIAL' ? 'Material' : 'Product'}
                        </Badge>
                        <p>
                          <strong>
                            Total Inspected{' '}
                            {inspectionReport?.type === 'MATERIAL' ? 'materials' : 'products'}:{' '}
                          </strong>{' '}
                          <span className="text-slate-700 font-semibold">
                            {inspectionReport?.inspectionReportDetail?.reduce(
                              (sum: number, detail: InspectionReportDetail) =>
                                sum + detail.approvedQuantityByPack + detail.defectQuantityByPack,
                              0
                            ) || 0}
                          </span>
                        </p>
                      </p>
                      <p>
                        <strong>Approved Quantity (By Pack):</strong>{' '}
                        <span className="text-green-600 font-bold">
                          {inspectionReport?.inspectionReportDetail?.reduce(
                            (sum: number, detail: InspectionReportDetail) =>
                              sum + detail.approvedQuantityByPack,
                            0
                          ) || 0}
                        </span>
                      </p>
                      <p>
                        <strong>Defected Quantity (By Pack):</strong>{' '}
                        <span className="text-red-600 font-bold">
                          {inspectionReport?.inspectionReportDetail?.reduce(
                            (sum: number, detail: InspectionReportDetail) =>
                              sum +
                              detail?.inspectionReportDetailDefect?.reduce(
                                (defectSum: number, defect: any) =>
                                  defectSum + defect.quantityByPack,
                                0
                              ),
                            0
                          ) || 0}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Quality Check Results Chart */}
                  <div className="w-full flex items-center justify-center">
                    <ChartContainer
                      config={{
                        value: {
                          label: 'Percentage',
                          color: 'hsl(var(--chart-2))'
                        }
                      }}
                      className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={qualityData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" fill="var(--color-value)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            {importReceipt?.type === 'MATERIAL' && (
              <Card>
                <CardHeader>
                  <CardTitle>Material Receipt Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={materialImportReceiptColumn}
                    data={importReceipt?.materialReceipt || []}
                  />
                </CardContent>
              </Card>
            )}
            {importReceipt?.type === 'PRODUCT' && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Receipt Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={productImportReceiptColumn}
                    data={importReceipt?.productReceipt || []}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          {importReceipt?.type === 'MATERIAL' && (
            <Dialog open={showLabelModal} onOpenChange={handleCloseDialog}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Material Labels</DialogTitle>
                  <DialogDescription>
                    Review and print labels for each material in this import receipt.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  <div className="w-full text-center text-xl font-bold">
                    Material Receipt Barcode
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {importReceipt?.materialReceipt?.map((item: any) => (
                      <div key={item.id} className="border p-4 rounded-md">
                        <h3 className="font-bold mb-2">{item?.materialPackage?.name}</h3>
                        <p>
                          Quantity: {item?.quantityByPack * item?.materialPackage?.uomPerPack}{' '}
                          {
                            item?.materialPackage?.materialVariant?.material?.materialUom
                              ?.uomCharacter
                          }
                        </p>
                        <p>Expire Date: {new Date(item?.expireDate).toLocaleDateString()}</p>
                        <div className="mt-2">
                          <h3 className="font-semibold">Material barcode: </h3>
                          <Barcode value={item?.materialPackage?.code} width={1.5} height={50} />
                        </div>
                        <div className="mt-2">
                          <h3 className="font-semibold">Material Receipt Barcode: </h3>
                          <Barcode value={item?.code} width={1.5} height={50} />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <MaterialReceiptLabels materialReceipts={importReceipt?.materialReceipt} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default">Confirm Finish Import</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will finish the import process and mark all materials as
                          received in the warehouse.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmFinishImport}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DialogFooter>
              </DialogContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start Importing Process</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p>
                      Are you sure you want to start the importing process? This action cannot be
                      undone.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="default" onClick={confirmImporting}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {importReceipt?.discussion && (
                <Discussion chat={importReceipt?.discussion} onRender={onRender} />
              )}
            </Dialog>
          )}
          {importReceipt?.type === 'PRODUCT' && (
            <Dialog open={showLabelModal} onOpenChange={handleCloseDialog}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Products Labels</DialogTitle>
                  <DialogDescription>
                    Review and print labels for each product in this import receipt.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  <div className="w-full text-center text-xl font-bold">
                    Product Receipt Barcode
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {importReceipt?.productReceipt?.map((item: any) => (
                      <div key={item.id} className="border p-4 rounded-md">
                        <h3 className="font-bold mb-2">{item?.productSize?.name}</h3>
                        <p>
                          Quantity: {item?.quantityByUom}{' '}
                          {item?.productSize?.productVariant?.product?.productUom?.uomCharacter}
                        </p>
                        <p>Expire Date: {new Date(item?.expireDate).toLocaleDateString()}</p>
                        <div className="mt-2">
                          <h3 className="font-semibold">Product barcode: </h3>
                          <Barcode value={item?.productSize?.code} width={1.5} height={50} />
                        </div>
                        <div className="mt-2">
                          <h3 className="font-semibold">Product Receipt Barcode: </h3>
                          <Barcode value={item?.code} width={1.5} height={50} />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <ProductReceiptLabel productReceipts={importReceipt?.productReceipt} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default">Confirm Finish Import</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will finish the import process and mark all products as
                          received in the warehouse.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmFinishImport}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DialogFooter>
              </DialogContent>
              {importReceipt?.discussion && (
                <Discussion chat={importReceipt?.discussion} onRender={onRender} />
              )}
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}
