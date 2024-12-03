import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { useGetInspectionRequestByType } from '@/hooks/useGetInspectionRequestByType';
import PieChartComponent from '@/components/common/PieChart';
import Colors from '@/constants/color';
import ChartSkeleton from '@/components/common/ChartSkeleton';
import { Package, Shirt } from 'lucide-react';
import EmptyDatacomponent from '@/components/common/EmptyData';

const InspectionRequestChart = () => {
  const { data: materialStats, isPending: isMaterialLoading } = useGetInspectionRequestByType(
    InspectionRequestType.MATERIAL
  );
  const { data: productStats, isPending: isProductLoading } = useGetInspectionRequestByType(
    InspectionRequestType.PRODUCT
  );
  const renderPieChart = (
    title: string,
    stats: any,
    isLoading: boolean,
    Icon: any,
    color: string
  ) => {
    const headerHeightClass = 'h-20'; // Ensures consistent header height

    if (isLoading) {
      return (
        <Card className="w-full max-w-4xl mx-auto pb-7 border-gray-200 shadow-md">
          <CardHeader
            className={`flex flex-row items-center justify-between bg-gray-100 px-5 py-4 rounded-t-lg ${headerHeightClass}`}>
            <div className="flex items-center space-x-3">
              <Icon className={`h-8 w-8 ${color}`} />
              <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
            </div>
          </CardHeader>
          <div className="flex justify-center items-center h-80">
            <ChartSkeleton />
          </div>
        </Card>
      );
    }

    const { total = 0, inspected = 0, inspecting = 0 } = stats?.data || {};
    const chartData = [
      { name: 'Inspected', value: inspected },
      { name: 'Inspecting', value: inspecting }
    ];

    if (total === 0 || (!inspected && !inspecting)) {
      return (
        <Card className="w-full max-w-4xl mx-auto pb-7 border-gray-200 shadow-md">
          <CardHeader
            className={`flex flex-row items-center justify-between bg-gray-100 px-5 py-4 rounded-t-lg ${headerHeightClass}`}>
            <div className="flex items-center space-x-3">
              <Icon className={`h-8 w-8 ${color}`} />
              <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
            </div>
          </CardHeader>
          <div className="flex justify-center items-center h-64">
            <EmptyDatacomponent />
          </div>
        </Card>
      );
    }

    return (
      <Card className="w-full max-w-4xl mx-auto pb-7 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader
          className={`flex flex-row items-center justify-between bg-gray-100 px-5 py-4 rounded-t-lg ${headerHeightClass}`}>
          <div className="flex items-center space-x-3">
            <Icon className={`h-8 w-8 ${color}`} />
            <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Total</span>
            <span className="ml-2 text-3xl font-bold text-blue-600">{total}</span>
          </div>
        </CardHeader>
        <div className="w-full py-5 flex justify-center">
          <PieChartComponent
            data={chartData}
            colors={[Colors.green[500], Colors.blue[500]]}
            width={250}
            height={300}
            innerRadius={50}
            outerRadius={118}
            labelType="value"
            showLegend={true}
            legendHeight={5}
          />
        </div>
      </Card>
    );
  };

  const isLoadingData = isMaterialLoading || isProductLoading;

  return (
    <section className="px-6 pt-6 pb-8 w-auto bg-white rounded-xl shadow-md border">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primaryLight">Inspection Request Summary</h1>
      </div>
      {isLoadingData ? (
        <div className="grid grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {renderPieChart('Material', materialStats, isMaterialLoading, Package, 'text-slate-500')}
          {renderPieChart('Product', productStats, isProductLoading, Shirt, 'text-slate-500')}
        </div>
      )}
    </section>
  );
};

export default InspectionRequestChart;
