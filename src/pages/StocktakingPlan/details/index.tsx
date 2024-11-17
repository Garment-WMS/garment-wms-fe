import privateCall from '@/api/PrivateCaller';
import { inventoryReportPlanApi } from '@/api/services/inventoryReportPlanApi';
import { toast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarIcon, ClipboardIcon, PackageCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Badge, badgeVariants } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import {
  InventoryReportPlan,
  InventoryReportPlanToRender,
  InventoryReportStatus
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

type Props = {};

const StocktakingPlanDetails = (props: Props) => {
  const { id } = useParams();
  const [planData, setPlanData] = useState<InventoryReportPlanToRender>();
  const fetchData = async () => {
    try {
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
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  if (!planData) return <div>Not Found Data</div>;
  console.log('plan', planData);
  return (
    <Card className="w-full  mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Inventory Report Plan</CardTitle>
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
                  variant: getStatusBadgeVariant(planData.status ?? '', InventoryReportStatus)
                })}>
                {convertTitleToTitleCase(planData.status)}
              </Badge>
            </div>
            <div>
              <h3 className="text-md font-medium">From</h3>
              <p className="text-md text-muted-foreground">
                {planData?.from ? format(new Date(planData.from), 'PPP') : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium">To</h3>
              <p className="text-md text-muted-foreground">
                {planData?.to ? format(new Date(planData?.to), 'PPP') : 'N/A'}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-md font-medium">Note</h3>
            <p className="text-md text-muted-foreground">{planData?.note ? <div></div> : 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Inventory Items</h3>
            <div className="space-y-2 grid grid-cols-1">
              {planData?.inventoryReportPlanDetail.map((detail, index) => (
                <Card className="w-full space-y-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Task #{index + 1}</CardTitle>
                    <CardDescription>
                      This show what items include in staff inventory report.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="">
                      <div className="flex gap-4 w-auto">
                        <div className="flex justify-center items-center gap-2">
                          <CgProfile className='text-muted-foreground h-5 w-5'/>

                          <h3 className="text-sm font-medium text-muted-foreground">Assigned</h3>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <Avatar className="w-8 h-8" key={index}>
                            <AvatarImage
                              src={detail.warehouseStaff?.account?.avatarUrl}
                              alt="avatar"
                            />
                            <AvatarFallback>
                              {detail.warehouseStaff?.account?.firstName}
                            </AvatarFallback>
                          </Avatar>
                          <Label className="text-md ">
                            {detail.warehouseStaff?.account.firstName}{' '}
                            {detail.warehouseStaff?.account.lastName}
                          </Label>
                        </div>
                        
                      </div>
                      <Accordion defaultValue={'item-1'} type="single" collapsible className="w-full ">
                          <AccordionItem value="item-1" className='border-0'>
                            <AccordionTrigger>
                              <div className='flex gap-2 text-muted-foreground'>
                              <PackageCheck className='text-muted-foreground h-5 w-5'/>
                                Task Details
                              </div></AccordionTrigger>
                            <AccordionContent>
                              {/* {detail.staffInventoryReportPlanDetails.map((item, index) => (

                              ))} */}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Schedule
        </Button>
        <Button>
          <ClipboardIcon className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StocktakingPlanDetails;
