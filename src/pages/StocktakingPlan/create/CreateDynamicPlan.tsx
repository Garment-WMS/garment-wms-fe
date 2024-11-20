import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { format, set } from 'date-fns';

import { Label } from '@/components/ui/Label';

import { Textarea } from '@/components/ui/textarea';

import { MoveRight, Plus } from 'lucide-react';
import DayTimePicker from '@/components/common/DayTimePicker';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { getWarehouseStaff } from '@/api/services/userApi';
import { User } from '@/types/User';
import privateCall from '@/api/PrivateCaller';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { MaterialVariant } from '@/types/MaterialTypes';
import { useDebounce } from '@/hooks/useDebouce';
import SelectTasks from './components/SelectTasks';
import { useGetMaterial } from '@/hooks/useGetMaterial';
import { SelectStaff } from './components/SelectStaff';
import { ProductVariant } from '@/types/ProductType';
import { useGetProductVariants } from '@/hooks/useGetProductVariants';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import KanbanDisplayCard from './components/KanbanDisplayList/KanbanDisplayCard';
import { InventoryReportPlanToCreate, InventoryReportPlanDetailsProduct } from '@/types/InventoryReport';
import { inventoryReportPlanApi } from '@/api/services/inventoryReportPlanApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Props = {};
interface inventoryReportPlanDetais {
  warehouseStaffId: string;
  materialPackageId: string[];
}
export interface Assignment {
  staffId: string;
  materialSelectedVariants: MaterialVariant[];
  productSelectedVariants: ProductVariant[];
}
const CreateDynamicPlan = (props: Props) => {
  const [warehouseStaffList, setWarehouseStaffList] = useState<User[]>([]);
  const [choosenStaff, setChoosenStaff] = useState<User[]>([]);
  const [inventoryReportPlanDetais, setInventoryReportPlanDetails] = useState<any>({
    warehouseStaffId: '',
    materialPackageId: []
  });
  const [assignments, setAssignments] = useState<Assignment[]>([
    { staffId: '', materialSelectedVariants: [], productSelectedVariants: [] }
  ]);

  const navigate = useNavigate();

  // Function to add a new assignment
  const addAssignment = () => {
    setAssignments([
      ...assignments,
      { staffId: '', materialSelectedVariants: [], productSelectedVariants: [] }
    ]);
  };
  // Function to handle material and product selection for a specific assignment
  const handleMaterialSelection = (
    index: number,
    selectedVariants: MaterialVariant[],
    assignmentSelectedVariants: MaterialVariant[]
  ) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index].materialSelectedVariants = assignmentSelectedVariants;
    setMaterialSelectedVariants(selectedVariants);

    setAssignments(updatedAssignments);
  };

  const handleProductSelection = (
    index: number,
    selectedVariants: ProductVariant[],
    assignmentSelectedVariants: ProductVariant[]
  ) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index].productSelectedVariants = assignmentSelectedVariants;
    setProductSelectedVariants(selectedVariants);
    setAssignments(updatedAssignments);
  };

  const formSchema = z
    .object({
      title: z.string().min(1).max(255),
      note: z.string().optional(),
      from: z
        .date({
          required_error: 'Date is required'
        })
        .refine((date) => date > new Date(), {
          message: 'Start date must be after today'
        }),
      to: z.date({
        required_error: 'Date is required'
      })
    })
    .refine((data) => data.to >= data.from, {
      message: 'End date must be after or equal to the start date',
      path: ['to'] // Specifies the error path to be associated with the "to" field
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      note: '',
      from: undefined,
      to: undefined
    }
  });

  const [ItemsError, setItemsError] = useState<string>('');
  const [staffError, setStaffError] = useState<string>('');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let hasError = false;
    
    // Check for missing staff and items in each assignment
    assignments.forEach((assignment) => {
      if (!assignment.staffId) {
        setStaffError('Each assignment must have a staff member assigned.');
        hasError = true;
      }
      if (
        assignment.materialSelectedVariants.length === 0 &&
        assignment.productSelectedVariants.length === 0
      ) {
        setItemsError('Each assignment must have at least one material or product selected.');
        hasError = true;
      }
    });

    // Reset errors if no issues are found
    if (!hasError) {
      setStaffError('');
      setItemsError('');

      // Proceed with formatting values
       const formattedValues = {
        ...values,
        inventoryReportPlanType:"PARTIAL",
        from: values.from.toISOString(),
        to: values.to.toISOString(),
        inventoryReportPlanDetails: [
          ...assignments.flatMap((assignment) =>
            assignment.materialSelectedVariants.map((variant) => ({
              warehouseStaffId: assignment.staffId,
              materialVariantId: variant.id,
            }))
          ),
        
          ...assignments.flatMap((assignment) =>
            assignment.productSelectedVariants.flatMap((variant) =>({
              warehouseStaffId: assignment.staffId,
              productVariantId: variant.id,
            })
              
            )
          )
        ]
      };
      console.log(formattedValues);

      try {
        const res = await privateCall(inventoryReportPlanApi.createInventoryReportPlan(formattedValues));
        console.log('res',res);
        if(res.status=== 201){
          const { id } = res.data.data;
          console.log('id',id);
          toast({
            title: 'Success',
            description: 'Stocktaking plan created successfully.',
            variant: 'success',
          });
          navigate(`/stocktaking/plan/${id}`);
        }
      } catch (error: any) {

          toast({
            title: 'Error',
            description: error.response?.data?.message || error.message,
            variant: 'destructive',
          });
        
      }
      
    }

    
  }

  const removeAssignment = (index: number, assignment: Assignment) => {
    const staffIdToRemove = assignment.staffId;
    const materialsToRemove = assignment.materialSelectedVariants.map((variant) => variant.id);
    const productsToRemove = assignment.productSelectedVariants.map((variant) => variant.id);
    
    const updatedMaterialVariants = materialSelectedVariants.filter(
      (variant) => !materialsToRemove.includes(variant.id)
    );
    const updatedProductVariants = productSelectedVariants.filter(
      (variant) => !productsToRemove.includes(variant.id)
    );
    const updatedStaffList = choosenStaff.filter((staff) => staff.id !== staffIdToRemove);
    const updatedAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(updatedAssignments);
    setMaterialSelectedVariants(updatedMaterialVariants);
    setChoosenStaff(updatedStaffList);
    setProductSelectedVariants(updatedProductVariants);
  };

  const [materialSelectedVariants, setMaterialSelectedVariants] = useState<MaterialVariant[]>([]);
  // sorting state of the table
  const [materialSorting, setMaterialSorting] = useState<SortingState>([]);
  // column filters state of the table
  const [materialColumnFilters, setMaterialColumnFilters] = useState<ColumnFiltersState>([]);

  const debouncedColumnFilters: ColumnFiltersState = useDebounce(materialColumnFilters, 1000);

  const debouncedSorting: SortingState = useDebounce(materialSorting, 1000);
  // pagination state of the table
  const [materialPagination, setMaterialPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10 //default page size
  });
  const {
    materialList,
    pageMeta: materialPageMeta,
    isLoading: materialIsLoading
  } = useGetMaterial({
    sorting: debouncedSorting,
    columnFilters: debouncedColumnFilters,
    pagination: materialPagination
  });
  const materialData = materialList &&
    materialPageMeta && {
      data: materialList,
      limit: materialPageMeta?.limit || 0,
      page: materialPageMeta?.page || 0,
      total: materialPageMeta?.total || 0,
      totalFiltered: materialPageMeta?.total || 0
    };

  const [productSelectedVariants, setProductSelectedVariants] = useState<ProductVariant[]>([]);
  // sorting state of the table
  const [productSorting, setProductSorting] = useState<SortingState>([]);
  // column filters state of the table
  const [productColumnFilters, setProductColumnFilters] = useState<ColumnFiltersState>([]);

  const productDebouncedColumnFilters: ColumnFiltersState = useDebounce(productColumnFilters, 1000);

  const productDebouncedSorting: SortingState = useDebounce(productSorting, 1000);
  // pagination state of the table
  const [productPagination, setProductPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10 //default page size
  });
  const {
    productList,
    pageMeta: productPageMeta,
    isLoading: productIsLoading
  } = useGetProductVariants({
    sorting: productDebouncedSorting,
    columnFilters: productDebouncedColumnFilters,
    pagination: materialPagination
  });
  const productData = productList &&
    productPageMeta && {
      data: productList,
      limit: productPageMeta?.limit || 0,
      page: productPageMeta?.page || 0,
      total: productPageMeta?.total || 0,
      totalFiltered: productPageMeta?.total || 0
    };
  const fetchWarehouseStaff = async (retries = 5) => {
    try {
      const res = await privateCall(getWarehouseStaff());
      setWarehouseStaffList(res.data.data);
    } catch (error) {
      if (retries > 1) {
        setTimeout(() => fetchWarehouseStaff(retries - 1), 1000); // Retry after a 1-second delay
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch warehouse staff after multiple attempts',
          variant: 'destructive'
        });
      }
    }
  };
  useEffect(() => {
    fetchWarehouseStaff();
  }, []);
  return (
    <div className="mx-auto p-4 bg-white shadow-sm border rounded-md">
      <Label className="text-xl font-primary font-bold">Planning partial stocktaking plan</Label>
      <div className="py-4">
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input className="w-1/2" placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title of the stocktaking plan. This will be displayed in the list of
                    stocktaking plans.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-6 items-center ">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date start</FormLabel>
                    <FormControl>
                      <DayTimePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      The date and time the stocktaking plan starts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <MoveRight color="grey" className="" />
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date end</FormLabel>
                    <FormControl className="mr-4">
                      <DayTimePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormDescription>The date and time the stocktaking plan end.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea className="w-1/2" placeholder="Enter note" {...field} />
                  </FormControl>
                  <FormDescription>
                    The note of the stocktaking plan. This will help staff understand the purpose of
                    the stocktaking plan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {assignments.map((assignment, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <Label>Assign #{index + 1} </Label>
                  {index > 0 && (
                    <Button
                      type="button"
                      size={null}
                      onClick={() => removeAssignment(index, assignment)}
                      variant="outline"
                      className=" text-white font-bold h-6 w-6 flex justify-center items-center  bg-red-500 rounded-full">
                      -
                    </Button>
                  )}
                </div>
                <SelectStaff
                  error={staffError}
                  chosenStaff={choosenStaff}
                  setChosenStaff={setChoosenStaff}
                  assignment={assignment}
                  staffList={warehouseStaffList}
                />

                <SelectTasks
                  assignments={assignments[index]}
                  error={ItemsError}
                  isMaterialLoading={materialIsLoading}
                  dataMaterial={materialData}
                  materialPagination={materialPagination}
                  materialSort={materialSorting}
                  setMaterialSort={setMaterialSorting}
                  setMaterialPagination={setMaterialPagination}
                  materialColumnFilters={materialColumnFilters}
                  setMaterialColumnFilters={setMaterialColumnFilters}
                  selectMaterialVariants={materialSelectedVariants}
                  onSelectMaterialVariants={(selectedVariants, assignmentVariant) =>
                    handleMaterialSelection(index, selectedVariants, assignmentVariant)
                  }
                  isProductLoading={productIsLoading}
                  dataProduct={productData}
                  productPagination={productPagination}
                  productSort={productSorting}
                  setProductSort={setProductSorting}
                  setProductPagination={setProductPagination}
                  productColumnFilters={productColumnFilters}
                  setProductColumnFilters={setProductColumnFilters}
                  selectProductVariants={productSelectedVariants}
                  onSelectProductVariants={(selectedVariants, assignmentVariant) =>
                    handleProductSelection(index, selectedVariants, assignmentVariant)
                  }
                />

                <div className="flex flex-col w-[60%] gap-4">
                  {assignment.materialSelectedVariants.length > 0 && (
                    <div>
                      <Label className="text-sm">Material Variants</Label>
                      <ScrollArea className="w-full mt-4 pr-4">
                        <div className="flex w-max gap-4">
                          {assignment.materialSelectedVariants.map((variant) => (
                            <KanbanDisplayCard
                              key={variant.id}
                              product={variant}
                              isChoosen={false}
                            />
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  )}
                  {assignment.productSelectedVariants.length > 0 && (
                    <div>
                      <Label className="text-sm">Product Variants</Label>
                      <ScrollArea className="mt-4 pr-4">
                        <div className="flex w-max gap-4">
                          {assignment.productSelectedVariants.map((variant) => (
                            <KanbanDisplayCard
                              key={variant.id}
                              product={variant}
                              isChoosen={false}
                            />
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addAssignment}
              variant="outline"
              className="flex items-center gap-2 text-green-500">
              <Plus className="font-bold w-4 h-4 text-green-500" /> Add Assignment
            </Button>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateDynamicPlan;
