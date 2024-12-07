import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetProductionBatchById } from '@/hooks/useGetProductionBatchById';
import Loading from '@/components/common/Loading';
import { Badge, badgeVariants } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import {
  Package,
  Truck,
  CalendarDays,
  Layers,
  ArrowUpCircle,
  ArrowDownCircle,
  FileInput,
  FileOutput
} from 'lucide-react';
import EmptyDatacomponent from '@/components/common/EmptyData';
import { getIconAttributes } from '@/helpers/getIconAttributes';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import { Button } from '@/components/ui/button';
import { ProductionDepartmentGuardDiv } from '@/components/authentication/createRoleGuard';
import Colors from '@/constants/color';
import { ExportRequestStatus } from '@/types/exportRequest';
import { getStatusBadgeVariant } from '@/pages/ImportRequests/management/helper';

interface ProductionBatchDetailProps {
  productionPlanDetail: any;
  materialExportRequest: any[];
  importRequest: any[];
  code: string;
  name: string;
  status: string;
  quantityToProduce: number;
  createdAt: string;
  startDate: string | null;
  finishedDate: string | null;
  expectedFinishDate: string | null;
  productionBatchMaterialVariant: any[];
}
function formatString(input: string): string {
  return input
    .toLowerCase() // Convert the entire string to lowercase first
    .split('_') // Split by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(' '); // Join the words back with spaces
}

const ProductionBatchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError } = useGetProductionBatchById(id!);
  const navigate = useNavigate();

  const handleRowClick = (id: string) => {
    navigate(`/import-request/${id}`);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">Failed to load production batch details</div>;
  }

  const {
    code,
    name,
    status,
    quantityToProduce,
    createdAt,
    startDate,
    finishedDate,
    expectedFinishDate,
    materialExportRequest,
    importRequest,
    productionPlanDetail,
    productionBatchMaterialVariant,
    numberOfProducedProduct
  } = data?.data || {};

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Production Batch Details</h1>
        <div className="flex flex-row items-center gap-2">
          <ProductionDepartmentGuardDiv>
            <Button className="bg-white ring-1 ring-primaryLight text-primaryLight">
              <FileOutput size={18} color={Colors.primaryLightBackgroundColor} className="mr-3" />
              Create Import
            </Button>
          </ProductionDepartmentGuardDiv>
          <ProductionDepartmentGuardDiv>
            <Button>
              <FileInput size={18} color="#ffffff" className="mr-3" />
              Create Export
            </Button>
          </ProductionDepartmentGuardDiv>
        </div>
      </div>

      {/* Batch Information Card */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b flex flex-row justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Batch Information
            <Badge className="ml-3">{status}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">No Produced Product:</span>
            <span className="text-md font-semibold text-foreground">
              {numberOfProducedProduct || 0}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Image Section */}
            <div className="flex justify-center items-center bg-muted/10 rounded-lg p-4">
              <img
                src={productionPlanDetail?.productSize?.productVariant?.image || ''}
                alt="Product Variant"
                className="h-32 w-32 object-contain rounded"
              />
            </div>

            {/* Details Section */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Product</h3>
                <p className="font-semibold">{productionPlanDetail?.productSize?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="font-semibold">{name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
                <p className="font-semibold text-primaryLight">{code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                <p>{convertDateWithTime(createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Batch quantity</h3>
                <p className="font-semibold">{quantityToProduce}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Planning quantity</h3>
                <p className="font-semibold">{productionPlanDetail?.quantityToProduce}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                <p>{startDate ? convertDateWithTime(startDate) : 'Not yet'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Finished Date</h3>
                <p>{finishedDate ? convertDateWithTime(finishedDate) : 'Not yet'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Formula Receipt Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Product Formula Receipt
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid sm:grid-cols-2 gap-6 justify-center space-y-3">
            {productionBatchMaterialVariant.map((material: any) => (
              <Card
                key={material.id}
                className="border rounded-lg shadow-lg overflow-hidden w-[32rem]  mx-auto">
                {/* Image Container */}
                <div className="h-24 bg-white flex justify-center items-center">
                  <img
                    src={material.materialVariant.image}
                    alt={material.materialVariant.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {/* Card Content */}
                <CardContent className="p-3 space-y-3">
                  <div className="flex flex-row items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {material.materialVariant.name}
                    </h3>
                    <Badge>{material.materialVariant.code}</Badge>
                  </div>
                  <div className="flex flex-row justify-end items-center gap-2">
                    <p className="text-xs font-medium text-slate-500">Quantity: </p>{' '}
                    <span className="font-bold text-xs">{material.quantityByUom} </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Attributes:</h4>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                      {material.materialVariant.materialAttribute.map((attr: any) => (
                        <div key={attr.id} className="flex items-center text-xs space-x-2">
                          {getIconAttributes(attr.name)}
                          <span className="font-medium">{attr.name}:</span>
                          <span>{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Material Export Requests Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <FileInput className="h-5 w-5" />
            Material Export Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {materialExportRequest.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialExportRequest.map((request: any) => {
                  // Match the status to the corresponding `ExportRequestStatus` entry
                  const matchedStatus = ExportRequestStatus.find(
                    (status) => status.value === request.status
                  );

                  return (
                    <TableRow key={request.id}>
                      {/* Code */}
                      <TableCell>
                        <Link
                          to={`/export-request/${request.id}`}
                          className="font-semibold text-primary underline">
                          {request.code}
                        </Link>
                      </TableCell>

                      {/* Status with Dynamic Badge */}
                      <TableCell>
                        {matchedStatus ? (
                          <Badge variant={matchedStatus.variant}>{matchedStatus.label}</Badge>
                        ) : (
                          <Badge variant="neutral">Unknown</Badge>
                        )}
                      </TableCell>

                      {/* Created At */}
                      <TableCell>{convertDateWithTime(request.createdAt)}</TableCell>

                      {/* Description */}
                      <TableCell>{request.description || 'N/A'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyDatacomponent />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Requests Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <FileOutput className="h-5 w-5" />
            Material Import Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {importRequest && importRequest.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importRequest.map((request: any) => (
                  <TableRow
                    key={request.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(request.id)}>
                    <TableCell>
                      <Link
                        to={`/import-request/${request.id}`}
                        className="font-semibold text-primary underline">
                        {request.code}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`${badgeVariants({
                          variant: getStatusBadgeVariant(request.status ?? '')
                        })} w-[110px] flex justify-center`}>
                        {formatString(request.status ?? 'N/A')}
                      </div>
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Use 24-hour format
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyDatacomponent />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionBatchDetail;
