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
import { MaterialReceipt } from '@/types/MaterialTypes';
import { disposeMaterialReceipt } from '@/api/services/materialApi';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DisposeDialogProps {
  receipt: MaterialReceipt;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDisposeSuccess: () => void;
}

const DisposeDialog: React.FC<DisposeDialogProps> = ({
  receipt,
  isOpen,
  setIsOpen,
  onDisposeSuccess
}) => {
  const [disposeQuantity, setDisposeQuantity] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDispose = async () => {
    if (disposeQuantity <= 0 || disposeQuantity > receipt.remainQuantityByPack) {
      toast({
        title: 'Invalid quantity',
        description: 'Please enter a quantity that smaller than available quantity.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await disposeMaterialReceipt('DISPOSED', note, receipt.id, disposeQuantity);
      toast({
        variant: 'success',
        title: 'Dispose Material successfully',
        description: `Successfully disposed ${disposeQuantity} rolls of receipt ${receipt.code}`
      });
      onDisposeSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error('Error disposing material:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while disposing the material. Please try again.',
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
          <DialogTitle>Dispose Receipt</DialogTitle>
          <DialogDescription>
            Enter the quantity to dispose and any additional notes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Receipt Code:</Label>
            <div className="col-span-3 font-medium">{receipt.code}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Material:</Label>
            <div className="col-span-3">{receipt.materialPackage.name}</div>
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Image:</Label>
            <div className="col-span-3">
              <img
                src={receipt.materialPackage.materialVariant.image || '/placeholder.svg'}
                alt={receipt.materialPackage.name}
                width={100}
                height={100}
                className="object-cover rounded-md"
              />
            </div>
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Barcode:</Label>
            <div className="col-span-3">
              <Barcode value={receipt.code} width={1} height={40} fontSize={12} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Available Quantity:</Label>
            <div className="col-span-3 font-medium">{receipt.remainQuantityByPack} rolls</div>
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
              max={receipt.remainQuantityByPack}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right">
              Note:
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="col-span-3"
              placeholder="Enter any additional notes here..."
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

export default DisposeDialog;
