import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Material, MaterialPackage, MaterialVariant } from '@/types/MaterialTypes';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import PackageDetails from './PackageDetails';
import DataTable from '@/components/common/EditableTable/DataTable';
import { getMaterialVariantsColumn } from './MaterialPackageColumn';

type Props = {
  materialVariant: MaterialVariant;
  onSubmit: (data: FormData) => void;
};

const formSchema = z.object({
  materialName: z.string().min(1, "Material name is required"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),

});

type FormData = z.infer<typeof formSchema>;

const EditGeneral: React.FC<Props> = ({ materialVariant, onSubmit }) => {
    const [details, setDetails] = useState<MaterialPackage[]>(materialVariant.materialPackage);
    const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialName: materialVariant?.material?.name || "",
      unitOfMeasure: materialVariant?.material?.materialUom.name || "",

    },
  });
  const column = useMemo(() => getMaterialVariantsColumn({}), []);
  if (!materialVariant) {
    return (
      <p className="text-center text-lg text-gray-500">
        Material Variant data is unavailable.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="product-type" className="flex items-center">
          Material Code: {materialVariant?.code}
        </Label>
        <div className="flex items-center mt-2">
          <Label htmlFor="track-inventory" className="">
            Quantity: {materialVariant?.onHand} unit
          </Label>
        </div>
      </div>
        <FormField
          control={form.control}
          name="materialName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <FormField
          control={form.control}
          name="unitOfMeasure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit of measure</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Label htmlFor="product-type" className="flex items-center">
            Package Details
        </Label>
        <DataTable columns={column} isEdit={true} setDetails={setDetails} data={details}/>

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

export default EditGeneral;