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

interface Defect {
  defectType: string;
  quantity: number;
}

interface DefectsSummaryProps {
  defects: Defect[];
}

const DefectsSummary: React.FC<DefectsSummaryProps> = ({ defects }) => {
  const totalDefects = defects.reduce((sum, defect) => sum + defect.quantity, 0);
  const chartData = defects.map((defect) => ({
    name: defect.defectType,
    value: defect.quantity
  }));

  // Define specific colors for each defect type
  const defectColors = {
    Tear: Colors.red[500],
    Stain: Colors.yellow[500],
    Misshaped: Colors.green[500],
    Ugly: Colors.blue[500]
  };

  return (
    <div className="space-y-6">
      {/* Defects Overview with Updated PieChartComponent */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bluePrimary font-bold">Defects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-76 flex justify-center items-center">
            <PieChartComponent
              data={chartData}
              colors={Object.values(defectColors)}
              width={350}
              height={290}
              innerRadius={90}
              outerRadius={130}
              labelType="value"
              showLegend={false}
              legendHeight={50}
            />
          </div>
        </CardContent>
      </Card>

      {/* Defects Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bluePrimary font-bold">Defects Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700 font-semibold">Defect Type</TableHead>
                <TableHead className="text-gray-700 font-semibold text-center">Quantity</TableHead>
                <TableHead className="text-gray-700 font-semibold text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {defects.map((defect, index) => (
                <TableRow key={index}>
                  <TableCell
                    className="font-medium"
                    style={{ color: defectColors[defect.defectType] || Colors.tertiaryTextColor }}>
                    {defect.defectType}
                  </TableCell>
                  <TableCell className="text-center text-gray-600 font-medium">
                    {defect.quantity}
                  </TableCell>
                  <TableCell className="text-right text-gray-600 font-medium">
                    {((defect.quantity / totalDefects) * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefectsSummary;
