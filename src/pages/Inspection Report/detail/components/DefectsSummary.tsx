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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Defects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Defects Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Defect Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {defects.map((defect) => (
                <TableRow>
                  <TableCell className="font-medium">{defect.defectType}</TableCell>
                  <TableCell className="text-right">{defect.quantity}</TableCell>
                  <TableCell className="text-right">
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
