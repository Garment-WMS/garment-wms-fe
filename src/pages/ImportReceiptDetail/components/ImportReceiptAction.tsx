import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, Printer, Download } from 'lucide-react';

import { WarehouseStaffGuardDiv } from '@/components/authentication/createRoleGuard';

import { ImportReceipt } from '@/types/ImportReceipt';
import { useSelector } from 'react-redux';
import importReceiptSelector from '@/pages/ImportReceiptList/slice/selector';
import { useEffect, useRef, useState } from 'react';

interface MaterialExportActionsProps {
  isLoading: boolean;
  handleFinishImporting: () => Promise<void>;
  handleFinishImport: () => Promise<void>;
}

export function ImportReceiptAction({
  isLoading,
  handleFinishImporting,
  handleFinishImport
}: MaterialExportActionsProps) {
  const importReceipt: ImportReceipt | null = useSelector(importReceiptSelector.importReceipt);
  const printContentRef = useRef<HTMLDivElement>(null);
  const [printContent, setPrintContent] = useState<string>('');

  useEffect(() => {
    if (printContentRef.current) {
      setPrintContent(printContentRef.current.innerHTML);
    }
  }, [importReceipt?.status]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Material Export Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .print-content { padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="print-content">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open the print window.');
    }
  };

  if (!importReceipt) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-bluePrimary">
          {importReceipt.type === 'MATERIAL' ? (
            <span>Material Import Receipt {importReceipt.code}</span>
          ) : (
            <span>Product Import Receipt {importReceipt.code}</span>
          )}
        </h1>

        <div className="space-x-2 flex justify-center items-center">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <WarehouseStaffGuardDiv>
            {importReceipt.status === 'IMPORTING' && (
              <Button onClick={handleFinishImport} disabled={isLoading}>
                Add Label
              </Button>
            )}
          </WarehouseStaffGuardDiv>
          <WarehouseStaffGuardDiv>
            {importReceipt.status === 'AWAIT_TO_IMPORT' && (
              <Button onClick={handleFinishImporting} disabled={isLoading}>
                Start Importing
              </Button>
            )}
          </WarehouseStaffGuardDiv>
        </div>
      </div>
    </Card>
  );
}
