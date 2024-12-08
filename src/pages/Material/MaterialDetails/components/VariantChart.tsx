import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/Chart";
import { MaterialPackage } from '@/types/MaterialTypes';
import { calculatePercentage } from '@/helpers/calculatePercentage';
import { generateColors } from '@/helpers/generateColors';

type Props = {
  materialPackage: MaterialPackage[];
};


const VariantChart = ({ materialPackage = [] }: Props) => {
  // Filter out variants with no inventoryStock or quantity
  const data = materialPackage
    .map(variant => ({
      name: variant.name,
      value: variant?.inventoryStock?.quantityByPack || 0,
      internalRef: variant.code,  // or use variant.id if needed
    }));


  

  const COLORS = generateColors(data.length);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const config: ChartConfig = data.reduce((acc, item, index) => {
    acc[`chart${index + 1}`] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  if (data.length === 0 || total === 0) {
    return 
  }
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Material Variant Quantity Distribution</CardTitle>
        <CardDescription>Percentage of total quantity for each Material Variant</CardDescription>
      </CardHeader>
      <CardContent>
       
        <ChartContainer config={config} className=" w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            {/* <ChartTooltip  cursor={false} content={({ payload }) => {
                if (payload && payload.length) {
                  console.log('payload', payload);
                  const item = payload[0].payload;
                  const percentage = ((item.value / total) * 100).toFixed(2);
                  return (
                    <ChartTooltipContent>
                      <div className="bg-white p-2 shadow rounded">
                        <p className="font-bold">{item.name}</p>
                        <p>Internal Ref: {item.internalRef}</p>
                        <p>Quantity: {item.value}</p>
                        <p>Percentage: {percentage}%</p>
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }} /> */}
              <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
             
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-sm">{item.name}: {calculatePercentage(item.value, total)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VariantChart;
