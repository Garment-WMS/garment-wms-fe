import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CalendarCheck, CalendarX, CheckCircle, PlayCircle } from 'lucide-react';
import { useGetProductionPlanById } from '@/hooks/useGetProductionPlanById';
import { useStartProductionPlan } from '@/hooks/useStartProductionPlan';
import { ProductionPlanStatus } from '@/enums/productionPlan';
import { ProductionPlanDetail as ProductionPlanDetailType } from '@/types/ProductionPlan';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/Dialog';
import { convertDate } from '@/helpers/convertDate';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  variant: 'success' | 'error';
}

interface KeyValueDisplayProps {
  name: string;
  value: string | number;
  className?: string;
  valueColor?: string;
  nameColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, variant }) => {
  const variantStyles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700'
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

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({
  name,
  value,
  className = '',
  nameColor = 'text-gray-600',
  valueColor = 'text-gray-900'
}) => {
  return (
    <div
      className={`flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 ${className}`}>
      <span className={`text-[15px] ${nameColor} flex-1`}>{name}</span>
      <span className={`text-[18px] font-medium ${valueColor}`}>{value}</span>
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

const ProductionPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStartingPlan, setIsStartingPlan] = useState(false);
  const { data, isPending, isError } = useGetProductionPlanById(id!);
  const { startPlan } = useStartProductionPlan();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleStartPlan = () => {
    if (data?.data) {
      setIsStartingPlan(true);
      startPlan(
        { id: data.data.id },
        {
          onSuccess: () => {
            setIsStartingPlan(false);
            closeModal();
            navigate(0);
          },
          onError: () => setIsStartingPlan(false)
        }
      );
    }
  };

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
    <div className="bg-white px-5 py-3 rounded-xl shadow-lg ring-1 flex flex-col gap-8">
      {/* Header Card */}
      <Card className="mb-6 border-b-4">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex flex-row items-center gap-5">
              <CardTitle className="text-3xl font-bold text-blue-800">{plan.name}</CardTitle>
              <Badge className="bg-primaryLight mt-1">{plan.code}</Badge>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Badge className={`px-3 py-1 rounded text-lg ${getStatusBadgeStyle(plan.status)}`}>
                {convertTitleToTitleCase(plan.status)}
              </Badge>
              {plan.status === ProductionPlanStatus.PLANNING && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={openModal}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Plan
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Plan Summary Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 mt-4">Production Plan Summary</h2>
        <div className="space-y-1">
          <KeyValueDisplay
            name="Total Products to Produce"
            value={plan?.totalQuantityToProduce}
            valueColor="text-slate-600 "
            nameColor="text-green-800"
          />
          <KeyValueDisplay
            name="Expected Start Date"
            value={convertDate(plan?.expectedStartDate)}
            valueColor="text-green-600"
            nameColor="text-green-800"
          />
          <KeyValueDisplay
            name="Expected End Date"
            value={convertDate(plan?.expectedEndDate)}
            valueColor="text-red-600"
            nameColor="text-red-800"
          />
          {/* <KeyValueDisplay
            name="Items Remaining to Import"
            value={`${totalQuantityToImport.toLocaleString()} items`}
          /> */}
        </div>
      </section>

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
              const defectQuantity = detail?.productPlanDetailDefectQuantity || 0;
              const producedQuantity = detail?.productPlanDetailProducedQuantity || 0;

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
                    <div className="mb-3">
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
                        title="Produced Quantity"
                        value={producedQuantity}
                        icon={<CheckCircle className="h-5 w-5" />}
                        variant="success"
                      />
                      <SummaryCard
                        title="Defect Quantity"
                        value={defectQuantity}
                        icon={<AlertCircle className="h-5 w-5" />}
                        variant="error"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Start Production Plan
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Are you sure you want to start the production plan?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              <p className="ml-3 text-sm text-red-700">
                This action will initiate the production process. Please ensure all prerequisites
                are met.
              </p>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleStartPlan}
              disabled={isStartingPlan}>
              {isStartingPlan ? 'Starting...' : 'Yes, Start Plan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="mt-3 sm:mt-0 ring-1 ring-red-500 text-red-500 hover:text-red-300">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductionPlanDetail;
