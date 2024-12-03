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
import { Package, Box, ClipboardList, Truck, CalendarDays, Layers } from 'lucide-react';
import EmptyDatacomponent from '@/components/common/EmptyData';
import { getIconAttributes } from '@/helpers/getIconAttributes';

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
    productionBatchMaterialVariant
  } = data?.data || {};

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Production Batch Details</h1>

      {/* Batch Information Card */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Batch Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
            {/* Left Column - Image and Basic Info */}
            <div className="p-6 space-y-6">
              <div className="flex justify-center items-center aspect-video bg-muted/10 rounded-lg overflow-hidden">
                <img
                  src={productionPlanDetail?.productSize?.productVariant?.image || ''}
                  alt="Product Variant"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
                  <p className="font-semibold">{code}</p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="font-semibold">{name}</p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge>{status}</Badge>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
                  <p className="font-semibold">{quantityToProduce}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Production Details and Product Info */}
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Production Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                    <p>{new Date(createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                    <p>{startDate ? new Date(startDate).toLocaleString() : 'Not started'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium text-muted-foreground">Finished Date</h4>
                    <p>{finishedDate ? new Date(finishedDate).toLocaleString() : 'Not finished'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium text-muted-foreground">Expected Finish</h4>
                    <p>
                      {expectedFinishDate
                        ? new Date(expectedFinishDate).toLocaleString()
                        : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Information</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Product: </span>
                      <span>
                        {productionPlanDetail?.productSize?.productVariant?.product?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Variant: </span>
                      <span>{productionPlanDetail?.productSize?.productVariant?.name}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Size: </span>
                      <span>{productionPlanDetail?.productSize?.size}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">UOM: </span>
                      <span>
                        {
                          productionPlanDetail?.productSize?.productVariant?.product?.productUom
                            ?.name
                        }
                      </span>
                    </div>
                  </div>
                </div>
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
                    <span className="font-bold text-xs">
                      {material.quantityByUom}{' '}
                      {material.materialVariant.material.materialUom.uomCharacter}
                    </span>
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

      {/* Import Requests Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Import Requests
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
                    <TableCell>{request.code}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{request.status}</Badge>
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
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

      {/* Material Export Requests Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
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
                {materialExportRequest.map((request: any) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.code}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{request.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{request.description || 'N/A'}</TableCell>
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
