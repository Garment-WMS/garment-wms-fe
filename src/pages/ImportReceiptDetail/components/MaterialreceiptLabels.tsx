'use client';

import { useRef } from 'react';
import Barcode from 'react-barcode';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface MaterialReceipt {
  id: string;
  code: string;
  quantityByPack: number;
  expireDate: string;
  materialPackage: {
    name: string;
    code: string;
  };
}

interface MaterialReceiptLabelsProps {
  materialReceipts: MaterialReceipt[];
}

export default function MaterialReceiptLabels({
  materialReceipts = []
}: MaterialReceiptLabelsProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintLabels = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print labels.');
      return;
    }

    printWindow.document.write('<html><head><title>Print Labels</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; }
      .label { margin-bottom: 2rem; text-align: center; page-break-inside: avoid; }
      h3 { font-weight: bold; margin-bottom: 0.5rem; }
      p { margin: 0.25rem 0; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();

    // Use a short delay to ensure the content is fully loaded before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div>
      <Button onClick={handlePrintLabels} className="mb-4">
        <Printer className="mr-2 h-4 w-4" />
        Print Labels
      </Button>
      <div ref={printRef} className="hidden">
        <div className="flex flex-col items-center">
          {materialReceipts.map((item) =>
            Array.from({ length: item.quantityByPack }).map((_, index) => (
              <div key={`${item.id}-${index}`} className="label">
                <h3>{item.materialPackage.name}</h3>
                <p>Material Code: {item.code}</p>
                <p>Code: {item.materialPackage.code}</p>
                <p>Expire Date: {new Date(item.expireDate).toLocaleDateString()}</p>
                <Barcode value={item.code} width={1.5} height={50} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
