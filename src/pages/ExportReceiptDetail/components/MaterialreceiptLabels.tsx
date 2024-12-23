'use client';

import { useRef } from 'react';
import Barcode from 'react-barcode';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface MaterialReceipt {}

interface MaterialReceiptLabelsProps {
  materialReceipts: any[];
}

export default function MaterialReceiptLabels({
  materialReceipts = []
}: MaterialReceiptLabelsProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintLabels = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;

    window.print();

    document.body.innerHTML = originalContents;
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
              <div key={`${item.id}-${index}`} className="mb-8 text-center">
                <h3 className="font-bold mb-2">{item.materialPackage.name}</h3>
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
