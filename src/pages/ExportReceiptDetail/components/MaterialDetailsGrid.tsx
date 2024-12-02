import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import Barcode from 'react-barcode';

interface Material {
  id: string;
  name: string;
  barcode: string;
  quantity: number;
  unit: string;
  imageUrl: string;
}

interface MaterialDetailsGridProps {
  materials: Material[];
}

export function MaterialDetailsGrid({ materials }: MaterialDetailsGridProps) {
  console.log(materials);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {materials.map((material) => (
        <Card key={material.id}>
          <CardContent className="p-4">
            <div className="aspect-square relative mb-2">
              <img
                src={material.imageUrl || '/placeholder.svg?height=200&width=200'}
                alt={material.name}
                className="rounded-md"
              />
            </div>
            <h3 className="font-semibold mb-1">{material.name}</h3>
            <div className="w-full">
              <Barcode value={material.barcode} width={1} />
            </div>
            {/* <p className="text-sm text-muted-foreground mb-2">Barcode: {material.barcode}</p> */}
            <div className="flex justify-between items-center">
              <Badge variant="secondary">
                {material.quantity} {material.unit}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
