import privateCall from '@/api/PrivateCaller';
import { inventoryReportPlanApi } from '@/api/services/inventoryReportPlanApi';
import { toast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { NotebookPen, PackageSearch } from 'lucide-react';
import { format } from 'date-fns';
import { Badge, badgeVariants } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  InventoryReportPlanToRender,
  InventoryReportPlanStatus,
  InventoryReportStatus,
  InventoryReportPlan
} from '@/types/InventoryReport';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { getStatusBadgeVariant } from '@/helpers/getStatusBadgeVariant';
import { CgProfile } from 'react-icons/cg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/Label';
import KanbanDisplayCard from '@/components/common/KanbanDisplayList/KanbanDisplayCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollBar } from '@/components/ui/ScrollArea';
import Loading from '@/components/common/Loading';
import { BreadcrumbResponsive } from '@/components/common/BreadcrumbReponsive';
import { ErrorDialog } from './components/ErrorDialog';
import { ImportRequest } from '@/types/ImportRequestType';
import { MaterialExportRequest } from '@/types/exportRequest';
import { PlanErrorDialog } from './components/PlanErrorDialog';
import { ReadOnlyTextArea } from '@/components/common/ReadOnlyTextArea';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import { formatDateTimeToDDMMYYYYHHMM } from '@/helpers/convertDate';


// const breadcrumbItems = [
//   {
//     label: 'Stocktaking Plans',
//     href: '/stocktaking'
//   }
// ];
const StocktakingPlanDetails = () => {
  const { id } = useParams();
  const breadcrumbItems = [
    {
      label: 'Stocktaking Plans',
      href: '/stocktaking'
    }
  ];
  const [planData, setPlanData] = useState<InventoryReportPlanToRender>();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isErrorDialogOpen,setIsErrorDialogOpen] = useState(false);
  const [errorImportRequests, setErrorImportRequests] = useState<ImportRequest[]>([]);
  const [errorExportRequests, setErrorExportRequests] = useState<MaterialExportRequest[]>([]);
  const [errorPlanList, setErrorPlanList] = useState<InventoryReportPlan[]>([]);
  const [planErrorDialog, setPlanErrorDialog] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (id) {
        const res = await privateCall(inventoryReportPlanApi.getOne(id));
        setPlanData(res.data.data);
      } else {
        toast({
          title: 'error',
          variant: 'destructive',
          description: 'ID is undefined'
        });
      }
    } catch (error: any) {
      toast({
        title: 'error',
        variant: 'destructive',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleStartPlan = async () => {
    try {
      if (id) {
        setIsLoading(true);
        const res = await privateCall(inventoryReportPlanApi.startInventoryReportPlan(id));
        if (res.status === 204) {
          toast({
            title: 'success',
            variant: 'success',
            description: 'Plan has been started successfully'
          });
          fetchData();
        }
        
      } else {
        throw new Error('ID is undefined');
      }
    } catch (error: any) {
      const errMessage = error.response.data.message;
      const errorList = error.response.data.errors;
      if (error.response.status === 409) {
      
        setErrorImportRequests(errorList.isAnyImportingImportRequest);
        setErrorExportRequests(errorList.isAnyExportingExportRequest);
        setIsErrorDialogOpen(true);
        
      }
      if (error.response.status === 400 && errorList) {
        const errorList = error.response.data.errors;
        setErrorPlanList(errorList);
        setPlanErrorDialog(true);
        
      }
      else {
      toast({
        title: 'error',
        variant: 'destructive',
        description: errMessage
      });
    }
  }
  finally{
    setIsLoading(false);
  }
}
const handleCancelPlan =async()=>{
  try {
    if (id) {
      setIsLoading(true);
      const res = await privateCall(inventoryReportPlanApi.cancelInventoryReportPlan(id));
      if (res.status === 204) {
        toast({
          title: 'success',
          variant: 'success',
          description: 'Plan has been canceled successfully'
        });
        fetchData();
      }
      
    } else {
      throw new Error('ID is undefined');
    }
  } catch (error: any) {
    const errMessage = error.response.data.message;
    const errorList = error.response.data.errors;

    toast({
      title: 'error',
      variant: 'destructive',
      description: errMessage
    });
  
}
finally{
  setIsLoading(false);
}
}
  useEffect(() => {
    fetchData();
  }, [id]);
  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center">
        <Loading />
      </div>
    );
  if (!planData) return <div>Not Found Data</div>;

  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center">
        <Loading />
      </div>
    );
  return (
    <Card className="w-full  mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          <div>
            <BreadcrumbResponsive breadcrumbItems={breadcrumbItems} itemsToDisplay={1} />
            Inventory Report Plan
          </div>
        </CardTitle>
        <CardDescription>Details of the inventory report plan and its items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-md font-medium">Plan Title</h3>
              <p className="text-md text-muted-foreground">{planData.title}</p>
            </div>
            <div>
              <h3 className="text-md font-medium">Plan Code</h3>
              <p className="text-md text-muted-foreground">{planData.code}</p>
            </div>
            <div>
              <h3 className="text-md font-medium">Status</h3>
              <Badge
                className={badgeVariants({
                  variant: getStatusBadgeVariant(planData.status ?? '', InventoryReportPlanStatus)
                })}>
                {convertTitleToTitleCase(planData.status)}
              </Badge>
            </div>
            <div>
              <h3 className="text-md font-medium">From</h3>
              <p className="text-md text-muted-foreground">
                {planData?.from ? formatDateTimeToDDMMYYYYHHMM(planData?.from)  : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium">To</h3>
              <p className="text-md text-muted-foreground">
                {planData?.to ? formatDateTimeToDDMMYYYYHHMM(planData?.to) : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium">Type</h3>
              <p className="text-md text-muted-foreground">
                {convertTitleToTitleCase(planData.type)} Plan
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium">Started At</h3>
              <p className="text-md text-muted-foreground">
                {planData?.startedAt ? formatDateTimeToDDMMYYYYHHMM(planData?.startedAt)  : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium">Finished At</h3>
              <p className="text-md text-muted-foreground">
                {planData?.finishedAt ? formatDateTimeToDDMMYYYYHHMM(planData?.finishedAt) : 'N/A'}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-md font-medium">Note</h3>
            <p className="text-md text-muted-foreground">{planData?.note ? 
              <div>
                <ReadOnlyTextArea className='w-1/2' content={planData?.note} />
              </div> : 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Inventory Items</h3>
            <div className="space-y-2 grid grid-cols-1">
              {planData?.inventoryReportPlanDetail.map((detail, index) => {
                // Initialize arrays to store all variants for this task
                const materialVariant: any[] = [];
                const productVariant: any[] = [];

                // Collect all variants from staffInventoryReportPlanDetails
                detail.staffInventoryReportPlanDetails.forEach((item) => {
                  if (item.materialVariant) {
                    materialVariant.push(item);
                  } else if (item.productVariant) {
                    productVariant.push(item);
                  }
                });

                return (
                  <Card className="w-full space-y-2" key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <div className="flex justify-between">
                          <div>Task #{index + 1}</div>
                          {detail.inventoryReport ? (
                            <Badge
                              className={badgeVariants({
                                variant: getStatusBadgeVariant(
                                  detail.inventoryReport.status ?? '',
                                  InventoryReportStatus
                                )
                              })}>
                              {convertTitleToTitleCase(detail.inventoryReport.status)}
                            </Badge>
                          ) : (
                            <Badge variant={'destructive'}>Not Submitted</Badge>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription>
                        This shows what items are included in the staff inventory report.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-4 w-auto">
                          <div className="flex justify-center items-center gap-2">
                            <CgProfile className="text-muted-foreground h-5 w-5" />
                            <h3 className="text-sm font-medium text-muted-foreground">Assigned</h3>
                          </div>
                          <div className="flex justify-center items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={detail.warehouseStaff?.account?.avatarUrl}
                                alt="avatar"
                              />
                              <AvatarFallback>
                                {detail.warehouseStaff?.account?.firstName}
                              </AvatarFallback>
                            </Avatar>
                            <Label className="text-md">
                              {detail.warehouseStaff?.account.firstName}{' '}
                              {detail.warehouseStaff?.account.lastName}
                            </Label>
                          </div>
                        </div>

                        {detail.inventoryReport !== null &&
                          detail.inventoryReport.status !== 'IN_PROGRESS' && (
                            <div className="flex gap-4 w-auto items-center">
                              <div className="flex justify-center items-center gap-2">
                                <NotebookPen className="text-muted-foreground h-5 w-5" />
                                <h3 className="text-sm font-medium text-muted-foreground">
                                  Inventory Report
                                </h3>
                              </div>
                              <Label
                                onClick={() => {
                                  const url = `/stocktaking/${detail.inventoryReport.id}`;
                                  window.open(url, '_blank', 'noopener,noreferrer');
                                }}
                                className="underline text-bluePrimary cursor-pointer">
                                {detail.inventoryReport.code}
                              </Label>
                            </div>
                          )}

                        <Accordion
                          defaultValue={'item-1'}
                          type="single"
                          collapsible
                          className="w-full pt-0">
                          <AccordionItem value="item-1" className="border-0">
                            <AccordionTrigger>
                              <div className="flex gap-2 text-muted-foreground">
                                <PackageSearch className="text-muted-foreground h-5 w-5" />
                                Items to check
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4">
                                {/* Render Material Variants */}
                                {materialVariant.length > 0 && (
                                  <div className="py-4">
                                    <h3 className="font-semibold mb-2">Material Variants</h3>
                                    {/* <ul className="list-disc pl-4">
                        {materialVariant.map((variant, idx) => (
                          <li key={idx} className="text-sm">
                            {variant.materialVariant.name} (Code: {variant.materialVariant.code})
                          </li>
                        ))}
                      </ul> */}
                                    <ScrollArea className="w-full h-[110px]">
                                      <div className="flex gap-2 ">
                                        {materialVariant.map((variant) => (
                                          <div className="w-[250px] h-[100px]">
                                            <KanbanDisplayCard product={variant.materialVariant} />
                                          </div>
                                        ))}
                                      </div>

                                      <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                  </div>
                                )}

                                {/* Render Product Variants */}
                                {productVariant.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Product Variants</h3>
                                    {/* <ul className="list-disc pl-4">
                        {productVariant.map((variant, idx) => (
                          <li key={idx} className="text-sm">
                            {variant.productVariant.name} (Code: {variant.productVariant.code})
                          </li>
                        ))}
                      </ul> */}
                                    <ScrollArea className="w-full ">
                                      <div className="flex gap-2 ">
                                        {productVariant.map((variant, idx) => (
                                          <div key={idx} className="w-[250px] h-[100px]">
                                            <KanbanDisplayCard product={variant.productVariant} />
                                          </div>
                                        ))}
                                      </div>

                                      <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                  </div>
                                )}

                                {/* Fallback if no variants exist */}
                                {materialVariant.length === 0 && productVariant.length === 0 && (
                                  <p className="text-muted-foreground text-sm">
                                    No variants to display.
                                  </p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className='flex justify-center items-center gap-4'>
              {(planData.status === 'NOT_YET' ) && (
              <div className="flex justify-center items-center py-4">
              <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">Cancel plan</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Cancelling the Plan </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to Cancel this Plan? It will automatically change the status to CANCELLED and all the staff will be annouced to stop their work.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-500' onClick={handleCancelPlan} type="submit">
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            )}
            {(planData.status === 'NOT_YET' ) && (
              <div className="flex justify-center items-center py-4">
              <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button type="button">Start the plan</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Starting the Plan </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to start this Plan? It will automatically create
                      inventory report for each task and staff will be annouced to start their work.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStartPlan} type="submit">
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            )}
            </div>
            
          </div>
        </div>
      </CardContent>
      <ErrorDialog
        id={id}
        fetchData={fetchData}
        isOpen={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
        importRequests={errorImportRequests}
        exportRequests={errorExportRequests}
      />
      <PlanErrorDialog
      planList={errorPlanList}
      isOpen={planErrorDialog}
      onClose={() => setPlanErrorDialog(false)}
      />
    </Card>
  );
};

export default StocktakingPlanDetails;
