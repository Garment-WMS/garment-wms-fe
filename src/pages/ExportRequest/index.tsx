'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, X, Save, ArrowRight, Beaker, Camera } from 'lucide-react';

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { Slider } from '@/components/ui/Slider';
import {
  getProductionBatchFn,
  getProductFormulaByProductionBatchFn
} from '@/api/services/productionBatchApi';
import { getAllMaterialNoArgumentFn } from '@/api/services/materialApi';

type MaterialVariant = {
  id: string;
  name: string;
  code: string;
  image: string;
  material: {
    name: string;
    materialUom: {
      name: string;
      uomCharacter: string;
    };
  };
};

type ProductFormulaMaterial = {
  id: string;
  quantityByUom: number;
  materialVariant: MaterialVariant;
};

type ProductFormula = {
  id: string;
  name: string;
  code: string;
  isBaseFormula: boolean;
  quantityRangeStart: number;
  quantityRangeEnd: number;
  productFormulaMaterial: ProductFormulaMaterial[];
};

type ProductionBatch = {
  id: string;
  name: string;
  quantityToProduce: number;
  status: string;
  productionPlanDetail: {
    productSize: {
      name: string;
      productVariant: {
        name: string;
      };
    };
  };
};

type Material = {
  id: string;
  name: string;
  materialUomId: string;
  code: string;
  numberOfMaterialVariants: number;
  image: string;
};
type NewFormulaMaterial = {
  materialId: string;
  quantity: number;
};
export default function ExportMaterialPage() {
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | undefined>();
  const [productFormulas, setProductFormulas] = useState<ProductFormula[]>([]);
  const [selectedFormula, setSelectedFormula] = useState<string | undefined>();
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newFormulaMaterials, setNewFormulaMaterials] = useState<NewFormulaMaterial[]>([]);
  const [isCreatingFormula, setIsCreatingFormula] = useState(false);
  const [newFormulaName, setNewFormulaName] = useState('');
  const [isSavingFormula, setIsSavingFormula] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showAddMaterialDialog, setShowAddMaterialDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [batchesResponse, materialsResponse] = await Promise.all([
          getProductionBatchFn(),
          getAllMaterialNoArgumentFn()
        ]);
        setProductionBatches(batchesResponse.data);
        setMaterials(materialsResponse.data.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      const fetchProductFormulas = async () => {
        try {
          setIsLoading(true);
          const response = await getProductFormulaByProductionBatchFn(selectedBatch);
          const batch = productionBatches.find((b) => b.id === selectedBatch);
          if (batch) {
            setProductQuantity(batch.quantityToProduce);
            // Filter suitable formulas
            const suitableFormulas = response.filter(
              (formula: any) =>
                batch.quantityToProduce >= formula.quantityRangeStart &&
                batch.quantityToProduce <= formula.quantityRangeEnd
            );
            // Simulate loading delay
            setTimeout(() => {
              setProductFormulas(suitableFormulas);
              setIsLoading(false);
            }, 1000);
          }
        } catch (err) {
          setError('Failed to fetch product formulas');
          console.error(err);
        }
      };

      fetchProductFormulas();
    }
  }, [selectedBatch, productionBatches]);

  const handleQuantityChange = (quantity: number) => {
    setProductQuantity(Math.max(0, quantity));
    // Automatically select the appropriate formula based on the new quantity
    const appropriateFormula = productFormulas.find(
      (formula) => quantity >= formula.quantityRangeStart && quantity <= formula.quantityRangeEnd
    );
    if (appropriateFormula) {
      setSelectedFormula(appropriateFormula.id);
    }
  };

  const getTotalMaterials = () => {
    const totals: Record<string, { amount: number; unit: string }> = {};

    if (selectedFormula) {
      const formula = productFormulas.find((f) => f.id === selectedFormula);
      if (formula) {
        formula.productFormulaMaterial.forEach((material) => {
          const totalAmount = material.quantityByUom * productQuantity;
          const materialName = material.materialVariant.name;
          const unit = material.materialVariant.material.materialUom.uomCharacter;
          if (totals[materialName]) {
            totals[materialName].amount += totalAmount;
          } else {
            totals[materialName] = { amount: totalAmount, unit };
          }
        });
      }
    }

    return totals;
  };

  const handleAddNewFormulaMaterial = () => {
    setNewFormulaMaterials([...newFormulaMaterials, { materialId: '', quantity: 0 }]);
  };

  const handleRemoveNewFormulaMaterial = (index: number) => {
    setNewFormulaMaterials(newFormulaMaterials.filter((_, i) => i !== index));
  };

  const handleNewFormulaMaterialChange = (
    index: number,
    field: 'materialId' | 'quantity',
    value: string | number
  ) => {
    const updatedMaterials = [...newFormulaMaterials];
    updatedMaterials[index][field] = value;
    setNewFormulaMaterials(updatedMaterials);
  };

  const handleCreateFormula = async () => {
    setIsCreatingFormula(true);
  };

  const handleSaveFormula = async () => {
    setIsSavingFormula(true);
    // Implement the logic to save the new formula
    console.log('Saving new formula:', {
      name: newFormulaName,
      materials: newFormulaMaterials
    });
    // Reset form fields after submission
    setNewFormulaName('');
    setNewFormulaMaterials([]);
    setIsCreatingFormula(false);
    setIsSavingFormula(false);
    setShowSaveDialog(false);
  };
  const handleAddMaterial = (materialId: string) => {
    setNewFormulaMaterials((prev) => [...prev, { materialId, quantity: 0 }]);
    setShowAddMaterialDialog(false);
  };

  const handleRemoveMaterial = (materialId: string) => {
    setNewFormulaMaterials((prev) => prev.filter((m) => m.materialId !== materialId));
  };

  const renderFormulaCreator = () => (
    <Dialog open={isCreatingFormula} onOpenChange={setIsCreatingFormula}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Create New Formula</DialogTitle>
          <DialogDescription>
            Mix your materials to create a new formula. Adjust quantities using the sliders.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="formula-name" className="w-24 shrink-0">
              Formula Name
            </Label>
            <Input
              id="formula-name"
              value={newFormulaName}
              onChange={(e) => setNewFormulaName(e.target.value)}
              className="flex-grow"
            />
          </div>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newFormulaMaterials.map((formulaMaterial) => {
                const material = materials.find((m) => m.id === formulaMaterial.materialId);
                if (!material) return null;
                return (
                  <Card key={material.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {material.image ? (
                            <img src={material.image} alt={material.name} className="w-10 h-10" />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold">{material.name}</h3>
                          <p className="text-sm text-gray-500">{material.code}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMaterial(material.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${material.id}`} className="text-sm">
                          Quantity
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id={`quantity-${material.id}`}
                            value={[formulaMaterial.quantity]}
                            onValueChange={(value) => handleQuantityChange(material.id, value[0])}
                            max={100}
                            step={1}
                            className="flex-grow"
                          />
                          <span className="w-12 text-center">{formulaMaterial.quantity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
          <Button onClick={() => setShowAddMaterialDialog(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Material
          </Button>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsCreatingFormula(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => setShowSaveDialog(true)}>
            Confirm Formula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderAddMaterialDialog = () => (
    <Dialog open={showAddMaterialDialog} onOpenChange={setShowAddMaterialDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Material</DialogTitle>
          <DialogDescription>Select a material to add to your formula.</DialogDescription>
        </DialogHeader>
        <Select onValueChange={handleAddMaterial}>
          <SelectTrigger>
            <SelectValue placeholder="Select a material" />
          </SelectTrigger>
          <SelectContent>
            {materials
              .filter((m) => !newFormulaMaterials.some((fm) => fm.materialId === m.id))
              .map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  );
  const renderSaveDialog = () => (
    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Formula</DialogTitle>
          <DialogDescription>
            Do you want to save this formula for later use or use it just this once?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
            Use Once
          </Button>
          <Button onClick={handleSaveFormula} disabled={isSavingFormula}>
            {isSavingFormula ? 'Saving...' : 'Save for Later'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                    {batch.name} (Quantity: {batch.quantityToProduce})
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
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={
                    productionBatches.find((b) => b.id === selectedBatch)?.productionPlanDetail
                      .productSize.productVariant.name || ''
                  }
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="product-size">Size</Label>
                <Input
                  id="product-size"
                  value={
                    productionBatches.find((b) => b.id === selectedBatch)?.productionPlanDetail
                      .productSize.name || ''
                  }
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="product-quantity">Quantity</Label>
                <Input
                  id="product-quantity"
                  type="number"
                  value={productQuantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedBatch && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Formulas</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedFormula} onValueChange={setSelectedFormula}>
              <TabsList>
                {productFormulas.map((formula) => (
                  <TabsTrigger key={formula.id} value={formula.id}>
                    {formula.name}
                  </TabsTrigger>
                ))}
                <TabsTrigger value="new">
                  <Beaker className="mr-2 h-4 w-4" />
                  Create New Formula
                </TabsTrigger>
              </TabsList>
              {productFormulas.map((formula) => (
                <TabsContent key={formula.id} value={formula.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{formula.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Quantity Range: {formula.quantityRangeStart} - {formula.quantityRangeEnd}
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formula.productFormulaMaterial.map((material) => (
                            <TableRow key={material.id}>
                              <TableCell className="flex items-center space-x-2">
                                <img
                                  src={material.materialVariant.image}
                                  alt={material.materialVariant.name}
                                  className="rounded-full w-10 h-10"
                                />
                                <span>{material.materialVariant.name}</span>
                              </TableCell>
                              <TableCell>{material.quantityByUom}</TableCell>
                              <TableCell>
                                {material.materialVariant.material.materialUom.uomCharacter}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
              <TabsContent value="new">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Formula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleCreateFormula}>
                      <Beaker className="mr-2 h-4 w-4" />
                      Start Mixing Materials
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {selectedBatch && selectedFormula && (
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

      {renderFormulaCreator()}
      {renderAddMaterialDialog()}
      {renderSaveDialog()}
    </div>
  );
}
