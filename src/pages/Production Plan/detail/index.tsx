import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  CalendarMinus,
  CalendarPlus,
  CheckCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
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
import { convertDateWithTime } from '@/helpers/convertDateWithTime';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  variant: 'success' | 'error' | 'manufacturing';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, variant }) => {
  const variantStyles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    manufacturing: 'bg-yellow-50 border-yellow-200 text-yellow-700'
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

  // Group production plan details by product variant
  const groupedDetails = plan.productionPlanDetail.reduce(
    (acc: any, detail: any) => {
      const variantId = detail.productSize.productVariant.id;
      if (!acc[variantId]) {
        acc[variantId] = {
          ...detail.productSize.productVariant,
          sizes: []
        };
      }
      acc[variantId].sizes.push(detail);
      return acc;
    },
    {} as Record<string, { sizes: ProductionPlanDetailType[]; name: string; image: string }>
  );

  return (
    <div className="bg-white px-5 py-3 rounded-xl shadow-lg ring-1 flex flex-col gap-8">
      {/* Header Card */}
      <Card className="mb-6 border-b-4">
        <CardHeader className="flex flex-col gap-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex flex-row items-center gap-5">
              <CardTitle className="text-3xl font-bold text-blue-800">{plan.name}</CardTitle>
              <Badge className="bg-primaryLight mt-1">{plan.code}</Badge>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Badge
                className={`px-3 py-1 rounded text-lg ${
                  plan.status === ProductionPlanStatus.PLANNING
                    ? 'bg-yellow-500 text-white'
                    : plan.status === ProductionPlanStatus.IN_PROGRESS
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                }`}>
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

      {/* Product Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 grid-cols-2">
            {Object.values(groupedDetails).map((variant: any) => (
              <Card key={variant.name} className="shadow-lg rounded-lg overflow-hidden">
                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                  <img src={variant.image} alt={variant.name} className="object-contain h-full" />
                </div>
                <CardContent className="p-4">
                  <div className="mb-3 flex flex-row items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{variant.name}</h3>
                  </div>
                  {variant.sizes.map((sizeDetail: any, index: any) => (
                    <ExpandableSizeDetail
                      key={sizeDetail.id}
                      sizeDetail={sizeDetail}
                      isLast={index === variant.sizes.length - 1}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start Plan Modal */}
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
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  This action will initiate the production process. Please ensure all prerequisites
                  are met.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
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

const ExpandableSizeDetail: React.FC<{ sizeDetail: any; isLast: boolean }> = ({
  sizeDetail,
  isLast
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(sizeDetail);
  return (
    <div className={`pt-4 ${!isLast ? 'border-b border-gray-300 pb-4' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-gray-700">
            Size:{' '}
            <span className="text-lg font-semibold text-primaryLight">
              {sizeDetail.productSize.size}
            </span>
          </h4>
          <p className="text-sm font-medium text-gray-700">
            Quantity To Produce:{' '}
            <span className="text-lg font-semibold text-primaryLight">
              {sizeDetail.quantityToProduce}
            </span>
          </p>
        </div>
        <div className="flex flex-col">
          <Badge>{sizeDetail?.code}</Badge>
          <p className="text-sm font-medium text-gray-700">
            Quantity Produced:{' '}
            <span className="text-lg font-semibold text-green-800">
              {sizeDetail.productPlanDetailProducedQuantity}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700">
          {isExpanded ? 'Hide Details' : 'Show Details'}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50  rounded-lg p-4 shadow-inner">
            <h5 className="text-sm font-semibold text-gray-700  text-center mb-5">
              Product Specifications
            </h5>
            <div className="grid grid-cols-2 items-center ml-[5rem] gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Width:</span>
                <span className="text-sm font-semibold text-gray-700">
                  {sizeDetail.productSize.width} m
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Height:</span>
                <span className="text-sm font-semibold text-gray-700">
                  {sizeDetail.productSize.height} m
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Length:</span>
                <span className="text-sm font-semibold text-gray-700">
                  {sizeDetail.productSize.length} m
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Weight:</span>
                <span className="text-sm font-semibold text-gray-700">
                  {sizeDetail.productSize.weight} kg
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <SummaryCard
              title="Manufacturing Quantity"
              value={sizeDetail?.productPlanDetailManufacturingQuantity ?? 0}
              icon={<PlayCircle className="h-5 w-5" />}
              variant="manufacturing"
            />
            <SummaryCard
              title="Defect Quantity"
              value={sizeDetail?.productPlanDetailDefectQuantity ?? 0}
              icon={<AlertCircle className="h-5 w-5" />}
              variant="error"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionPlanDetail;
