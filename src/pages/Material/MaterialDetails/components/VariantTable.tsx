import React, { useState } from 'react'
import { Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { MaterialPackage } from '@/types/MaterialTypes'
import { DataTable } from '@/components/ui/DataTable'
import { DetailsColumn } from './VariantColumn'
import VariantChart from './VariantChart'
type Props = {
  materialPackage: MaterialPackage[]
}


const VariantTable: React.FC<Props>= ({materialPackage}) => {
  return (
    <div className="  ">
      <DataTable columns={DetailsColumn} data={materialPackage}/>
      <div className="mt-8">
        {materialPackage && <VariantChart materialPackage={materialPackage} />}
      </div>
  </div>
  )
}

export default VariantTable