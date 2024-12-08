import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/switch';
import { Keyboard, ScanLine } from 'lucide-react';

interface BarcodeConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (barcode: string) => void;
  materialName: string;
  expectedBarcode: string;
}

export function BarcodeConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  materialName,
  expectedBarcode
}: BarcodeConfirmationDialogProps) {
  const [entryMode, setEntryMode] = useState<'manual' | 'scanner'>('manual');
  const [inputBarcode, setInputBarcode] = useState('');
  const [isReady, setIsReady] = useState(false);
  const scannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && entryMode === 'scanner' && scannerInputRef.current) {
      scannerInputRef.current.focus();
    }
  }, [isOpen, entryMode]);

  const handleConfirm = () => {
    if (inputBarcode === expectedBarcode) {
      onConfirm(inputBarcode);
      onClose();
    } else {
      alert('Scanned barcode does not match the material. Please try again.');
    }
    setInputBarcode('');
    setIsReady(false);
  };

  const handleScannerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const scannedValue = e.currentTarget.value;
      setInputBarcode(scannedValue);
      handleConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Material Barcode</DialogTitle>
          <DialogDescription>Scan or enter the barcode for {materialName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="entry-mode">Entry Mode</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="entry-mode">{entryMode === 'manual' ? 'Manual' : 'Scanner'}</Label>
              <Switch
                id="entry-mode"
                checked={entryMode === 'scanner'}
                onCheckedChange={(checked) => {
                  setEntryMode(checked ? 'scanner' : 'manual');
                  setIsReady(false);
                }}
              />
            </div>
          </div>
          {entryMode === 'manual' ? (
            <div className="grid gap-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={inputBarcode}
                onChange={(e) => setInputBarcode(e.target.value)}
                placeholder="Enter barcode"
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="scanner-input">Scan Barcode</Label>
              <div className="relative">
                <Input
                  id="scanner-input"
                  ref={scannerInputRef}
                  type="text"
                  className="pr-10"
                  onKeyDown={handleScannerInput}
                  placeholder="Ready to scan..."
                  readOnly
                />
                <ScanLine className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (entryMode === 'scanner') {
                setIsReady(true);
                if (scannerInputRef.current) {
                  scannerInputRef.current.focus();
                }
              } else {
                handleConfirm();
              }
            }}>
            {entryMode === 'scanner' ? (isReady ? 'Ready to Scan' : 'Activate Scanner') : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
