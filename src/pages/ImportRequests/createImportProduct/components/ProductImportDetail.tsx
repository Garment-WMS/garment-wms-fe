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
    selectedDetails: ProductionPlanDetail,
    selectedProductionBatch: ProductionBatch,
    form: UseFormReturn<z.infer<typeof formSchema>>;
    onSubmit: any
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
    form,
    selectedDetails,
    selectedProductionBatch,

    onSubmit
}:Props) => {

    const productSize =selectedDetails.productSize
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
                  src={selectedDetails.productSize.productVariant.image}
                  alt={selectedDetails.productSize.productVariant.name}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div>
                  <p className="font-medium">{selectedDetails.productSize.productVariant.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedDetails.productSize.name}</p>
                  <p className="text-sm text-muted-foreground">Size: {selectedDetails.productSize.size}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Width: {selectedDetails.productSize.width}m</p>
                <p>Height: {selectedDetails.productSize.height}m</p>
                <p>Length: {selectedDetails.productSize.length}m</p>
                <p>Weight: {selectedDetails.productSize.weight}kg</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Production Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Plan Code: {selectedDetails.code}</p>
                <p>Quantity: {selectedDetails.quantityToProduce} {selectedDetails.productSize.productVariant.product.productUom.uomCharacter}</p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Production Batch</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{selectedProductionBatch.name}</CardTitle>
                <Badge>{selectedProductionBatch.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>Batch ID: {selectedProductionBatch.id}</p>
                  <p>Quantity: {selectedProductionBatch.quantityToProduce} {selectedDetails.productSize.productVariant.product.productUom.uomCharacter}</p>
                  <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Import Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter a number"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                />
              </FormControl>

            </FormItem>
          )}
        />
      </form>
    </Form>
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