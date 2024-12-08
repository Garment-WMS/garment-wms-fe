import { Label } from '@/components/ui/Label';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { POChart } from './components/POChart';

type Props = {};

const PurchaseDashboard = (props: Props) => {
  return (
    <div className=" w-full gap-4 px-4 py-3 flex flex-col space-y-3 bg-white rounded-md">
      <Label className="text-2xl font-bold mt-2">Dashboard</Label>
      <main className="flex-1 p-4">
          <div className="grid gap-4 grid-cols-2 ">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total POs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PO Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,234,567</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Purchase Orders Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <POChart />
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
};

export default PurchaseDashboard;
