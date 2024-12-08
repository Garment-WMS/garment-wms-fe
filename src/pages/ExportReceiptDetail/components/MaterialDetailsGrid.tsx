import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import Barcode from 'react-barcode';
import { Button } from '@/components/ui/button';
import { IoIosQrScanner } from 'react-icons/io';
import { BarcodeConfirmationDialog } from './BarcodeconfirmationDialog';

interface Material {
  id: string;
  name: string;
  barcode: string;
  imageUrl?: string;
  quantity: number;
  unit: string;
}

interface MaterialDetailsGridProps {
  materials: Material[];
  setConfirmedMaterials: any;
  confirmedMaterials: any;
}

export function MaterialDetailsGrid({
  materials,
  confirmedMaterials,
  setConfirmedMaterials
}: MaterialDetailsGridProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmMaterial = (barcode: string) => {
    setConfirmedMaterials((prev) => [...prev, barcode]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {materials.map((material) => (
        <Card key={material.id} className="w-64">
          <CardContent className="p-4">
            <div className="aspect-square relative mb-2">
              <img
                src={material.imageUrl || '/placeholder.svg?height=200&width=200'}
                alt={material.name}
                className="rounded-md object-cover w-full h-full"
              />
            </div>
            <h3 className="font-semibold mb-1">{material.name}</h3>
            <div className="w-full mb-2">
              <Barcode value={material.barcode} width={1} height={40} />
            </div>
            <div className="flex justify-between items-center mb-2">
              <Badge variant="secondary">
                {material.quantity} {material.unit}
              </Badge>
              {confirmedMaterials.includes(material.barcode) ? (
                <Badge variant="success">Confirmed</Badge>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedMaterial(material);
                    setIsDialogOpen(true);
                  }}
                  className="bg-transparent text-blue-500 p-1">
                  <IoIosQrScanner className="text-blue-500 opacity-100" size={24} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {selectedMaterial && (
        <BarcodeConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedMaterial(null);
          }}
          onConfirm={handleConfirmMaterial}
          materialName={selectedMaterial.name}
          expectedBarcode={selectedMaterial.barcode}
        />
      )}
    </div>
  );
}
