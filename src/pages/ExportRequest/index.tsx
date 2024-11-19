'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';

// Mock data
const productionBatches = [
  { id: 'PB001', name: 'Summer Collection 2024', quantity: 1000 },
  { id: 'PB002', name: 'Winter Essentials 2024', quantity: 800 },
  { id: 'PB003', name: 'Spring Fashion 2025', quantity: 1200 }
];

const products = [
  {
    id: 'P001',
    name: 'Gucci T-Shirt',
    defaultFormula: 'F001',
    formulas: [
      {
        id: 'F001',
        name: 'Standard Cotton',
        materials: [
          {
            id: 'M001',
            name: 'Cotton A',
            amount: 0.5,
            unit: 'kg',
            image: '/placeholder.svg?height=100&width=100'
          },
          {
            id: 'M002',
            name: 'Standard Button',
            amount: 10,
            unit: 'pcs',
            image: '/placeholder.svg?height=100&width=100'
          },
          {
            id: 'M003',
            name: 'Cotton Thread',
            amount: 100,
            unit: 'm',
            image: '/placeholder.svg?height=100&width=100'
          }
        ]
      },
      {
        id: 'F002',
        name: 'Luxury Blend',
        materials: [
          {
            id: 'M004',
            name: 'Organic Cotton',
            amount: 0.4,
            unit: 'kg',
            image: '/placeholder.svg?height=100&width=100'
          },
          {
            id: 'M005',
            name: 'Luxury Button',
            amount: 8,
            unit: 'pcs',
            image: '/placeholder.svg?height=100&width=100'
          },
          {
            id: 'M006',
            name: 'Silk Thread',
            amount: 80,
            unit: 'm',
            image: '/placeholder.svg?height=100&width=100'
          }
        ]
      }
    ]
  },
  {
    id: 'P002',
    name: 'Designer Jeans',
    defaultFormula: 'F003',
    formulas: [
      {
        id: 'F003',
        name: 'Classic Denim',
        materials: [
          {
            id: 'M007',
            name: 'Standard Denim',
            amount: 1.5,
            unit: 'm',
            image: '/placeholder.svg?height=100&width=100'
          },
          {
            id: 'M008',
            name: 'Metal Zipper',
            amount: 1,
            unit: 'pc',
            image: '/placeholder.svg?height=100&width=100'
          },
          {
            id: 'M009',
            name: 'Copper Rivets',
            amount: 8,
            unit: 'pcs',
            image: '/placeholder.svg?height=100&width=100'
          }
        ]
      },
      {
        id: 'F004',
        name: 'Stretch Comfort',
        materials: [
          {
            id: 'M010',
            name: 'Stretch Denim',
            amount: 1.4,
            unit: 'm',
            image: '/placeholder.svg?height=100&width=100'
          },
          {
            id: 'M011',
            name: 'Plastic Zipper',
            amount: 1,
            unit: 'pc',
            image: '/placeholder.svg?height=100&width=100'
          },
          {
            id: 'M012',
            name: 'Brass Rivets',
            amount: 8,
            unit: 'pcs',
            image: '/placeholder.svg?height=100&width=100'
          }
        ]
      }
    ]
  }
];

type Material = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  image: string;
};

type Formula = {
  id: string;
  name: string;
  materials: Material[];
};

type Product = {
  id: string;
  name: string;
  defaultFormula: string;
  formulas: Formula[];
};

export default function ExportMaterialPage() {
  const [selectedBatch, setSelectedBatch] = useState<string | undefined>();
  const [selectedFormulas, setSelectedFormulas] = useState<Record<string, string>>({});
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newMaterials, setNewMaterials] = useState<Material[]>([]);
  const [isCreatingFormula, setIsCreatingFormula] = useState(false);
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (selectedBatch) {
      const initialQuantities = products.reduce(
        (acc, product) => {
          acc[product.id] = Math.floor(getSelectedBatchQuantity() / products.length);
          return acc;
        },
        {} as Record<string, number>
      );
      setProductQuantities(initialQuantities);
    }
  }, [selectedBatch]);

  const handleFormulaSelect = (productId: string, formulaId: string) => {
    setSelectedFormulas((prev) => ({ ...prev, [productId]: formulaId }));
  };

  const getSelectedBatchQuantity = () => {
    const batch = productionBatches.find((b) => b.id === selectedBatch);
    return batch ? batch.quantity : 0;
  };

  const getTotalMaterials = () => {
    const totals: Record<string, { amount: number; unit: string }> = {};
    const batchQuantity = getSelectedBatchQuantity();

    const allProducts = [...products, ...customProducts];

    allProducts.forEach((product) => {
      const selectedFormulaId = selectedFormulas[product.id] || product.defaultFormula;
      const formula = product.formulas.find((f) => f.id === selectedFormulaId);
      if (formula) {
        formula.materials.forEach((material) => {
          const totalAmount = material.amount * (productQuantities[product.id] || 0);
          if (totals[material.name]) {
            totals[material.name].amount += totalAmount;
          } else {
            totals[material.name] = { amount: totalAmount, unit: material.unit };
          }
        });
      }
    });
    return totals;
  };

  const handleAddMaterial = () => {
    const newMaterial: Material = {
      id: `M${Date.now()}`,
      name: '',
      amount: 0,
      unit: '',
      image: '/placeholder.svg?height=100&width=100'
    };
    setNewMaterials([...newMaterials, newMaterial]);
  };

  const handleRemoveMaterial = (id: string) => {
    setNewMaterials(newMaterials.filter((m) => m.id !== id));
  };

  const handleMaterialChange = (id: string, field: keyof Material, value: string | number) => {
    setNewMaterials(newMaterials.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleCreateFormula = (productId: string) => {
    if (!newFormulaName || newMaterials.length === 0) {
      alert('Please fill in all fields and add at least one material.');
      return;
    }

    const newFormula: Formula = {
      id: `F${Date.now()}`,
      name: newFormulaName,
      materials: newMaterials
    };

    const updatedProducts = [...products, ...customProducts].map((p) =>
      p.id === productId ? { ...p, formulas: [...p.formulas, newFormula] } : p
    );

    setCustomProducts(updatedProducts.filter((p) => !products.some((op) => op.id === p.id)));
    setNewFormulaName('');
    setNewMaterials([]);
    setIsCreatingFormula(false);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Export Materials</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Production Batch</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a production batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Production Batches</SelectLabel>
                {productionBatches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name} (Quantity: {batch.quantity})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBatch && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Products in Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={productQuantities[product.id] || 0}
                        onChange={(e) =>
                          handleQuantityChange(product.id, parseInt(e.target.value, 10))
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(product.id, (productQuantities[product.id] || 0) + 1)
                        }>
                        +
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            Math.max(0, (productQuantities[product.id] || 0) - 1)
                          )
                        }
                        className="ml-2">
                        -
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedBatch && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Formulas for Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={products[0].id} className="w-full">
              <TabsList className="mb-4">
                {[...products, ...customProducts].map((product) => (
                  <TabsTrigger key={product.id} value={product.id}>
                    {product.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {[...products, ...customProducts].map((product) => (
                <TabsContent key={product.id} value={product.id}>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.formulas.map((formula) => (
                        <Card
                          key={formula.id}
                          className={`cursor-pointer transition-all ${selectedFormulas[product.id] === formula.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handleFormulaSelect(product.id, formula.id)}>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {formula.name}
                              {(selectedFormulas[product.id] === formula.id ||
                                (!selectedFormulas[product.id] &&
                                  product.defaultFormula === formula.id)) && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                              {formula.materials.map((material) => (
                                <div key={material.id} className="flex items-center space-x-2">
                                  <img
                                    src={material.image}
                                    alt={material.name}
                                    className="rounded-md h-[50px] w-[50px]"
                                  />
                                  <div>
                                    <p className="font-medium">{material.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {material.amount} {material.unit}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4" onClick={() => setIsCreatingFormula(true)}>
                          <Plus className="mr-2 h-4 w-4" /> Create Custom Formula
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Custom Formula</DialogTitle>
                          <DialogDescription>
                            Add a new custom formula for this product. Please ensure it's suitable
                            for manufacturing.
                          </DialogDescription>
                        </DialogHeader>
                        <Alert className="mb-4">
                          <AlertTitle>Warning</AlertTitle>
                          <AlertDescription>
                            Please ensure that your custom formula is suitable for manufacturing.
                            Incorrect formulas may lead to production issues.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="formula-name">Formula Name</Label>
                            <Input
                              id="formula-name"
                              value={newFormulaName}
                              onChange={(e) => setNewFormulaName(e.target.value)}
                              placeholder="Enter formula name"
                            />
                          </div>
                          <div>
                            <Label>Materials</Label>
                            {newMaterials.map((material, index) => (
                              <div key={material.id} className="flex items-center space-x-2 mt-2">
                                <Input
                                  value={material.name}
                                  onChange={(e) =>
                                    handleMaterialChange(material.id, 'name', e.target.value)
                                  }
                                  placeholder="Material name"
                                />
                                <Input
                                  type="number"
                                  value={material.amount}
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      material.id,
                                      'amount',
                                      parseFloat(e.target.value)
                                    )
                                  }
                                  placeholder="Amount"
                                />
                                <Input
                                  value={material.unit}
                                  onChange={(e) =>
                                    handleMaterialChange(material.id, 'unit', e.target.value)
                                  }
                                  placeholder="Unit"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveMaterial(material.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button onClick={handleAddMaterial} className="mt-2">
                              <Plus className="mr-2 h-4 w-4" /> Add Material
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleCreateFormula(product.id)}>
                            Create Custom Formula
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {selectedBatch && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Total Materials Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(getTotalMaterials()).map(([name, { amount, unit }]) => (
                <Badge key={name} variant="secondary" className="p-2 text-sm">
                  {name}: {amount.toFixed(2)} {unit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Create Material Request</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
