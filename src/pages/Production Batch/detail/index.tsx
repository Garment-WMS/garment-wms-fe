import { useParams } from 'react-router-dom';
import { useGetProductionBatchById } from '@/hooks/useGetProductionBatchById';
import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Package, ClipboardList, Box, Calendar, User, Truck } from 'lucide-react';

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
    importRequest,
    productionBatchMaterialVariant,
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
        <CardContent>
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
              <Badge variant={status === 'IMPORTING' ? 'default' : 'secondary'}>{status}</Badge>
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
            Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="ml-5">Code</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionBatchMaterialVariant.map((material: any) => (
                <TableRow key={material.id}>
                  <TableCell>
                    <img
                      src={material.materialVariant.image}
                      alt={material.materialVariant.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-lg">
                    {material.materialVariant.name}
                  </TableCell>
                  <TableCell>
                    <Badge className="">{material.materialVariant.code}</Badge>
                  </TableCell>
                  <TableCell>
                    {material.quantityByUom}{' '}
                    {material.materialVariant.material.materialUom.uomCharacter}
                  </TableCell>
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
