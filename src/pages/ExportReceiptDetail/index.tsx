'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, CheckCircle, UserCircle, Users, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';

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

import { DataTable } from '@/components/ui/DataTable';
import { materialExportReceiptColumn } from './components/ReceiptColumn';
import privateCall from '@/api/PrivateCaller';
import { changeStatusFn, exportReceiptApi } from '@/api/services/exportReceiptApi';
import { ExportReceipt } from '@/types/ExportReceipt';
import Discussion from './components/Disscussion';
import {
  ProductionDepartmentGuardDiv,
  WarehouseStaffGuardDiv
} from '@/components/authentication/createRoleGuard';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { MaterialExportActions } from './components/ExportReceiptAction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/Badge';
import { FaPlay } from 'react-icons/fa';

import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // For IMPORTING state
import ImportStepper from './components/ImportStepper';
export default function ExportReceiptDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [exportReceipt, setExportReceiptData] = useState<ExportReceipt>();
  const calculateTotalItemsReceived = (materialReceipt: any[]) => {
    return materialReceipt.reduce((total, item) => total + item.quantityByPack, 0);
  };
  const [blockingInventoryPlans, setBlockingInventoryPlans] = useState<any[]>([]);
  const [isBlockedDialogOpen, setIsBlockedDialogOpen] = useState(false);
  const [render, setRender] = useState<number>(0);

  const onRender = () => {
    setRender((render: number) => render + 1);
  };
  const materials =
    exportReceipt?.materialExportReceiptDetail?.map((detail) => ({
      id: detail.id,
      name: detail.materialReceipt.materialPackage.name,
      barcode: detail.materialReceipt.code,
      quantity: detail.quantityByPack,
      unit: detail.materialReceipt.materialPackage.packUnit,
      imageUrl:
        detail.materialReceipt.materialPackage.materialVariant.image ||
        '/placeholder.svg?height=200&width=200'
    })) || [];
  const fetchData = async () => {
    setIsLoading(true); // Start loading

    try {
      const res = await privateCall(exportReceiptApi.getOne(id as string));
      if (res.status === 200) {
        const data = res.data.data;
        // dispatch(actions.setImportReceipt(data));
        setExportReceiptData(data);
      } else {
        setError('Something went wrong');
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }
    } catch (error: any) {
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleFinishExport = async (status: string, type: string) => {
    setIsLoading(true);

    try {
      const res = await changeStatusFn(
        exportReceipt?.materialExportRequest?.id as string,
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
        fetchData();
      } else {
        toast({
          variant: 'destructive',
          title: 'Export finished unsuccessfully',
          description: 'The export receipt has not been marked as finished.'
        });
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

  const Stepper: React.FC<any> = ({ stepStatus }) => {
    const stepMap: any[] = ['AWAIT_TO_IMPORT', 'IMPORTING', 'IMPORTED']; // Sample status fo
    return (
      <ol className="flex items-center w-full">
        {stepMap.map((status, index) => {
          let icon;
          let bgColor;
          let textColor;
          let statusText;

          // Determine styles and text based on the status
          switch (status) {
            case 'AWAIT_TO_IMPORT':
              icon = <FaPlay />;
              bgColor = 'bg-blue-100 dark:bg-blue-800';
              textColor = 'text-blue-600 dark:text-blue-500';
              statusText = 'Await to import';
              break;
            case 'IMPORTING':
              icon = <AiOutlineLoading3Quarters className="animate-spin" />;
              bgColor = 'bg-yellow-100 dark:bg-yellow-800';
              textColor = 'text-yellow-600 dark:text-yellow-500';
              statusText = 'Importing...';
              break;
            case 'IMPORTED':
              icon = <IoIosCheckmarkCircleOutline />;
              bgColor = 'bg-green-100 dark:bg-green-800';
              textColor = 'text-green-600 dark:text-green-500';
              statusText = 'Imported';
              break;
            default:
              icon = <FaPlay />;
              bgColor = 'bg-gray-100 dark:bg-gray-700';
              textColor = 'text-gray-600 dark:text-gray-500';
              statusText = 'Not started';
              break;
          }

          return (
            <li key={index} className={`flex w-full items-center ${textColor}`}>
              <span
                className={`flex items-center justify-center w-10 h-10 ${bgColor} rounded-full lg:h-12 lg:w-12 shrink-0`}>
                {icon}
              </span>
              {/* Status Text */}
              <div className="mt-1 text-sm">{statusText}</div>
            </li>
          );
        })}
      </ol>
    );
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, dispatch, render]);
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
            <div>Material Export Receipt {exportReceipt?.code || 'N/A'}</div>
          </h1> */}
          <MaterialExportActions
            code={exportReceipt?.code || 'N/A'}
            status={exportReceipt?.status || ''}
            isLoading={isLoading}
            handleFinishExport={handleFinishExport}
            materials={materials}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items Exported</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {' '}
                  {exportReceipt?.materialExportReceiptDetail
                    ? calculateTotalItemsReceived(exportReceipt.materialExportReceiptDetail)
                    : 0}
                </div>
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
                              {new Date(plan.from).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false // Use 24-hour format
                              })}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Expectation end date</p>
                            <p className="text-sm font-medium">
                              {new Date(plan.to).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false // Use 24-hour format
                              })}
                            </p>
                          </div>
                        </div>
                        <Button variant="link" asChild className="p-0 h-auto font-normal">
                          <Link to={`/stocktaking/plan/${plan.id}`}>View Plan Details →</Link>
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
                <CardTitle className="text-sm font-medium">Receipt Type</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {convertTitleToTitleCase(exportReceipt?.type)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {exportReceipt?.type === 'PRODUCTION' ? 'Export for manufacturing purpose' : ''}
                </p>
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Export Status</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {/* <div>
                    <div className="text-2xl font-bold capitalize">
                      {convertTitleToTitleCase(exportReceipt?.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {exportReceipt?.status === 'EXPORTING'
                        ? 'Export in progress'
                        : 'Export completed'}
                    </p>
                  </div> */}
                  <ImportStepper currentStep={exportReceipt?.status} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
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
                        <strong>Export Request:</strong>{' '}
                        <Link
                          to={`/export-request/${exportReceipt?.materialExportRequest?.id}`}
                          className="flex text-primary underline underline-offset-2">
                          {exportReceipt?.materialExportRequest?.code || 'N/A'}
                        </Link>
                      </p>
                      <p>
                        <strong>Production batch:</strong>{' '}
                        <Link
                          to={`/production-batch/${exportReceipt?.materialExportRequest?.productionBatch?.id}`}
                          className="flex text-primary underline underline-offset-2">
                          {exportReceipt?.materialExportRequest?.productionBatch?.code || 'N/A'}
                        </Link>
                      </p>
                      <p>
                        <strong>Receipt Date:</strong>{' '}
                        {new Date(exportReceipt?.createdAt ?? '').toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false // Use 24-hour format
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Requested by Production Department</CardTitle>
              </CardHeader>
              <CardContent>
                {exportReceipt?.materialExportRequest?.productionDepartment ? (
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
                          {exportReceipt?.materialExportRequest.productionDepartment.account
                            .firstName +
                            ' ' +
                            exportReceipt?.materialExportRequest.productionDepartment.account
                              .lastName}
                        </p>
                        <p className="text-md text-muted-foreground"></p>
                        <p className="text-md text-muted-foreground">
                          {exportReceipt?.materialExportRequest.productionDepartment.account.email}
                        </p>
                        <p className="text-md text-muted-foreground">
                          {
                            exportReceipt?.materialExportRequest.productionDepartment.account
                              .phoneNumber
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-4 flex-col justify-center h-full">
                      <div className="flex flex-col items-center">
                        <p className="text-base font-semibold">Not found yet</p>
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
                          exportReceipt?.warehouseStaff?.account?.avatarUrl as string | undefined
                        }
                        alt="John Doe"
                        className="w-[80px] h-[80px]"
                      />
                      <AvatarFallback>
                        {exportReceipt?.warehouseStaff?.account?.lastName?.slice(0, 1) ??
                          '' + exportReceipt?.warehouseStaff?.account?.firstName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <p className="text-xl font-bold">
                        {exportReceipt?.warehouseStaff?.account?.lastName +
                          ' ' +
                          exportReceipt?.warehouseStaff?.account?.firstName}
                      </p>
                      <p className="text-md text-muted-foreground">Export Staff</p>
                      <p className="text-md text-muted-foreground">
                        {exportReceipt?.warehouseManager?.account?.email}
                      </p>
                      <p className="text-md text-muted-foreground">
                        {exportReceipt?.warehouseManager?.account?.phoneNumber}
                      </p>
                      <p className="text-md text-muted-foreground">Assigned by Manager</p>
                      <p className="text-md text-muted-foreground">
                        {exportReceipt?.materialExportRequest?.warehouseManager?.account?.email ||
                          'N/A'}
                      </p>
                      <p className="text-md text-muted-foreground">
                        {exportReceipt?.materialExportRequest?.warehouseManager?.account
                          ?.phoneNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* <Card>
              <CardHeader>
                <CardTitle>Quality Check Results</CardTitle>
              </CardHeader>
              <CardContent className="w-full flex items-center justify-center">
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
              </CardContent>
            </Card> */}
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Receipt Details</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material Receipt Code</TableHead>
                      <TableHead>Material Code</TableHead>
                      <TableHead>Material Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Expire Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportReceipt?.materialReceipt.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.materialPackage.code}</TableCell>
                        <TableCell>{item.materialPackage.name}</TableCell>
                        <TableCell>{item.quantityByPack}</TableCell>
                        <TableCell>
                          {item.materialPackage.materialVariant.material.materialUom.uomCharacter}
                        </TableCell>
                        <TableCell>{new Date(item.expireDate).toLocaleDateString()}</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table> */}
                <DataTable
                  columns={materialExportReceiptColumn}
                  data={exportReceipt?.materialExportReceiptDetail || []}
                />
              </CardContent>
            </Card>
          </div>
          <Discussion chat={exportReceipt?.discussion} onRender={onRender} />
        </>
      )}
    </div>
  );
}
