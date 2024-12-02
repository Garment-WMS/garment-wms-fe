import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductionBatchById } from '@/hooks/useGetProductionBatchById';
import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Package, Box, ClipboardList, Truck, CalendarDays } from 'lucide-react';
import EmptyDatacomponent from '@/components/common/EmptyData';

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
    productionPlanDetail
  } = data?.data;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Production Batch Details</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Batch Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <img
              src={productionPlanDetail?.productSize?.productVariant?.image || ''}
              alt="Product Variant"
              className="w-full max-w-md h-auto object-cover rounded"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Code:</p>
                <p className="text-primaryLight font-semibold">{code}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Name:</p>
                <p className="text-lg font-semibold text-primaryDark">{name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <Badge className="bg-slate-500">{status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Quantity to Produce:</p>
                <p className="text-lg font-semibold">{quantityToProduce}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Production Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Created At:</p>
                  <p>{new Date(createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Start Date:</p>
                  <p>{startDate ? new Date(startDate).toLocaleString() : 'Not started'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Finished Date:</p>
                  <p>{finishedDate ? new Date(finishedDate).toLocaleString() : 'Not finished'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Expected Finish Date:</p>
                  <p>
                    {expectedFinishDate ? new Date(expectedFinishDate).toLocaleString() : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Information</h3>
              <p>
                <span className="font-medium">Product:</span>{' '}
                {productionPlanDetail?.productSize?.productVariant?.product?.name}
              </p>
              <p>
                <span className="font-medium">Variant:</span>{' '}
                {productionPlanDetail?.productSize?.productVariant?.name}
              </p>
              <p>
                <span className="font-medium">Size:</span> {productionPlanDetail?.productSize?.size}
              </p>
              <p>
                <span className="font-medium">UOM:</span>{' '}
                {productionPlanDetail?.productSize?.productVariant?.product?.productUom?.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Production Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Plan Name:</p>
              <p>{productionPlanDetail?.productionPlan?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Plan Code:</p>
              <p>{productionPlanDetail?.productionPlan?.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Plan Status:</p>
              <Badge className="bg-blue-500">{productionPlanDetail?.productionPlan?.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Expected Start Date:</p>
              <p>
                {new Date(
                  productionPlanDetail?.productionPlan?.expectedStartDate
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Expected End Date:</p>
              <p>
                {new Date(
                  productionPlanDetail?.productionPlan?.expectedEndDate
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Import Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(request.id)}>
                    <TableCell>{request.code}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-500">{request.status}</Badge>
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyDatacomponent />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Material Export Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                {materialExportRequest.map((request: any) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.code}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-500">{request.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{request.description || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyDatacomponent />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionBatchDetail;
