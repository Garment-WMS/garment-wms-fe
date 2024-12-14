import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import Barcode from 'react-barcode';
import { ProductReceipt } from '@/types/ProductType';
import { disposeProductFn } from '@/api/services/productApi';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DisposeDialogProps {
  receipt: ProductReceipt;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDisposeSuccess: () => void;
}

const DisposeProductDialog: React.FC<DisposeDialogProps> = ({
  receipt,
  isOpen,
  setIsOpen,
  onDisposeSuccess
}) => {
  const [disposeQuantity, setDisposeQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDispose = async () => {
    if (disposeQuantity <= 0 || disposeQuantity > receipt.remainQuantityByUom) {
      toast({
        title: 'Invalid quantity',
        description: 'Please enter a quantity that is smaller than the available quantity.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await disposeProductFn(receipt.id, disposeQuantity);
      toast({
        variant: 'success',
        title: 'Dispose Product successfully',
        description: `Successfully disposed ${disposeQuantity} units of product ${receipt.code}`
      });
      onDisposeSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error('Error disposing product:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while disposing the product. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dispose Product</DialogTitle>
          <DialogDescription>
            Enter the quantity to dispose for this product receipt.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Receipt Code:</Label>
            <div className="col-span-3 font-medium">{receipt.code}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Product:</Label>
            <div className="col-span-3">{receipt.productSize.name}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Barcode:</Label>
            <div className="col-span-3">
              <Barcode value={receipt.code} width={1} height={40} fontSize={12} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Available Quantity:</Label>
            <div className="col-span-3 font-medium">{receipt.remainQuantityByUom} units</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="disposeQuantity" className="text-right">
              Dispose Quantity:
            </Label>
            <Input
              id="disposeQuantity"
              type="number"
              value={disposeQuantity}
              onChange={(e) => setDisposeQuantity(Number(e.target.value))}
              className="col-span-3"
              min={0}
              max={receipt.remainQuantityByUom}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleDispose} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disposing...
              </>
            ) : (
              'Confirm Dispose'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisposeProductDialog;
