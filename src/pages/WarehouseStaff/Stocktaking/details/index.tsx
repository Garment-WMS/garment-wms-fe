import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import privateCall from '@/api/PrivateCaller';
import { inventoryReportApi } from '@/api/services/inventoryReportApi,';
import {
  InventoryReportDetailsToRender,
  InventoryReportStatus,
  InventoryReportToRender,
  MaterialDetailsToRender,
  MaterialPackageOfInventoryReport,
  ProductDetailsToRender,
  ProductSizeOfInventoryReport
} from '@/types/InventoryReport';
import { formatDateTimeToDDMMYYYYHHMM } from '@/helpers/convertDate';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/Label';
import { getStatusBadgeVariant } from '@/helpers/getStatusBadgeVariant';
import { Badge, badgeVariants } from '@/components/ui/Badge';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import placeholder from '@/assets/images/null_placeholder.jpg';
import Loading from '@/components/common/Loading';
import { toast } from '@/hooks/use-toast';
import { BreadcrumbResponsive } from '@/components/common/BreadcrumbReponsive';
import SearchFunction from './components/SearchFunction';

export interface DetailsToApproveChange {
  details: DetailsToApprove[];
}

interface DetailsToApprove {
  inventoryReportDetailId: string;
  actualQuantity: number | null;
}

export default function WarehousestaffStocktakingDetails() {
  const { id } = useParams();
  // const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | null }>({});

  const [inventoryReport, setInventoryReport] = useState<InventoryReportToRender>();

  const [approvedDetails, setApprovedDetails] = useState<DetailsToApproveChange>({ details: [] });
  const [materialDetails, setMaterialDetails] = useState<MaterialDetailsToRender[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetailsToRender[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const breadcrumbItems = [
    {
      label: 'Stocktaking Plans',
      href: '/stocktaking'
    }
  ];

  const validateQuantity = (value: number | null): string | null => {
    if (value === null || value === undefined || value < 0 || value > 99999) {
      return 'Quantity must be between 0 and 99999.';
    }
    return null;
  };
  async function onSubmitInventoryReport() {
    try {
      // Validate all fields when submitting
      const newFieldErrors: { [key: string]: string | null } = {};
      let hasErrors = false;

      approvedDetails.details.forEach((detail) => {
        const error = validateQuantity(detail.actualQuantity);
        if (error) {
          newFieldErrors[detail.inventoryReportDetailId] = error;
          hasErrors = true; // Mark that there are validation errors
        }
      });

      setFieldErrors(newFieldErrors); // Update field errors state

      if (hasErrors) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please ensure all quantities are valid (between 0 and 99999).'
        });
        return;
      }

      setIsLoading(true);

      if (id) {
        const res = await privateCall(
          inventoryReportApi.recordInventoryReport(id, approvedDetails)
        );
        if (res.status === 200) {
          fetchData();
        }
      } else {
        throw new Error('ID is undefined');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve inventory report'
      });
      // Reset actualQuantity to null for all details
      setApprovedDetails((prev) => ({
        details: prev.details.map((detail) => ({
          ...detail,
          actualQuantity: null
        }))
      }));
    } finally {
      setIsLoading(false);
    }
  }

  const handleApproveChange = (id: string, value: number | null) => {
    // Validate the new value
    const errorMessage = validateQuantity(value);
    // Update field errors
    setFieldErrors((prev) => ({
      ...prev,
      [id]: errorMessage
    }));

    if (!errorMessage) {
      setApprovedDetails((prev) => {
        const existingIndex = prev.details.findIndex(
          (detail) => detail.inventoryReportDetailId === id
        );

        const updatedDetails = [...prev.details];

        if (existingIndex !== -1) {
          updatedDetails[existingIndex] = {
            ...updatedDetails[existingIndex],
            actualQuantity: value
          };
        } else {
          updatedDetails.push({
            inventoryReportDetailId: id,
            actualQuantity: value
          });
        }

        return { details: updatedDetails };
      });
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios(inventoryReportApi.getOneInventoryReport(id as string));
      const fetchedReport = response.data.data;

      setInventoryReport(response.data.data);
      // Initialize approvedDetails based on inventoryReportDetails
      const initialApprovedDetails: DetailsToApprove[] =
        fetchedReport.inventoryReportDetail.flatMap((detail: InventoryReportDetailsToRender) => [
          ...(detail.materialPackages
            ? detail.materialPackages.flatMap((item: MaterialPackageOfInventoryReport) =>
                item.inventoryReportDetails.map((reportDetail) => ({
                  inventoryReportDetailId: reportDetail.id,
                  actualQuantity: reportDetail.actualQuantity
                }))
              )
            : []),
          ...(detail.productSizes
            ? detail.productSizes.flatMap((item: ProductSizeOfInventoryReport) =>
                item.inventoryReportDetails.map((reportDetail) => ({
                  inventoryReportDetailId: reportDetail.id,
                  actualQuantity: reportDetail.actualQuantity
                }))
              )
            : [])
        ]);

      // Initialize fieldErrors for invalid quantities

      setApprovedDetails({ details: initialApprovedDetails });

      // Split into material and product details
      const materialDetails: MaterialDetailsToRender[] = [];
      const productDetails: ProductDetailsToRender[] = [];

      fetchedReport.inventoryReportDetail?.forEach((detail: any) => {
        if (detail.materialVariant) {
          materialDetails.push(detail);
        } else {
          productDetails.push(detail);
        }
      });

      setMaterialDetails(materialDetails);
      setProductDetails(productDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (!inventoryReport) {
    return (
      <div className="flex justify-center items-center">
        <h1>No inventory report found</h1>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 w-full  bg-white rounded-xl shadow-sm border">
      <BreadcrumbResponsive breadcrumbItems={breadcrumbItems} itemsToDisplay={1} />
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Inventory Report #{inventoryReport?.code}</h1>
        {/* <div>
          <Button variant="outline" className="mr-2">
            Sửa phiếu kiểm hàng
          </Button>
          <Button variant="destructive">Xóa phiếu kiểm hàng</Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardContent>
            <SearchFunction
              materialDetails={materialDetails}
              productDetails={productDetails}
              approvedDetails={approvedDetails}
              setApprovedDetails={setApprovedDetails}
            />
            {materialDetails.length > 0 && (
              <div className="pt-4">
                <Label className="text-xl font-bold ">Material Variant</Label>
                {materialDetails.map((detail, idx) => (
                  <div className="w-full">
                    <Accordion defaultValue="item-1" className="w-full" type="single" collapsible>
                      <AccordionItem className="w-full" value="item-1">
                        <AccordionTrigger className="w-full">
                          <div
                            key={idx}
                            className=" w-full flex items-center mb-4  p-2 justify-between">
                            <div className="flex items-center">
                              <img
                                src={detail.materialVariant.image ?? placeholder}
                                alt={detail.materialVariant.name}
                                className="w-16 h-16 object-cover rounded mr-4"
                              />
                              <div className="flex-grow">
                                <h3 className="font-semibold text-lg">
                                  {detail.materialVariant.name}
                                </h3>
                                <h4 className="font-semibold text-muted-foreground">
                                  {detail.materialVariant.code}
                                </h4>
                                <h4 className="font-semibold text-muted-foreground">
                                  {detail.materialVariant.material.name}
                                </h4>
                              </div>
                            </div>
                            {inventoryReport.status !== 'IN_PROGRESS' && (
                              <div>
                                <h4 className="font-semibold text-muted-foreground">
                                  Expected Quantity: {detail.totalExpectedQuantity}{' '}
                                </h4>
                                <h4 className="font-semibold text-muted-foreground">
                                  Actual Quantity: {detail.totalActualQuantity}{' '}
                                </h4>
                                <h4 className="font-semibold text-muted-foreground">
                                  Quantity of difference:{' '}
                                  {detail.totalActualQuantity - detail.totalExpectedQuantity}
                                </h4>
                              </div>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="w-full">
                          <div>
                            {detail.materialPackages.map((pkg, idx) => (
                              <div key={idx} className="flex items-center mb-4 border-b py-4">
                                <div className="flex-grow text-lg">
                                  <h3 className="font-semibold flex gap-2">
                                    Package:{' '}
                                    <h4 className="text-muted-foreground">
                                      {pkg.materialPackage.name} - {pkg.materialPackage.code}
                                    </h4>
                                  </h3>
                                  <div className="mb-2">
                                    <Label className="text-md">Receipt</Label>
                                  </div>

                                  <div className="flex-col flex gap-4 ">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[180px]">Receipt Code</TableHead>
                                          <TableHead>Recorded Quantity</TableHead>
                                          <TableHead>Actual Quantity</TableHead>
                                          <TableHead>Confirm Quantity</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {pkg.inventoryReportDetails.map((reportDetail) => (
                                          <>
                                            {inventoryReport.status === 'IN_PROGRESS' ? (
                                              <TableRow>
                                                <TableCell className="font-medium">
                                                  {reportDetail.materialReceipt.code}
                                                </TableCell>
                                                <TableCell>
                                                  {reportDetail.expectedQuantity}
                                                </TableCell>
                                                <TableCell>
                                                  <Input
                                                    type="number"
                                                    className="w-20"
                                                    value={reportDetail.actualQuantity}
                                                    min={0} // Set minimum value to 0
                                                    max={99999}
                                                    onWheel={(e) => e.currentTarget.blur()} // Prevent scrolling from changing the value
                                                    onChange={(e) => {
                                                      const inputValue = e.target.value;

                                                      // If the input is cleared, handle it as empty
                                                      if (inputValue === '') {
                                                        handleApproveChange(reportDetail.id, null); // Use `null` to indicate cleared input
                                                      } else {
                                                        handleApproveChange(
                                                          reportDetail.id,
                                                          +inputValue
                                                        ); // Parse the value as a number
                                                      }
                                                    }}
                                                    onKeyDown={(e) => {
                                                      // Prevent typing `-` or `e` in the input
                                                      if (
                                                        e.key === '-' ||
                                                        e.key === 'e' ||
                                                        e.key === 'E'
                                                      ) {
                                                        e.preventDefault();
                                                      }
                                                    }}
                                                  />

                                                  {fieldErrors[reportDetail.id] && (
                                                    <div className="text-red-500 text-xs">
                                                      {fieldErrors[reportDetail.id]}
                                                    </div>
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  {reportDetail.managerQuantityConfirm}
                                                </TableCell>
                                              </TableRow>
                                            ) : (
                                              <TableRow>
                                                <TableCell className="font-medium">
                                                  {reportDetail.materialReceipt.code}
                                                </TableCell>
                                                <TableCell>
                                                  {reportDetail.expectedQuantity}
                                                </TableCell>
                                                <TableCell>{reportDetail.actualQuantity}</TableCell>
                                                <TableCell>
                                                  {reportDetail.managerQuantityConfirm}
                                                </TableCell>
                                              </TableRow>
                                            )}
                                          </>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
            {/* product */}
            {productDetails.length > 0 && (
              <div className="pt-4">
                <Label className="text-xl font-bold ">Product Variants</Label>
                {productDetails.map((detail, idx) => (
                  <div className="w-full">
                    <Accordion defaultValue="item-1" className="w-full" type="single" collapsible>
                      <AccordionItem className="w-full" value="item-1">
                        <AccordionTrigger className="w-full">
                          <div
                            key={idx}
                            className=" w-full flex items-center mb-4  p-2 justify-between">
                            <div className="flex items-center">
                              <img
                                src={detail.productVariant.image ?? placeholder}
                                alt={detail.productVariant.name}
                                className="w-16 h-16 object-cover rounded mr-4"
                              />
                              <div className="flex-grow">
                                <h3 className="font-semibold text-lg">
                                  {detail.productVariant.name}
                                </h3>
                                <h4 className="font-semibold text-muted-foreground">
                                  {detail.productVariant.code}
                                </h4>
                                <h4 className="font-semibold text-muted-foreground">
                                  {detail.productVariant.product.name}
                                </h4>
                              </div>
                            </div>
                            {inventoryReport.status !== 'IN_PROGRESS' && (
                              <div>
                                <h4 className="font-semibold text-muted-foreground">
                                  Expected Quantity: {detail.totalExpectedQuantity}{' '}
                                </h4>
                                <h4 className="font-semibold text-muted-foreground">
                                  Actual Quantity: {detail.totalActualQuantity}{' '}
                                </h4>
                                <h4 className="font-semibold text-muted-foreground">
                                  Quantity of difference:{' '}
                                  {detail.totalActualQuantity - detail.totalExpectedQuantity}
                                </h4>
                              </div>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="w-full">
                          <div>
                            {detail.productSizes.map((pkg, idx) => (
                              <div key={idx} className="flex items-center mb-4 border-b py-4">
                                <div className="flex-grow text-lg">
                                  <h3 className="font-semibold flex gap-2">
                                    Package:{' '}
                                    <h4 className="text-muted-foreground">
                                      {pkg.productSize.name} - {pkg.productSize.code}
                                    </h4>
                                  </h3>
                                  <div className="mb-2">
                                    <Label className="text-md">Receipt</Label>
                                  </div>

                                  <div className="flex-col flex gap-4 ">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[180px]">Receipt Code</TableHead>
                                          <TableHead>Recorded Quantity</TableHead>
                                          <TableHead>Actual Quantity</TableHead>
                                          <TableHead>Confirm Quantity</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {pkg.inventoryReportDetails.map((reportDetail) => (
                                          <>
                                            {inventoryReport.status === 'IN_PROGRESS' ? (
                                              <TableRow>
                                                <TableCell className="font-medium">
                                                  {reportDetail.productReceipt.code}
                                                </TableCell>
                                                <TableCell>
                                                  {reportDetail.expectedQuantity}
                                                </TableCell>
                                                <TableCell>
                                                  <Input
                                                    type="number"
                                                    className="w-20"
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                    value={reportDetail.actualQuantity}
                                                    min={0} // Set minimum value to 0
                                                    max={99999}
                                                    onChange={(e) => {
                                                      const inputValue = e.target.value;

                                                      // If the input is cleared, handle it as empty
                                                      if (inputValue === '') {
                                                        handleApproveChange(reportDetail.id, null); // Use `null` to indicate cleared input
                                                      } else {
                                                        handleApproveChange(
                                                          reportDetail.id,
                                                          +inputValue
                                                        ); // Parse the value as a number
                                                      }
                                                    }}
                                                    onKeyDown={(e) => {
                                                      // Prevent typing `-` or `e` in the input
                                                      if (
                                                        e.key === '-' ||
                                                        e.key === 'e' ||
                                                        e.key === 'E'
                                                      ) {
                                                        e.preventDefault();
                                                      }
                                                    }}
                                                  />
                                                  {fieldErrors[reportDetail.id] && (
                                                    <div className="text-red-500 text-xs">
                                                      {fieldErrors[reportDetail.id]}
                                                    </div>
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  {reportDetail.managerQuantityConfirm}
                                                </TableCell>
                                              </TableRow>
                                            ) : (
                                              <TableRow>
                                                <TableCell className="font-medium">
                                                  {reportDetail.productReceipt.code}
                                                </TableCell>
                                                <TableCell>
                                                  {reportDetail.expectedQuantity}
                                                </TableCell>
                                                <TableCell>{reportDetail.actualQuantity}</TableCell>
                                                <TableCell>
                                                  {reportDetail.managerQuantityConfirm}
                                                </TableCell>
                                              </TableRow>
                                            )}
                                          </>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-xl font-bold">General Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 font-semibold">
              <p>Started At:</p>
              <p className="">{formatDateTimeToDDMMYYYYHHMM(inventoryReport.from)}</p>
              <p>Finished At:</p>
              <p>{formatDateTimeToDDMMYYYYHHMM(inventoryReport.to) || 'N/A'}</p>
              <p>Created by:</p>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={inventoryReport.warehouseStaff?.account?.avatarUrl}
                    alt="avatar"
                  />
                  <AvatarFallback>
                    {inventoryReport.warehouseStaff?.account?.firstName}
                  </AvatarFallback>
                </Avatar>
                <Label className="text-md">
                  {inventoryReport.warehouseStaff?.account.firstName}{' '}
                  {inventoryReport.warehouseStaff?.account.lastName}
                </Label>
              </div>
              <p>Status:</p>
              <Badge
                className={`w-fit ${badgeVariants({
                  variant: getStatusBadgeVariant(
                    inventoryReport.status ?? '',
                    InventoryReportStatus
                  )
                })}`}>
                {convertTitleToTitleCase(inventoryReport.status)}
              </Badge>
              {inventoryReport.status === 'REPORTED' && (
                <div className="mt-4 col-span-2">
                  <p>Recorded Quantity: {inventoryReport.totalExpectedQuantity}</p>
                  <p>Actual Quantity: {inventoryReport.totalActualQuantity}</p>
                  <p>
                    Quantity of difference:{' '}
                    {inventoryReport.totalActualQuantity - inventoryReport.totalExpectedQuantity}
                  </p>
                </div>
              )}
              {inventoryReport.status === 'FINISHED' && (
                <div className="mt-4 col-span-2">
                  <p>Recorded Quantity: {inventoryReport.totalExpectedQuantity}</p>
                  <p>Actual Quantity: {inventoryReport.totalManagerQuantityConfirm}</p>
                  <p>
                    Quantity of difference:{' '}
                    {inventoryReport.totalManagerQuantityConfirm -
                      inventoryReport.totalExpectedQuantity}
                  </p>
                </div>
              )}
            </div>
            {/* {inventoryReport.status === 'IN_PROGRESS' && (
              
              <Button type="submit" onClick={onSubmitInventoryReport} className="mt-4 w-full">
                Confirm Report
              </Button>
            )} */}
            {inventoryReport.status === 'IN_PROGRESS' && (
              <div className="flex justify-center items-center mt-4 w-full">
                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button"> Confirm Report</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit report </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to submit? Your report will be notified to the
                        manager.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onSubmitInventoryReport} type="submit">
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
