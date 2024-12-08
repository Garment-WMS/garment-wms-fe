import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/Chart';
import { getImportStatistic } from '@/api/purchase-staff/importRequestApi';
import { Skeleton } from '@/components/ui/skeleton';

type StatisticPartProps = {
  title: string;
  content: string | number;
  isMoneyCurrency: boolean;
};

const StatisticPart: React.FC<StatisticPartProps> = ({ title, content, isMoneyCurrency }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isMoneyCurrency && '$'}
          {typeof content === 'number'
            ? content.toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Use 24-hour format
              })
            : content}
        </div>
      </CardContent>
    </Card>
  );
};

type ImportDetails = {
  total: number;
  arrived: number;
  cancelled: number;
  inspecting: number;
  inspected: number;
  approved: number;
  rejected: number;
};

type Props = {};

const AnalystSection: React.FC<Props> = () => {
  const [details, setDetails] = useState<ImportDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pieChart, setPieChart] = useState<any[]>([]); // Default to an empty array

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getImportStatistic();
        if (res.statusCode === 200) {
          setDetails(res.data);
          setPieChart([
            { name: 'Arrived', value: res.data.arrived },
            { name: 'Cancelled', value: res.data.cancelled },
            { name: 'Inspecting', value: res.data.inspecting },
            { name: 'Inspected', value: res.data.inspected },
            { name: 'Approved', value: res.data.approved },
            { name: 'Rejected', value: res.data.rejected }
          ]);
        } else {
          setError('Failed to fetch import statistics');
        }
      } catch (error) {
        console.error('Error fetching import statistics:', error);
        setError('An error occurred while fetching import statistics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !details) {
    return <div className="text-red-500">{error || 'No data available'}</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

  const config: any = {
    arrived: { label: 'Arrived', color: 'hsl(var(--chart-1))' },
    cancelled: { label: 'Cancelled', color: 'hsl(var(--chart-2))' },
    inspecting: { label: 'Inspecting', color: 'hsl(var(--chart-3))' },
    inspected: { label: 'Inspected', color: 'hsl(var(--chart-4))' },
    approved: { label: 'Approved', color: 'hsl(var(--chart-5))' },
    rejected: { label: 'Rejected', color: 'hsl(var(--chart-6))' }
  };

  return (
    <div className="space-y-8">
      <div className="w-full flex justify-center mt-8">
        <CardTitle>Import Status Distribution</CardTitle>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pieChart.length > 0 && (
          <ChartContainer config={config} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">
                  {pieChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {/* Display the value inside the Pie chart */}
                </Pie>
                <Tooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`${value}`, `${name}: ${value}`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
      {/* Render the custom legend below the pie chart in a grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4 ">
        {pieChart.map((entry, index) => (
          <div
            key={`legend-item-${index}`}
            className="flex items-center space-x-2 text-sm font-medium justify-center">
            <div
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              className="w-4 h-4 rounded-full"
            />
            <div>
              {entry.name}: {entry.value} {'request(s)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalystSection;
