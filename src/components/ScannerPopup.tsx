'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Barcode,
  Receipt,
  X,
  Keyboard,
  ScanLine,
  ExternalLink,
  Package,
  Calendar,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { IoIosQrScanner } from 'react-icons/io';
import { scannerSearchFn } from '@/api/services/scannerApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import EmptyScanner from '@/assets/images/empty_scanner.svg';

export default function ScannerPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [scanMode, setScanMode] = useState('product');
  const [entryMode, setEntryMode] = useState('manual');
  const [scannedData, setScannedData] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [scannedReceipt, setScannedReceipt] = useState<any>(null);
  const scannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && entryMode === 'scanner' && scannerInputRef.current) {
      scannerInputRef.current.focus();
    }
  }, [isOpen, entryMode]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();

    let valueToScan = entryMode === 'manual' ? manualInput : scannedData;
    if (!valueToScan) return;

    const mode = scanMode === 'product' ? 'material-product' : 'receipt';
    const res = await scannerSearchFn(mode, valueToScan);

    if (mode === 'material-product') {
      if (res.materialVariant == null && res.productVariant == null) {
        setIsEmpty(true);
        setScannedItem(null);
      } else if (res.materialVariant != null) {
        setIsEmpty(false);
        setScannedItem(res.materialVariant);
      } else {
        setScannedItem(res.productVariant);
        setIsEmpty(false);
      }
    } else {
      if (res.materialReceipt == null && res.productReceipt == null && res.importReceipt == null) {
        setIsEmpty(true);
        setScannedReceipt(null);
      } else if (res.materialReceipt != null) {
        setScannedItem(null);
        setIsEmpty(false);
        setScannedReceipt(res.materialReceipt);
      } else if (res.productReceipt != null) {
        setScannedItem(null);
        setScannedReceipt(res.productReceipt);
        setIsEmpty(false);
      } else {
        setScannedItem(null);
        setScannedReceipt(res.importReceipt);
        setIsEmpty(false);
      }
    }

    setManualInput('');
    setScannedData('');
    setIsReady(false);

    if (entryMode === 'scanner' && scannerInputRef.current) {
      scannerInputRef.current.value = '';
      scannerInputRef.current.focus();
    }
  };

  const handleScanButtonClick = () => {
    if (entryMode === 'scanner' && scannerInputRef.current) {
      scannerInputRef.current.focus();
      setIsReady(true);
    } else {
      handleScan({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleScannerInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const scannedValue = e.currentTarget.value;
      setScannedData(scannedValue);
      await handleScan(e as unknown as React.FormEvent);
    }
  };

  const renderScannedItemDetails = () => {
    if (!scannedItem) return null;

    const isProduct = 'productId' in scannedItem;
    const detailsLink = isProduct ? `/product-variant/${scannedItem.id}` : `/material-variant/${scannedItem.id}`;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{scannedItem.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{scannedItem.code}</Badge>
              <Badge variant="outline">{isProduct ? 'Product' : 'Material'}</Badge>
            </div>
            {scannedItem.image && (
              <img
                src={scannedItem.image}
                alt={scannedItem.name}
                className="w-full h-40 object-cover rounded-md"
              />
            )}
            {/* {scannedItem.materialAttribute && scannedItem.materialAttribute.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Attributes:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {scannedItem.materialAttribute.map((attr: any) => (
                    <Badge key={attr.id} variant="outline" className="justify-between">
                      <span>{attr.name}:</span>
                      <span className="font-semibold">{attr.value}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}
            <Button asChild className="w-full">
              <a href={detailsLink} target="_blank" rel="noopener noreferrer">
                View Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderScannedReceiptDetails = () => {
    if (!scannedReceipt) return null;

    const isMaterialReceipt = 'materialPackage' in scannedReceipt;
    const isProductReceipt = 'productSize' in scannedReceipt;
    const isImportReceipt = 'warehouseStaff' in scannedReceipt;
    
const redirectUrl = isMaterialReceipt
? `/material-variant/${scannedReceipt?.materialPackage?.materialVariantId}/receipt/${scannedReceipt.id}`
: isProductReceipt
? `/product-variant/${scannedReceipt?.productSize?.productVariantId}/receipt/${scannedReceipt.id}`
: isImportReceipt
? `/import-receipt/${scannedReceipt.id}`
: undefined;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {isMaterialReceipt
                ? 'Material Receipt'
                : isImportReceipt
                  ? 'Import Receipt'
                  : 'Product Receipt'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{scannedReceipt.code}</Badge>
              <Badge variant="outline">{scannedReceipt.status}</Badge>
            </div>

            {isMaterialReceipt && (
              <>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{scannedReceipt.materialPackage.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Expires: {new Date(scannedReceipt.expireDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <p>
                    Quantity: {scannedReceipt.quantityByPack}{' '}
                    {scannedReceipt.materialPackage.packUnit}
                  </p>
                  <p>
                    Remaining: {scannedReceipt.remainQuantityByPack}{' '}
                    {scannedReceipt.materialPackage.packUnit}
                  </p>
                </div>
              </>
            )}

{isProductReceipt && (
              <>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{scannedReceipt?.productSize?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Expires: {new Date(scannedReceipt?.expireDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <p>
                    Quantity: {scannedReceipt?.quantityByUom}{' '}
                    {scannedReceipt?.productSize?.productVariant?.product?.productUom?.uomCharacter}
                  </p>
                  <p>
                    Remaining: {scannedReceipt?.remainQuantityByUom}{' '}
                    {scannedReceipt?.productSize?.productVariant?.product?.productUom?.uomCharacter}
                  </p>
                </div>
              </>
            )}

            {isImportReceipt && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>Type: {scannedReceipt.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Started: {new Date(scannedReceipt.startedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <p>
                    Manager: {scannedReceipt.warehouseManager.account.firstName}{' '}
                    {scannedReceipt.warehouseManager.account.lastName}
                  </p>
                  <p>
                    Staff: {scannedReceipt.warehouseStaff.account.firstName}{' '}
                    {scannedReceipt.warehouseStaff.account.lastName}
                  </p>
                </div>
                {scannedReceipt.materialReceipt && scannedReceipt.materialReceipt.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Material Receipts:</h4>
                    <ul className="list-disc list-inside">
                      {scannedReceipt.materialReceipt.map((receipt: any) => (
                        <li key={receipt.id}>
                          {receipt.code} - Quantity: {receipt.quantityByPack}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            <Button asChild className="w-full">
              <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
                View Full Receipt
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const handleCloseDialog = () => {
    setScannedItem(null);
    setScannedReceipt(null);
    setIsOpen(false);
  }
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
                  onClick={handleCloseDialog}
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
                    <span>Product | Material</span>
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
                        scanMode === 'product'
                          ? 'Enter product/material code'
                          : 'Enter receipt number'
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

              {renderScannedItemDetails()}
              {renderScannedReceiptDetails()}
              {isEmpty && (
                <div className="flex flex-col justify-center w-full items-center">
                  <img src={EmptyScanner} className="w-80" alt="Empty Scanner" />
                  <h3 className="font-bold text-center ">
                    Sorry, could not find any item of that code, please try again!
                  </h3>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
