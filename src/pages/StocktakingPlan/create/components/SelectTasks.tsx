import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MaterialVariant } from '@/types/MaterialTypes';
import { Search } from 'lucide-react';
import { useState } from 'react';
import KanbanList from './CompositeTableWithGrid';
import { CustomColumnDef } from '@/types/CompositeTable';
import KanbanDisplayCardWithDelete from './KanbanDisplayList/KanbanDisplayCardWithDelete';
import clothes from '@/assets/images/clothes-svgrepo-com.svg';
import silk from '@/assets/images/silk-svgrepo-com.svg';
import { ProductVariant } from '@/types/ProductType';
import { Assignment } from '..';
interface MaterialVariantSelectionDialogProps {
  assignments: Assignment;
  error: string;

  selectMaterialVariants: MaterialVariant[];
  onSelectMaterialVariants: (selectedVariants: MaterialVariant[], assignmentVariant: MaterialVariant[]) => void;
  isMaterialLoading: boolean;
  dataMaterial: any;
  materialPagination: any;
  materialSort: any;
  setMaterialSort: any;
  setMaterialPagination: any;
  materialColumnFilters: any;
  setMaterialColumnFilters: any;
  
  isProductLoading: boolean;
  dataProduct: any;
  productPagination: any;
  productSort: any;
  setProductSort: any;
  setProductPagination: any;
  productColumnFilters: any;
  setProductColumnFilters: any;
  selectProductVariants: ProductVariant[];
  onSelectProductVariants: (selectedVariants: ProductVariant[],assignmentVariant: ProductVariant[]) => void;
}
type DisplayState = 'material' | 'product';
const materialColumn: CustomColumnDef<MaterialVariant>[] = [
  {
    header: 'Material name',
    accessorKey: 'name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.name}</div>
        </div>
      );
    }
  }
];

const productColumn: CustomColumnDef<ProductVariant>[] = [
  {
    header: 'Product name',
    accessorKey: 'name',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.name}</div>
        </div>
      );
    }
  }
];
export default function SelectTasks({
  assignments,
  error,
  
  selectMaterialVariants,
  onSelectMaterialVariants,
  isMaterialLoading,
  dataMaterial,
  materialPagination,
  materialSort,
  setMaterialSort,
  setMaterialPagination,
  materialColumnFilters,
  setMaterialColumnFilters,

  isProductLoading,
  dataProduct,
  productPagination,
  productSort,
  setProductSort,
  setProductPagination,
  productColumnFilters,
  setProductColumnFilters,
  onSelectProductVariants,
  selectProductVariants

}: MaterialVariantSelectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState<DisplayState>('material');
  const handleDisplayChange = (display: DisplayState) => {
    setState(display);
  };
  const assignMaterial: MaterialVariant[] = assignments.materialSelectedVariants
  const assignProduct: ProductVariant[] = assignments.productSelectedVariants
  const handleSelectedMaterial = (item: MaterialVariant) => {
  const isAlreadySelected = selectMaterialVariants.some((variant) => variant.id === item.id);
  if (!isAlreadySelected) {
    const updatedVariants = [...selectMaterialVariants, item];
    const updatedAssignMaterial = [...assignMaterial, item];
    onSelectMaterialVariants(updatedVariants,updatedAssignMaterial);
  }
  }
  const handleDeleteMaterial = (id: string) => {
    const updatedVariants = selectMaterialVariants.filter((variant: MaterialVariant) => variant.id !== id);
    const updatedAssignMaterial = assignMaterial.filter((variant: MaterialVariant) => variant.id !== id);
    onSelectMaterialVariants(updatedVariants,updatedAssignMaterial);
  };
  const handleSelectedProduct = (item: ProductVariant) => {
    const isAlreadySelected = selectProductVariants.some((variant) => variant.id === item.id);

  if (!isAlreadySelected) {
    const updatedVariants = [...selectProductVariants, item];
    const updatedAssignProduct = [...assignProduct, item];
    onSelectProductVariants(updatedVariants,updatedAssignProduct); // Pass the updated list to the parent component
  }
  };
  const handleDeleteProduct = (id: string) => {
    const updatedVariants = selectProductVariants.filter((variant: ProductVariant) => variant.id !== id);
    const updatedAssignProduct = assignProduct.filter((variant: ProductVariant) => variant.id !== id);
    onSelectProductVariants(updatedVariants,updatedAssignProduct);
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='w-fit' variant="outline">Select Items</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px]">
        <DialogHeader></DialogHeader>
        <div className="flex gap-4 justify-between">
          <div className='flex flex-col w-[50%] gap-4'>
            <div className="">
            <Label className="text-xl">Select Material Variants</Label>
            <ScrollArea className=" mt-4 h-[250px] pr-4">
              <div className=" grid-cols-2 grid gap-4">
                {assignMaterial.length > 0 ? (
                  assignMaterial.map((variant: MaterialVariant) => (
                    <KanbanDisplayCardWithDelete
                      key={variant.id}
                      product={variant}
                      onDelete={() => handleDeleteMaterial(variant.id)}
                    />
                  ))
                ) : (
                  <div className="">
                    <p className="text-gray-500">Choose variant to plan</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="">
            <Label className="text-xl">Select Product Variants</Label>
            <ScrollArea className=" mt-4 h-[250px] pr-4">
              <div className=" grid-cols-2 grid gap-4">
                {assignProduct.length > 0 ? (
                  assignProduct.map((variant: ProductVariant) => (
                    <KanbanDisplayCardWithDelete
                      key={variant.id}
                      product={variant}
                      onDelete={() => handleDeleteProduct(variant.id)}
                    />
                  ))
                ) : (
                  <div className="">
                    <p className="text-gray-500">Choose variant to plan</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          </div>
          
          <div className='h-full'>
            <div className="flex mb-4 px-8 justify-end">
              <Button onClick={() => handleDisplayChange('material')} variant="outline" size="icon">
                <img className="h-7 w-5" src={silk} />
              </Button>
              <Button onClick={() => handleDisplayChange('product')} variant="outline" size="icon">
                <img className="h-7 w-7" src={clothes} />
              </Button>
            </div>
            {state === 'material' ? (
              <KanbanList
                selectedItems={selectMaterialVariants}
                isTableDataLoading={isMaterialLoading}
                paginatedTableData={dataMaterial}
                columns={materialColumn}
                pagination={materialPagination}
                sorting={materialSort}
                setSorting={setMaterialSort}
                setPagination={setMaterialPagination}
                columnFilters={materialColumnFilters}
                setColumnFilters={setMaterialColumnFilters}
                setSelectedItems={handleSelectedMaterial}
              />
            ) : (
              <KanbanList
                selectedItems={selectProductVariants}
                isTableDataLoading={isProductLoading}
                paginatedTableData={dataProduct}
                columns={productColumn}
                pagination={productPagination}
                sorting={productSort}
                setSorting={setProductSort}
                setPagination={setProductPagination}
                columnFilters={productColumnFilters}
                setColumnFilters={setProductColumnFilters}
                setSelectedItems={handleSelectedProduct}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    {
    error
    && assignments.materialSelectedVariants.length<=0 && assignments.productSelectedVariants.length<=0 
    && <p className="text-red-500 text-sm">{error}</p>
    }
    </>
    
  );
}
