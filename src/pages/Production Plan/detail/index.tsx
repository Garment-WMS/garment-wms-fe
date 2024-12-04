import { useParams, useNavigate } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Package } from 'lucide-react';
import { useGetProductionPlanById } from '@/hooks/useGetProductionPlanById';
import { ProductionPlanStatus } from '@/enums/productionPlan';
import { ProductionPlanDetail as ProductionPlanDetailType } from '@/types/ProductionPlan';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  variant: 'success' | 'warning' | 'error' | 'info';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, variant }) => {
  const variantStyles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };
  const selectedStyles = variantStyles[variant];
  return (
    <div className={`p-2 border rounded-lg flex flex-col items-center ${selectedStyles} w-full`}>
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 text-sm font-medium text-center">{title}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
};

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

const mockProductionPlanDetailData = (detailId: string) => ({
  importedQuantity: Math.floor(Math.random() * 500),
  defectQuantity: Math.floor(Math.random() * 50),
  approvedQuantity: Math.floor(Math.random() * 450),
  manufacturingQuantity: Math.floor(Math.random() * 400)
});

const ProductionPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isPending, isError } = useGetProductionPlanById(id!);

  if (isPending) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto py-10">
        <Card className="p-6">
          <p className="text-lg font-medium text-red-500">
            Failed to load production plan. Please go back and try again.
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

  const plan = data.data;

  return (
    <div className="bg-white px-5 py-3 rounded-xl shadow-lg ring-1  flex flex-col gap-8">
      {/* Header Card */}
      <Card className="mb-6 border-b-4">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex flex-row items-center gap-5">
              <CardTitle className="text-3xl font-bold text-blue-800">{plan.name}</CardTitle>
              <Badge className="bg-primaryLight mt-1">{plan.code}</Badge>
            </div>
            <Badge className={`px-3 py-1 rounded text-lg ${getStatusBadgeStyle(plan.status)}`}>
              {convertTitleToTitleCase(plan.status)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Product Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Product Details</CardTitle>
          <p className="text-sm text-gray-500">
            Below are the details of the products included in the production plan.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plan.productionPlanDetail.map((detail: ProductionPlanDetailType) => {
              const mockData = mockProductionPlanDetailData(detail.id);
              return (
                <Card key={detail.id} className="shadow-lg rounded-lg overflow-hidden">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                    <img
                      src={detail.productSize.productVariant.image}
                      alt={detail.productSize.productVariant.name}
                      className="object-contain h-full"
                    />
                  </div>
                  {/* Product Details */}
                  <CardContent className="p-4">
                    <div className=" mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {detail.productSize.productVariant.name} - {detail.productSize.size}
                      </h3>
                      <span className="text-sm font-semibold text-primaryLight">
                        Code: {detail.productSize.code}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-5">
                      <p className="text-sm font-medium text-gray-700">Quantity to Produce:</p>
                      <p className="text-lg font-bold text-gray-900">{detail.quantityToProduce}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <SummaryCard
                        title="Imported Quantity"
                        value={mockData.importedQuantity}
                        icon={<Package className="h-5 w-5" />}
                        variant="info"
                      />
                      <SummaryCard
                        title="Defect Quantity"
                        value={mockData.defectQuantity}
                        icon={<AlertCircle className="h-5 w-5" />}
                        variant="error"
                      />
                      <SummaryCard
                        title="Approved Quantity"
                        value={mockData.approvedQuantity}
                        icon={<CheckCircle className="h-5 w-5" />}
                        variant="success"
                      />
                      <SummaryCard
                        title="Manufacturing Quantity"
                        value={mockData.manufacturingQuantity}
                        icon={<Package className="h-5 w-5" />}
                        variant="warning"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionPlanDetail;
