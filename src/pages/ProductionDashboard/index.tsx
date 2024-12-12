import { Label } from '@/components/ui/Label'
import React from 'react'
import { ProductionPlanDashboard } from './components/ProductionPlanDashboard'

type Props = {}

const ProductionDashboard = (props: Props) => {
  return (
    <div className="space-y-4 bg-white p-4">
      <Label className="text-2xl font-bold">Dashboard</Label>
      <ProductionPlanDashboard/>
    </div>
  )
}

export default ProductionDashboard