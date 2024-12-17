'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpIcon, Percent } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/Charts';
import {
  getDashboardFn,
  getLatestExportReceiptFn,
  getLatestImportReceiptFn
} from '@/api/services/dashboardApi';
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
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { PiShirtFoldedBold } from 'react-icons/pi';
import { GiCardboardBoxClosed } from 'react-icons/gi';
import { ResponsiveTreeMap, TreeMap } from '@nivo/treemap';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [importReceipts, setImportReceipts] = useState<any[]>([]);
  const [exportReceipts, setExportReceipts] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to last 30 days
    to: new Date()
  });

  const fetchData = async () => {
    try {
      const [dashboardRes, importReceiptsRes, exportReceiptRes] = await Promise.all([
        getDashboardFn(dateRange.from.toISOString(), dateRange.to.toISOString()),
        getLatestImportReceiptFn(dateRange.from.toISOString(), dateRange.to.toISOString()),
        getLatestExportReceiptFn(dateRange.from.toISOString(), dateRange.to.toISOString())
      ]);
      setExportReceipts(exportReceiptRes);
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

  const getMaterialData = () => {
    if (!dashboardData || !dashboardData.materialVariant) return null;

    const materials = dashboardData.materialVariant.map((material: any) => ({
      name: material.name,
      loc: material.quantity
    }));

    return {
      name: 'Raw Materials',
      children: materials
    };
  };
  // Helper function to get product data
  const getProductData = () => {
    if (!dashboardData || !dashboardData.productVariant) return null;

    const products = dashboardData.productVariant.map((product: any) => ({
      name: product.name,
      loc: product.quantity
    }));

    return {
      name: 'Products',
      children: products
    };
  };

  const formatStatus = (status: string) => {
    // List of known statuses and their proper capitalization
    const statusMap: { [key: string]: string } = {
      IMPORTED: 'Imported',
      CANCELLED: 'Cancelled',
      AWAIT_TO_EXPORT: 'Await To Export',
      AWAIT_TO_IMPORT: 'Await To Import',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      FAILED: 'Failed',
      PENDING: 'Pending',
      EXPORTED: 'Exported',
      EXPORTING: 'Exporting',
      IMPORTING: 'Importing'
      // Add more statuses here as needed
    };

    // If the status is in the map, return the mapped value
    if (statusMap[status]) {
      return statusMap[status];
    }

    return status;
    // Otherwise, replace underscores with spaces and capitalize each word
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
              <CardTitle className="text-sm font-medium flex justify-between w-full items-center">
                <h3>TOTAL PRODUCTION</h3>
                <PiShirtFoldedBold size={30} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProduction} units</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex justify-between w-full items-center">
                <h3>RAW MATERIAL STOCK</h3>
                <GiCardboardBoxClosed size={30} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMaterialStock} units</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex justify-between w-full items-center">
                <h3>IMPORT MATERIAL QUALITY RATE</h3>
                <Percent size={30} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.materialQualityRate}%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Raw Material Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center w-full">
            <div style={{ height: '750px' }}>
              <ResponsiveTreeMap
                data={getMaterialData()}
                label={(e) => e.id + ' (' + e.formattedValue + ')'}
                identity="name"
                value="loc"
                valueFormat=".02s"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                labelSkipSize={12}
                labelTextColor={{
                  from: 'color',
                  modifiers: [['darker', 1.2]]
                }}
                parentLabelPosition="left"
                parentLabelTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.1]]
                }}
                colors={{ scheme: 'paired' }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center w-full">
            <div style={{ height: '750px' }}>
              <ResponsiveTreeMap
                data={getProductData()}
                identity="name"
                value="loc"
                valueFormat=".02s"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                labelSkipSize={12}
                label={(e) => e.id + ' (' + e.formattedValue + ')'}
                labelTextColor={{
                  from: 'color',
                  modifiers: [['darker', 1.2]]
                }}
                parentLabelPosition="left"
                parentLabelTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.1]]
                }}
                colors={{ scheme: 'nivo' }}
              />
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
                  <TableHead>Managed By </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importReceipts.slice(0, 10).map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      <Link
                        to={`/import-receipt/${receipt.id}`}
                        className="text-blue-500 underline">
                        {receipt.code}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="w-[120px] flex items-center justify-center"
                        variant={
                          receipt.status == 'IMPORTED'
                            ? 'success'
                            : receipt.status == 'CANCELLED'
                              ? 'destructive'
                              : 'default'
                        }>
                        {formatStatus(receipt.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {' '}
                      <Badge variant={'outline'}>{receipt.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(receipt.startedAt).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Use 24-hour format
                      })}
                    </TableCell>
                    <TableCell>
                      {receipt.finishedAt
                        ? new Date(receipt.finishedAt).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false // Use 24-hour format
                          })
                        : 'Not yet'}
                    </TableCell>
                    <TableCell>
                      {receipt.warehouseStaff ? (
                        <div className="flex">
                          <Avatar className="mr-2">
                            <AvatarImage src={receipt?.warehouseStaff?.account?.avatarUrl} />
                            <AvatarFallback>
                              {' '}
                              {`${receipt?.warehouseStaff?.account?.firstName.slice(0, 1)} ${receipt?.warehouseStaff?.account?.lastName.slice(0, 1)}`}
                            </AvatarFallback>
                          </Avatar>
                          {`${receipt?.warehouseStaff?.account?.firstName} ${receipt?.warehouseStaff?.account?.lastName}`}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {receipt.warehouseManager ? (
                        <div className="flex">
                          <Avatar className="mr-2 w-10 h-10 rounded-full">
                            <AvatarImage src={receipt?.warehouseManager?.account?.avatarUrl} />
                            <AvatarFallback>
                              {' '}
                              {`${receipt?.warehouseManager?.account?.firstName.slice(0, 1)} ${receipt?.warehouseManager?.account?.lastName.slice(0, 1)}`}
                            </AvatarFallback>
                          </Avatar>
                          {`${receipt?.warehouseManager?.account?.firstName} ${receipt?.warehouseManager?.account?.lastName}`}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Export Receipts</CardTitle>
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
                  <TableHead>Finished at </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      <Link
                        to={`/export-receipt/${receipt.id}`}
                        className="text-blue-500 underline">
                        {receipt.code}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="w-[120px] flex items-center justify-center"
                        variant={
                          receipt.status == 'EXPORTED'
                            ? 'success'
                            : receipt.status == 'CANCELLED'
                              ? 'destructive'
                              : 'default'
                        }>
                        {formatStatus(receipt.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={'outline'}>{receipt.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(receipt.startedAt).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Use 24-hour format
                      })}
                    </TableCell>
                    <TableCell>
                      {receipt.finishedAt
                        ? new Date(receipt.finishedAt).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false // Use 24-hour format
                          })
                        : 'Not yet'}
                    </TableCell>
                    <TableCell>
                      {receipt.warehouseStaff ? (
                        <div className="flex">
                          <Avatar className="mr-2">
                            <AvatarImage src={receipt?.warehouseStaff?.account?.avatarUrl} />
                            <AvatarFallback>
                              {' '}
                              {`${receipt?.warehouseStaff?.account?.firstName.slice(0, 1)} ${receipt?.warehouseStaff?.account?.lastName.slice(0, 1)}`}
                            </AvatarFallback>
                          </Avatar>
                          {`${receipt?.warehouseStaff?.account?.firstName} ${receipt?.warehouseStaff?.account?.lastName}`}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {receipt.finishedAt
                        ? new Date(receipt.finishedAt).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false // Use 24-hour format
                          })
                        : 'Not yet'}
                    </TableCell>
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
