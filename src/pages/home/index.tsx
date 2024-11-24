'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getDashboardFn, getLatestImportReceiptFn } from '@/api/services/dashboardApi';
import { DateRangePicker } from '@/components/date-range-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import Loading from '@/components/common/Loading';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [importReceipts, setImportReceipts] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to last 30 days
    to: new Date()
  });

  const fetchData = async () => {
    try {
      const [dashboardRes, importReceiptsRes] = await Promise.all([
        getDashboardFn(dateRange.from.toISOString(), dateRange.to.toISOString()),
        getLatestImportReceiptFn(dateRange.from.toISOString(), dateRange.to.toISOString())
      ]);
      setDashboardData(dashboardRes);
      setImportReceipts(importReceiptsRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading size="100" />{' '}
      </div>
    );
  }

  const totalProduction = dashboardData.numberOfProductStock;
  const totalMaterialStock = dashboardData.numberOfMaterialStock;

  // Helper function to get material data
  const getMaterialData = () => {
    return dashboardData.materialVariant.map((material: any) => ({
      name: material.name,
      value: material.quantity
    }));
  };

  // Helper function to get product data
  const getProductData = () => {
    return dashboardData.productVariant.map((product: any) => ({
      name: product.name,
      value: product.quantity
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b"></div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-4">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <Button onClick={fetchData}>Confirm</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TOTAL PRODUCTION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProduction} units</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RAW MATERIAL STOCK</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMaterialStock} units</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"> IMPORT MATERIAL QUALITY RATE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.materialQualityRate}%</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Raw Material Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  stock: {
                    label: 'Stock',
                    color: 'hsl(252, 76%, 54%)'
                  }
                }}
                className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={getMaterialData()}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(252, 76%, 54%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Production Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  production: {
                    label: 'Production',
                    color: 'hsl(142, 76%, 36%)'
                  }
                }}
                className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getProductData()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(142, 76%, 36%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Raw Material Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 grid-rows-3 gap-2 h-[300px]">
              {getMaterialData().map((material: any, i: number) => (
                <div
                  key={i}
                  className="rounded-lg p-2 text-white"
                  style={{
                    backgroundColor: `hsl(${(i * 40) % 360}, 70%, 60%)`,
                    gridRow: i < 2 ? 'span 2' : 'span 1'
                  }}>
                  <div className="font-medium">{material.name}</div>
                  <div className="text-sm opacity-80">{material.value} units</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Import Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Finished At</TableHead>
                  <TableHead>Warehouse Staff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>{receipt.code}</TableCell>
                    <TableCell>{receipt.status}</TableCell>
                    <TableCell>{receipt.type}</TableCell>
                    <TableCell>{new Date(receipt.startedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      {receipt.finishedAt ? new Date(receipt.finishedAt).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell>{`${receipt.warehouseStaff.account.firstName} ${receipt.warehouseStaff.account.lastName}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
