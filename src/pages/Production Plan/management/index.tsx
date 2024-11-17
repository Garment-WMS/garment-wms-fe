import { useGetAllProductionPlans } from '@/hooks/useGetAllProductionPlan';

const ProductionPlanManagement = () => {
  const { data } = useGetAllProductionPlans();
  console.log(data);
  return (
    <div>
      <h1>Production Plan</h1>
    </div>
  );
};

export default ProductionPlanManagement;
