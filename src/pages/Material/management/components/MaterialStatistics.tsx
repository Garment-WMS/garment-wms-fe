import { Label } from '@/components/ui/Label'
import React from 'react'
import { TypeChart } from './TypeChart'
import { Material } from '@/types/MaterialTypes'

type Props = {
    materialTypeList: Material[]
}

const MaterialStatistics: React.FC<Props>= ({
    materialTypeList
}) => {
  return (
    <div className='w-full  bg-white rounded-xl shadow-sm border p-4'> 
        <div className='mb-4'>
        <Label className="text-2xl">Material Statistics</Label>
      </div>
      <div className='p-4'>
        <TypeChart materialTypeList={materialTypeList}/>
      </div>
        
    </div>
  )
}

export default MaterialStatistics