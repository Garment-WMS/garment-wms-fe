import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { ProductionPlanStatus } from '@/enums/productionPlan';
import { convertDate } from '@/helpers/convertDate';
import { useGetAllProductionPlans } from '@/hooks/useGetAllProductionPlan';
import { useStartProductionPlan } from '@/hooks/useStartProductionPlan';
import { SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { ProductionPlan } from '@/types/ProductionPlan';
import { AlertTriangle, CalendarArrowDown, CalendarArrowUp, PlayCircle, Plus } from 'lucide-react';
import ProductionPlanIntroduction from './components/Introduction';
import { DialogDescription } from '@radix-ui/react-dialog';
import { FactoryDirectorGuardDiv } from '@/components/authentication/createRoleGuard';
import ProductionPlanSummary from './components/ProductionPlanSummary';

const getStatusBadgeClass = (status: ProductionPlanStatus) => {
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

const ProductionPlanManagement = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });
  const [selectedPlan, setSelectedPlan] = useState<ProductionPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { productionPlanList, pageMeta, isPending, isError } = useGetAllProductionPlans({
    sorting,
    columnFilters,
    pagination
  });

  const { startPlan, isPending: isStartingPlan } = useStartProductionPlan();

  const handleStartPlan = () => {
    if (selectedPlan) {
      startPlan(
        { id: selectedPlan.id },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            navigate(`/production-plan/${selectedPlan.id}`);
          }
        }
      );
    }
  };

  const openModal = (plan: ProductionPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <p>Failed to load production plans. Please try again later.</p>;
  }

  const plans = productionPlanList?.data || [];

  return (
    <div className="h-auto w-full px-4 py-3 flex flex-col space-y-3">
      <ProductionPlanIntroduction />
      <FactoryDirectorGuardDiv>
        <div className="flex justify-end items-center mb-6">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Plan
          </Button>
        </div>
      </FactoryDirectorGuardDiv>

      {/* Production Plan Summary */}
      {<ProductionPlanSummary productionPlanList={plans} />}

      {/* Production Plan List */}
      {plans.map((plan: ProductionPlan) => (
        <Card key={plan.id} className="mb-6 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                <div className="flex items-center gap-2">
                  <Link
                    className="text-primaryLight underline hover:opacity-50 cursor-pointer"
                    to={{
                      pathname: `/production-plan/${plan.id}`
                    }}
                    state={{ plan }}>
                    <span>{plan.name}</span>
                  </Link>
                  <span>
                    <Badge className="bg-gray-500 ml-2 text-white px-2 py-1 rounded">
                      {plan.code}
                    </Badge>
                  </span>
                  <Badge
                    className={`${getStatusBadgeClass(plan.status as ProductionPlanStatus)} px-2 mt-2 rounded`}>
                    {ProductionPlanStatus[plan.status as ProductionPlanStatus]}
                  </Badge>
                </div>
              </CardTitle>
              {plan.status === ProductionPlanStatus.PLANNING && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => openModal(plan)}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Plan
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between w-full mb-4">
              <div className="flex items-center gap-2">
                <CalendarArrowUp className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Expected Start Date:</p>
                <Badge variant="outline" className="text-green-600 font-semibold">
                  {convertDate(plan.expectedStartDate)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <CalendarArrowDown className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Expected End Date:</p>
                <Badge variant="outline" className="text-red-600 font-semibold">
                  {convertDate(plan.expectedEndDate)}
                </Badge>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plan.productionPlanDetail.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.productSize.productVariant.name}</TableCell>
                    <TableCell>{detail.productSize.size}</TableCell>
                    <TableCell>{detail.quantityToProduce}</TableCell>
                    <TableCell>{detail.code}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Complete Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
          disabled={pagination.pageIndex === 0}>
          Previous
        </Button>
        <p>
          Page {pagination.pageIndex + 1} of {productionPlanList?.pageMeta?.totalPages || 1}
        </p>
        <Button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
          disabled={
            !productionPlanList?.pageMeta ||
            pagination.pageIndex + 1 >= productionPlanList?.pageMeta?.totalPages
          }>
          Next
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Start Production Plan
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Are you sure you want to start the production plan ?
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

export default ProductionPlanManagement;
