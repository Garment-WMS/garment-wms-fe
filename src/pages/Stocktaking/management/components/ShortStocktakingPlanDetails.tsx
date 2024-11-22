import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/Label'
import React from 'react'

type Props = {}

const ShortStockingPlanDetails = (props: Props) => {
  return (
    <div>
        <Label className='text-xl'>Stocktaking Plan</Label>
        <div className='flex flex-col justify-center items-center pt-6 gap-4'>
          <div>No stocking plan</div>
          <Button>
            Create plan
          </Button>
        </div>
    </div>
  )
}

export default ShortStockingPlanDetails