import { Label } from '@/components/ui/Label';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { POChart } from './components/POChart';
import ProgressChart from '../Purchase Order/management/components/ProgressChart';
import { PurchaseOrderDashboard } from './components/PurchaseOrderDashboard';

type Props = {};

const PurchaseDashboard = (props: Props) => {
  return (
    <div className=" w-full gap-4 px-4 py-3 flex flex-col space-y-3 bg-white rounded-md">
      <Label className="text-2xl font-bold mt-2 text-bluePrimary">Dashboard</Label>
      <ProgressChart/>
      <PurchaseOrderDashboard/>
    </div>
  );
};

export default PurchaseDashboard;
