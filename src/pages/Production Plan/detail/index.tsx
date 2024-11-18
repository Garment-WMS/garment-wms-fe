import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarArrowDown, CalendarArrowUp } from 'lucide-react';
import { convertDate } from '@/helpers/convertDate';
import { ProductionPlan } from '@/types/ProductionPlan';
import { ProductionPlanStatus } from '@/enums/productionPlan';
import { BreadcrumbResponsive } from '@/components/common/BreadcrumbReponsive';

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case ProductionPlanStatus.PLANNING:
      return 'bg-yellow-500 text-white';
    case ProductionPlanStatus.IN_PROGRESS:
      return 'bg-blue-500 text-white';
    case ProductionPlanStatus.FINISHED:
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const ProductionPlanDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as ProductionPlan;
  const breadcrumbItems = [
    { label: 'Production Plan', href: '/purchase-staff/production-plan' },
    { label: `Production Plan #${plan.code}`, href: `/purchase-staff/purchase-order/${plan.id}` }
  ];
  if (!plan) {
    return (
      <div className="container mx-auto py-10">
        <Card className="p-6">
          <p className="text-lg font-medium text-red-500">
            No production plan data available. Please go back and select a plan.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
            Go Back
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white px-5 py-3 rounded-xl shadow-lg ring-1 ring-gray-300 flex flex-col gap-8">
      <BreadcrumbResponsive breadcrumbItems={breadcrumbItems} itemsToDisplay={2} />
      {/* Header Card */}
      <Card className="mb-6 border-t-4 border-t-blue-500 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex flex-row items-center gap-5">
              <CardTitle className="text-3xl font-bold text-blue-800">{plan.name}</CardTitle>
              <Badge className="bg-gray-500 mt-1">{plan.code}</Badge>
            </div>
            <Badge className={`px-3 py-1 rounded text-lg ${getStatusBadgeStyle(plan.status)}`}>
              {plan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex justify-center items-center bg-blue-50 p-4 rounded-lg shadow-sm w-full">
              <CalendarArrowUp className="mr-4 h-8 w-8 text-gray-500" />
              <div className="flex flex-row items-center gap-3">
                <p className="text-sm font-medium text-gray-600">Expected Start Date</p>
                <p className="text-lg font-semibold">
                  <Badge className="bg-green-500 px-2 py-1 text-white">
                    {convertDate(plan.expectedStartDate)}
                  </Badge>
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center bg-blue-50 p-4 rounded-lg shadow-sm w-full">
              <CalendarArrowDown className="mr-4 h-8 w-8 text-gray-500" />
              <div className="flex flex-row items-center gap-3">
                <p className="text-sm font-medium text-gray-600">Expected End Date</p>
                <p className="text-lg font-semibold">
                  <Badge className="bg-red-500 px-2 py-1 text-white">
                    {convertDate(plan.expectedEndDate)}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Products and Plan Details */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="products" className="text-lg py-3">
            Table
          </TabsTrigger>
          <TabsTrigger value="details" className="text-lg py-3">
            Details
          </TabsTrigger>
        </TabsList>
        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="font-semibold text-blue-800">Product</TableHead>
                    <TableHead className="font-semibold text-blue-800">Size</TableHead>
                    <TableHead className="font-semibold text-blue-800">Quantity</TableHead>
                    <TableHead className="font-semibold text-blue-800">Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan.productionPlanDetail.map((detail, index) => (
                    <TableRow
                      key={detail.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <TableCell className="font-medium">
                        {detail.productSize.productVariant.name}
                      </TableCell>
                      <TableCell>{detail.productSize.size}</TableCell>
                      <TableCell>{detail.quantityToProduce}</TableCell>
                      <TableCell className="font-mono">
                        <Badge className="bg-gray-500">{detail.code}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {plan.productionPlanDetail.map((detail) => (
                  <Card key={detail.id} className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-lg text-blue-800">
                        {detail.productSize.productVariant.name} - {detail.productSize.size}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-blue-600">Quantity to Produce:</p>
                          <p className="text-lg">{detail.quantityToProduce}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600">Product Code:</p>
                          <p className="text-lg font-mono">
                            <Badge className="bg-gray-500">{detail.productSize.code}</Badge>
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600">Dimensions:</p>
                          <p className="text-lg">
                            {detail.productSize.width}m x {detail.productSize.length}m x{' '}
                            {detail.productSize.height}m
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600">Weight:</p>
                          <p className="text-lg">{detail.productSize.weight} kg</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionPlanDetail;
