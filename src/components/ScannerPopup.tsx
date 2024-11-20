'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Barcode, Receipt, X, Keyboard, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { IoIosQrScanner } from 'react-icons/io';

export default function ScannerPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [scanMode, setScanMode] = useState('product');
  const [entryMode, setEntryMode] = useState('manual');
  const [scannedData, setScannedData] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isReady, setIsReady] = useState(false); // New state to track readiness
  const scannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && entryMode === 'scanner' && scannerInputRef.current) {
      scannerInputRef.current.focus();
    }
  }, [isOpen, entryMode]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToProcess = entryMode === 'manual' ? manualInput : scannedData;

    console.log('Processing:', dataToProcess);

    setTimeout(() => {
      console.log('Scanned Data:', scannedData);
    }, 1500);

    if (entryMode === 'scanner' && scannerInputRef.current) {
      scannerInputRef.current.value = ''; // Clear the input for next scan
      scannerInputRef.current.focus(); // Refocus after scan
    }
  };

  const handleScanButtonClick = () => {
    if (entryMode === 'scanner' && scannerInputRef.current) {
      scannerInputRef.current.focus();
      setIsReady(true); // Set button as "ready" state
    } else {
      handleScan({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleScannerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const scannedValue = e.currentTarget.value;
      console.log('Scanned value:', scannedValue);
      setScannedData(scannedValue);
      handleScan(e);
      setIsReady(false); // Reset readiness after scanning
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => setIsOpen(true)} className="bg-transparent text-blue-500">
        <IoIosQrScanner className="text-blue-500 opacity-100" size={32} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600">Barcode Scanner</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-black">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <RadioGroup
                defaultValue="product"
                className="flex space-x-4 mb-6"
                onValueChange={setScanMode}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="product" id="product" className="text-blue-500" />
                  <Label htmlFor="product" className="text-blue-500 flex items-center space-x-1">
                    <Barcode className="h-4 w-4" />
                    <span>Product</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="receipt" id="receipt" className="text-blue-500" />
                  <Label htmlFor="receipt" className="text-blue-500 flex items-center space-x-1">
                    <Receipt className="h-4 w-4" />
                    <span>Receipt</span>
                  </Label>
                </div>
              </RadioGroup>

              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="entry-mode" className="text-blue-500">
                  Entry Mode
                </Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="entry-mode" className="text-blue-500">
                    {entryMode === 'manual' ? 'Manual' : 'Scanner'}
                  </Label>
                  <Switch
                    id="entry-mode"
                    checked={entryMode === 'scanner'}
                    onCheckedChange={(checked) => setEntryMode(checked ? 'scanner' : 'manual')}
                  />
                </div>
              </div>

              <form onSubmit={handleScan} className="space-y-4">
                {entryMode === 'manual' ? (
                  <div className="relative">
                    <Input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder={
                        scanMode === 'product' ? 'Enter product code' : 'Enter receipt number'
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white text-blue-500 border-blue-500 focus:border-blue-600 rounded-lg"
                    />
                    <Keyboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      ref={scannerInputRef}
                      type="text"
                      className="w-full pl-10 pr-4 py-2 bg-white text-blue-500 border-blue-500 focus:border-blue-600 rounded-lg opacity-0"
                      onKeyDown={handleScannerInput}
                      aria-label={`Scan ${scanMode === 'product' ? 'product barcode' : 'receipt'}`}
                    />
                  </div>
                )}
                <Button
                  type="button"
                  onClick={handleScanButtonClick}
                  className={`w-full ${isReady ? 'bg-green-600' : 'bg-blue-600'} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}>
                  {entryMode === 'manual'
                    ? 'Process'
                    : isReady
                      ? 'Ready to Scan'
                      : 'Activate Scanner'}
                </Button>
              </form>

              {scannedData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-800 rounded-lg text-blue-300 text-center">
                  {scannedData}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
