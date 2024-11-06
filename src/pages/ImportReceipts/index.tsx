'use client';

import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/Chart';
import { Package, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const chartData = [
  { name: 'Red Button Box', quantity: 1500 },
  { name: 'Blue Switch', quantity: 2000 },
  { name: 'Green LED', quantity: 3000 },
  { name: 'Black Casing', quantity: 1000 },
  { name: 'White Cable', quantity: 5000 }
];

const qualityData = [
  { name: 'Passed', value: 95 },
  { name: 'Minor Issues', value: 4 },
  { name: 'Failed', value: 1 }
];

export default function MaterialReceipt() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-bluePrimary">Material Receipt #MR-456</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Received</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,500</div>
            <p className="text-xs text-muted-foreground">+2% from last receipt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last receipt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">All required documents received</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p>
                  <strong>Import Request:</strong>{' '}
                  <Link to="/" className="text-primary underline underline-offset-2">
                    IR-000123
                  </Link>
                </p>
                <p>
                  <strong>Purchase Order:</strong>{' '}
                  <Link to="/" className="text-primary underline underline-offset-2">
                    PO-000001
                  </Link>
                </p>
                <p>
                  <strong>Receipt Date:</strong> 11/25/2024
                </p>
              </div>
              <div>
                <p>
                  <strong>Supplier:</strong> Cong Ty Vai A
                </p>
                <p>
                  <strong>Warehouse:</strong> Warehouse 1
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Completed
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Received Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                quantity: {
                  label: 'Quantity',
                  color: 'hsl(var(--chart-1))'
                }
              }}
              className="h-[100%]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quantity" fill="var(--color-quantity)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Check Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: 'Percentage',
                  color: 'hsl(var(--chart-2))'
                }
              }}
              className="h-[100%]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Material Receipt Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Material Code
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Material Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity Received
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Storage Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">RBB150</td>
                    <td className="px-6 py-4">Red Button Box</td>
                    <td className="px-6 py-4">1500</td>
                    <td className="px-6 py-4">PCS</td>
                    <td className="px-6 py-4">Aisle A, Rack 3, Shelf 2</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">BS200</td>
                    <td className="px-6 py-4">Blue Switch</td>
                    <td className="px-6 py-4">2000</td>
                    <td className="px-6 py-4">PCS</td>
                    <td className="px-6 py-4">Aisle B, Rack 1, Shelf 1</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">GL300</td>
                    <td className="px-6 py-4">Green LED</td>
                    <td className="px-6 py-4">3000</td>
                    <td className="px-6 py-4">PCS</td>
                    <td className="px-6 py-4">Aisle C, Rack 2, Shelf 3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
