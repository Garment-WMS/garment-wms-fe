'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/Chart';
import { Package, FileText, CheckCircle, UserCircle, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { importReceiptApi } from '@/api/ImportReceiptApi';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../ImportReceiptList/slice';
import { useToast } from '@/hooks/use-toast';
import { ImportReceipt } from '@/types/ImportReceipt';
import importReceiptSelector from '../ImportReceiptList/slice/selector';
import Loading from '@/components/common/Loading';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const importReceipt: ImportReceipt = useSelector(importReceiptSelector.importReceipt);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading

      try {
        const res = await axios(importReceiptApi.getOne(id as string));
        if (res.status === 200) {
          const data = res.data.data;
          dispatch(actions.setImportReceipt(data));
        } else {
          setError('Something went wrong');
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.'
          });
        }
      } catch (error) {
        setError('Something went wrong');
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, dispatch]);
  return (
    <div className="container mx-auto p-4">
      {isLoading && importReceipt ? (
        // Show the loading component when `isLoading` is true
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="100" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 text-bluePrimary">
            Material Receipt {importReceipt?.code}
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
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
                <CardTitle className="text-sm font-medium">Receipt Status</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Completed</div>
                <p className="text-xs text-muted-foreground">All processes finished</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Import Receipt Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex items-center space-x-4 flex-col justify-center">
                    <Avatar className="w-[80px] h-[80px]">
                      <AvatarImage
                        src={'/placeholder.svg?height=100&width=100'}
                        alt="John Doe"
                        className="w-[80px] h-[80px]"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <p className="text-xl font-bold">John Doe</p>
                      <p className="text-md text-muted-foreground">Import Manager</p>
                      <p className="text-md text-muted-foreground">nguyenducbaodh3@gmail.com</p>
                      <p className="text-md text-muted-foreground">+84838631706</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Staff Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex items-center space-x-4 flex-col justify-center">
                    <Avatar className="w-[80px] h-[80px]">
                      <AvatarImage
                        src={
                          importReceipt?.warehouseStaff?.account?.avatarUrl as string | undefined
                        }
                        alt="John Doe"
                        className="w-[80px] h-[80px]"
                      />
                      <AvatarFallback>
                        {importReceipt?.warehouseStaff?.account?.lastName.slice(0, 1) +
                          importReceipt?.warehouseStaff?.account?.firstName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <p className="text-xl font-bold">
                        {importReceipt?.warehouseStaff?.account?.lastName +
                          ' ' +
                          importReceipt?.warehouseStaff?.account?.firstName}
                      </p>
                      <p className="text-md text-muted-foreground">Import Manager</p>
                      <p className="text-md text-muted-foreground">
                        {importReceipt?.warehouseManager?.account?.email}
                      </p>
                      <p className="text-md text-muted-foreground">
                        {importReceipt?.warehouseManager?.account?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Basic Information
                    </h3>
                    <div className="grid gap-2">
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
                      <p>
                        <strong>Provider:</strong> Cong Ty Vai A
                      </p>
                      <p>
                        <strong>Warehouse:</strong> Warehouse 1
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quality Check Results</CardTitle>
              </CardHeader>
              <CardContent className="w-full flex items-center justify-center">
                <ChartContainer
                  config={{
                    value: {
                      label: 'Percentage',
                      color: 'hsl(var(--chart-2))'
                    }
                  }}
                  className="h-[200px]">
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

          <div className="w-full flex items-center justify-center mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Received Materials</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ChartContainer
                  config={{
                    quantity: {
                      label: 'Quantity',
                      color: 'hsl(var(--chart-1))'
                    }
                  }}
                  className="h-[300px]">
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
        </>
      )}
    </div>
  );
}
