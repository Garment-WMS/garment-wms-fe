'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Package, FileText, CheckCircle, UserCircle, Users, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { finishImportReceiptFn, importReceiptApi } from '@/api/ImportReceiptApi';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../ImportReceiptList/slice';
import { useToast } from '@/hooks/use-toast';
import { ImportReceipt } from '@/types/ImportReceipt';
import importReceiptSelector from '../ImportReceiptList/slice/selector';
import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/AlertDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import Barcode from 'react-barcode';
import MaterialReceiptLabels from './components/MaterialreceiptLabels';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const importReceipt: ImportReceipt = useSelector(importReceiptSelector.importReceipt);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const handleFinishImport = async () => {
    setShowLabelModal(true);
  };
  const handleConfirmFinishImport = async () => {
    setIsLoading(true);
    try {
      const res = await finishImportReceiptFn(id as string);
      if (res.status === 201) {
        toast({
          title: 'Import finished successfully',
          description: 'The import receipt has been marked as imported.'
        });
        setShowConfirmDialog(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Import finished unsuccessfully',
          description: 'The import receipt has not been marked as imported.'
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to finish import',
        description: 'There was a problem finishing the import process.'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Import Status</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold capitalize">{importReceipt?.status}</div>
                  <p className="text-xs text-muted-foreground">
                    {importReceipt?.status === 'IMPORTING'
                      ? 'Import in progress'
                      : 'Import completed'}
                  </p>
                </div>
                {importReceipt?.status === 'IMPORTING' && (
                  <Button onClick={handleFinishImport} disabled={isLoading}>
                    Add Label
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
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

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Receipt Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material Receipt Code</TableHead>
                      <TableHead>Material Code</TableHead>
                      <TableHead>Material Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Expire Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importReceipt?.materialReceipt.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.materialPackage.code}</TableCell>
                        <TableCell>{item.materialPackage.name}</TableCell>
                        <TableCell>{item.quantityByPack}</TableCell>
                        <TableCell>
                          {item.materialPackage.materialVariant.material.materialUom.uomCharacter}
                        </TableCell>
                        <TableCell>{new Date(item.expireDate).toLocaleDateString()}</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Dialog open={showLabelModal} onOpenChange={setShowLabelModal}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Material Labels</DialogTitle>
                <DialogDescription>
                  Review and print labels for each material in this import receipt.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-96">
                {/* <div className="w-full text-center text-xl font-bold">Material Barcode</div>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {importReceipt?.materialReceipt.map((item: any) => (
                    <div key={item.id} className="border p-4 rounded-md">
                      <h3 className="font-bold mb-2">{item.materialPackage.name}</h3>
                      <p>Code: {item.materialPackage.code}</p>
                      <div className="mt-2">
                        <Barcode value={item.materialPackage.code} width={1.5} height={50} />
                      </div>
                    </div>
                  ))}
                </div> */}
                <div className="w-full text-center text-xl font-bold">Material Receipt Barcode</div>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {importReceipt?.materialReceipt.map((item: any) => (
                    <div key={item.id} className="border p-4 rounded-md">
                      <h3 className="font-bold mb-2">{item.materialPackage.name}</h3>
                      <p> Material Code: {item.materialPackage.code}</p>
                      <p>
                        Quantity: {item.quantityByPack * item.materialPackage.uomPerPack}{' '}
                        {item.materialPackage.materialVariant.material.materialUom.uomCharacter}
                      </p>
                      <p>Expire Date: {new Date(item.expireDate).toLocaleDateString()}</p>
                      <div className="mt-2">
                        <Barcode value={item.code} width={1.5} height={50} />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <DialogFooter>
                <MaterialReceiptLabels materialReceipts={importReceipt?.materialReceipt} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default">Confirm Finish Import</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will finish the import process and mark all materials as
                        received in the warehouse.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleConfirmFinishImport}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
