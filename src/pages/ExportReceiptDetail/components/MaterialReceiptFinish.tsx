import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/AlertDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Barcode from 'react-barcode';
import { toast } from '@/hooks/use-toast';

interface MaterialReceiptItem {
  id: string;
  code: string;
  materialPackage: {
    name: string;
    code: string;
  };
  quantityByPack: number;
  expireDate: string;
}

interface MaterialReceiptFinishProps {
  importReceiptId: string;
  materialReceipts: any[];
  onFinishImport: (type: string, id: string) => void;
}

export default function MaterialReceiptFinish({
  importReceiptId,
  materialReceipts,
  onFinishImport
}: MaterialReceiptFinishProps) {
  console.log(materialReceipts);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [scannedItems, setScannedItems] = useState<Set<string>>(new Set());
  const [currentScan, setCurrentScan] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleScan();
      } else {
        setCurrentScan((prev) => prev + event.key);
      }
    };

    if (showFinishDialog) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFinishDialog, currentScan]);

  const handleScan = () => {
    const scannedCode = currentScan.trim();
    if (materialReceipts.some((item) => item.code === scannedCode)) {
      setScannedItems((prev) => new Set(prev).add(scannedCode));
      toast({
        title: 'Item Scanned',
        description: `Successfully scanned item: ${scannedCode}`
      });
    } else {
      toast({
        title: 'Invalid Scan',
        description: 'This barcode does not match any items in the receipt.',
        variant: 'destructive'
      });
    }
    setCurrentScan('');
  };

  const handleFinishImport = () => {
    if (scannedItems.size === materialReceipts.length) {
      setShowConfirmDialog(true);
    } else {
      toast({
        title: 'Incomplete Scan',
        description: 'Please scan all items before finishing the import.',
        variant: 'destructive'
      });
    }
  };

  const confirmFinishImport = async () => {
    try {
      // Implement the API call to finish the import here
      // await finishImportReceiptFn(importReceiptId);
      onFinishImport();
      setShowFinishDialog(false);
      setShowConfirmDialog(false);
      toast({
        title: 'Import Finished',
        description: 'The import has been successfully completed.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to finish the import. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Button onClick={() => setShowFinishDialog(true)}>Finish Export</Button>

      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Finish Export - Scan Materials</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="grid grid-cols-2 gap-4 p-4">
              {materialReceipts?.map((item) => (
                <Card
                  key={item.id}
                  className={scannedItems.has(item.code) ? 'border-green-500' : ''}>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">{item.materialReceipt.materialPackage.name}</h3>
                    <p>
                      Quantity: {item.quantityByPack}{' '}
                      {item.materialReceipt.materialPackage.packUnit}{' '}
                    </p>
                    <div className="mt-2">
                      <Barcode value={item.materialReceipt.code} width={1.5} height={50} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={handleFinishImport}>
              Finish Export ({scannedItems.size}/{materialReceipts?.length} scanned)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Finish Export</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to finish the Export? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFinishImport}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
