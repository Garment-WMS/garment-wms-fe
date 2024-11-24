import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PieChartComponent from '@/components/common/PieChart';
import Colors from '@/constants/color';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import EmptyDatacomponent from '@/components/common/EmptyData';

interface Defect {
  id: string;
  description: string;
  quantity: number;
}

interface DefectsSummaryProps {
  defects: Defect[];
}

const DefectsSummary: React.FC<DefectsSummaryProps> = ({ defects }) => {
  const totalDefects = defects.reduce((sum, defect) => sum + defect.quantity, 0);

  // Generate chart data
  const chartData = defects.map((defect) => ({
    name: defect.description,
    value: defect.quantity
  }));

  const colors = [
    Colors.red[500],
    Colors.green[500],
    Colors.blue[500],
    Colors.yellow[500],
    Colors.purple[500],
    Colors.orange[500]
  ];

  const defectColors = defects.map((defect, index) => ({
    id: defect.id,
    color: colors[index % colors.length]
  }));

  const getColorForDefect = (defectId: string) => {
    const foundColor = defectColors.find((item) => item.id === defectId);
    return foundColor ? foundColor.color : Colors.greyText;
  };

  // Check if all quantities are zero
  const isAllZero = chartData.every((data) => data.value === 0);

  return (
    <div className="space-y-6">
      {/* Pie Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>Defects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {!isAllZero ? (
            <PieChartComponent
              data={chartData}
              colors={colors}
              width={300}
              height={300}
              innerRadius={90}
              outerRadius={130}
              showLegend
            />
          ) : (
            <EmptyDatacomponent />
          )}
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Defects Details</CardTitle>
        </CardHeader>
        <CardContent>
          {defects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defects.map((defect) => (
                  <TableRow
                    key={defect.id}
                    className="hover:bg-gray-50 transition-colors duration-150">
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span
                              style={{
                                color: getColorForDefect(defect.id),
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}>
                              {defect.description.length > 20
                                ? `${defect.description.slice(0, 20)}...`
                                : defect.description}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{defect.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">{defect.quantity || 0}</TableCell>
                    <TableCell className="text-right">
                      {totalDefects > 0
                        ? `${Math.round((defect.quantity / totalDefects) * 100)}%`
                        : '0%'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyDatacomponent />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DefectsSummary;
