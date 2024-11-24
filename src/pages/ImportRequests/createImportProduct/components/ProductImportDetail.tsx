import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Separator } from '@/components/ui/Seperator'
import { ProductionBatch } from '@/types/ProductionBatch'
import { ProductionPlanDetail } from '@/types/ProductionPlan'
import { zodResolver } from '@hookform/resolvers/zod'

import React from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

type Props = {
    selectedProductionBatch: ProductionBatch,
}
const formSchema = z.object({
    number: z
      .number({
        required_error: "Number is required",
        invalid_type_error: "Number must be a valid number",
      })
      .int("Number must be an integer")
      .positive("Number must be positive")
      .lte(10000, "Number must be less than or equal to 10000"),
  })
const ProductImportDetail = ({
    selectedProductionBatch,
}:Props) => {

  return (
    <>

<div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Plan Details</CardTitle>
          <CardDescription>Overview of the production plan and associated batch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Information</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={selectedProductionBatch?.productionPlanDetail?.productSize.productVariant.image}
                  alt={selectedProductionBatch?.productionPlanDetail?.productSize.productVariant.name}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div>
                  <p className="font-medium">{selectedProductionBatch?.productionPlanDetail?.productSize.productVariant.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedProductionBatch?.productionPlanDetail?.productSize.name}</p>
                  <p className="text-sm text-muted-foreground">Size: {selectedProductionBatch?.productionPlanDetail?.productSize.size}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Width: {selectedProductionBatch?.productionPlanDetail?.productSize.width}m</p>
                <p>Height: {selectedProductionBatch?.productionPlanDetail?.productSize.height}m</p>
                <p>Length: {selectedProductionBatch?.productionPlanDetail?.productSize.length}m</p>
                <p>Weight: {selectedProductionBatch?.productionPlanDetail?.productSize.weight}kg</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Production Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Plan Code: {selectedProductionBatch?.productionPlanDetail?.code}</p>
                <p>Quantity: {selectedProductionBatch?.productionPlanDetail?.quantityToProduce} {selectedProductionBatch?.productionPlanDetail?.productSize.productVariant.product.productUom.uomCharacter}</p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Production Batch</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{selectedProductionBatch.name}</CardTitle>
                <Badge className='w-fit'>{selectedProductionBatch.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>Batch ID: {selectedProductionBatch.code}</p>
                  <p className=' flex gap-2'>Quantity to import: 
                    <div className='font-semibold  text-green-400'>
                    {selectedProductionBatch.quantityToProduce} {selectedProductionBatch?.productionPlanDetail?.productSize.productVariant.product.productUom.uomCharacter}
                      </div>
                    
                    </p>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
    
    </>
    
  )
}

export default ProductImportDetail