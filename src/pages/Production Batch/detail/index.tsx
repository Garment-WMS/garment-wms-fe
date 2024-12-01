import { useParams } from 'react-router-dom';
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
import { Package, Box } from 'lucide-react';

const ProductionBatchDetail = () => {
  const { id } = useParams();
  const { data, isPending, isError } = useGetProductionBatchById(id!);

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
    materialExportRequest,
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
        <CardContent className="flex flex-col items-center">
          <div className="flex flex-row justify-center">
            <img
              src={productionPlanDetail.productSize.productVariant.image}
              alt="Product Variant"
              className="w-64 h-64 object-cover rounded mt-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 items">
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
            <div>
              <p className="text-sm font-medium">Created At:</p>
              <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Material Export Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionBatchDetail;
