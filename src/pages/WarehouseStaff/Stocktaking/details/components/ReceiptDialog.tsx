import React, { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/Dialog';
import { DetailsToApproveChange } from '..';
import { formatDateTimeToDDMMYYYYHHMM } from '@/helpers/convertDate';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { badgeVariants } from '@/components/ui/Badge';
type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  result: any;
  approvedDetails: DetailsToApproveChange;
  setApprovedDetails: Dispatch<SetStateAction<DetailsToApproveChange>>;
};

const ReceiptDialog = ({ open, setOpen, result, approvedDetails, setApprovedDetails }: Props) => {
    const [error,setError] = React.useState(false);
    const handleChange = (value: number | null) => {
        result.actualQuantity = value;
    }
    

    const handleSave = () => {
        setApprovedDetails((prev) => {
          const updatedDetails = prev.details.map((detail) =>
            detail.inventoryReportDetailId === result.id
              ? { ...detail, actualQuantity: result.actualQuantity }
              : detail
          );
          return { details: updatedDetails };
        });
        setOpen(false);
      };
  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{result?.materialReceipt ? "Material Receipt Details" : "Product Receipt Details"}</DialogTitle>{' '}
          <DialogDescription>This show the receipt details</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium col-span-2">Code:</span>
          <span className="col-span-2 font-bold text-slate-500">{result?.materialReceipt?.code || result?.productReceipt?.code}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium col-span-2">Expire Date:</span>
          <span className="col-span-2 text-slate-500">
            {formatDateTimeToDDMMYYYYHHMM(result?.materialReceipt?.expireDate || result?.productReceipt?.expireDate) || 'N/A'}
          </span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium col-span-2">Import Date:</span>
          <span className="col-span-2 text-slate-500">
            {formatDateTimeToDDMMYYYYHHMM(result?.materialReceipt?.importDate || result?.productReceipt?.importDate)}
          </span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium col-span-2">Quantity By Pack:</span>
          <span className="col-span-2 text-slate-500">{result?.expectedQuantity}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium col-span-2">Actual Quantity:</span>
          <span className="col-span-2 text-slate-500">
           {result?.actualQuantity ? (result?.actualQuantity) : (
             <Input
             type="number"
             className="w-20"
             value={result?.actualQuantity}
             min={0} // Set minimum value to 0
             max={99999}
             onWheel={(e) => e.currentTarget.blur()} // Prevent scrolling from changing the value
             onChange={(e) => {
               const inputValue = e.target.value;

               // If the input is cleared, handle it as empty
               if (inputValue === '') {
                 handleChange( null); // Use `null` to indicate cleared input
               } else {
                   handleChange( +inputValue); // Parse the value as a number
               }
             }}
             onKeyDown={(e) => {
               // Prevent typing `-` or `e` in the input
               if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                 e.preventDefault();
               }
             }}
           />
           )}
            <div>

            </div>
          </span>
        </div>
        {result?.managerQuantityConfirm && (
            <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium col-span-2">Manager confirm quantity:</span>
            <span className="col-span-2 text-slate-500">{result?.managerQuantityConfirm}</span>
          </div>
        )}
        {/* <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium col-span-2">Status:</span>
          <span className="col-span-2 text-slate-500">{result?.materialReceipt?.status}</span>
        </div> */}
        <DialogFooter>
            {!result?.actualQuantity &&(
                <div className='flex justify-end items-center gap-2'>
            <Button onClick={()=>{setOpen(false)}} className={badgeVariants({ variant: 'secondary', className: 'w-12' })}>Cancel</Button>
            <Button onClick={handleSave} className={badgeVariants({ variant: 'success', className: 'w-12' })}>Save</Button>
        </div>
            )}
        
      </DialogFooter>
      </DialogContent>
      
    </Dialog>
  );
};

export default ReceiptDialog;
