'use client';

import { useRef } from 'react';
import Barcode from 'react-barcode';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface ProductReceipt {
  id: string;
  code: string;
  quantityByUom: number;
  productSize: {
    name: string;
    code: string;
    size: string;
  };
  productVariant: {
    product: {
      productUom: {
        uomCharacter: string;
      };
    };
  };
}

interface ProductReceiptLabelProps {
  productReceipts: ProductReceipt[];
}

export default function ProductReceiptLabel({ productReceipts = [] }: ProductReceiptLabelProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintLabels = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print labels.');
      return;
    }

    printWindow.document.write('<html><head><title>Print Product Labels</title>');
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
          {productReceipts.map((item) =>
            Array.from({ length: item.quantityByUom }).map((_, index) => (
              <div key={`${item.id}-${index}`} className="label">
                <h3>{item.productSize.name}</h3>
                <p>Size: {item.productSize.size}</p>
                <p>Product Code: {item.productSize.code}</p>
                <Barcode value={item.productSize.code} width={1.5} height={50} />
                <p>Receipt Code: {item.code}</p>
                <Barcode value={item.code} width={1.5} height={50} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
