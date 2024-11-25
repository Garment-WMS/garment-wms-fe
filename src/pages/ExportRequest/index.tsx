'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, X, Save, ArrowRight, Beaker, Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { createProductFormula } from '@/api/services/productApi';
import { createMaterialExportRequest } from '@/api/services/exportRequestApi';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

  status: string;
  productionPlanDetail: {
    quantityToProduce: number;
    productSizeId: string;
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
  material: any;
};
type NewFormulaMaterial = {
  materialId: string;
  quantity: number;
};

type FormulaDetails = {
  productSizeId: string;
  name: string;
  quantityRangeStart: number;
  quantityRangeEnd: number;
  isBaseFormula: boolean;
  productFormulaMaterials: Array<{
    materialVariantId: string;
    quantityByUom: number;
  }>;
};
type TemporaryFormula = {
  id: string;
  name: string;
  quantityRangeStart: number;
  quantityRangeEnd: number;
  productFormulaMaterial: Array<{
    id: string;
    materialVariant: {
      id: string;
      name: string;
      image: string;
      material: {
        materialUom: {
          uomCharacter: string;
        };
      };
    };
    quantityByUom: number;
  }>;
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
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [newMaterialQuantity, setNewMaterialQuantity] = useState<number>(0);
  const [showFormulaDetailsDialog, setShowFormulaDetailsDialog] = useState(false);
  const [exportDescription, setExportDescription] = useState('');
  const [isCreatingExportRequest, setIsCreatingExportRequest] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formulaDetails, setFormulaDetails] = useState<FormulaDetails>({
    productSizeId: '',
    name: '',
    quantityRangeStart: 0,
    quantityRangeEnd: 0,
    isBaseFormula: false,
    productFormulaMaterials: []
  });
  const [temporaryFormula, setTemporaryFormula] = useState<TemporaryFormula | null>(null);

  const handleSaveFormula = () => {
    setShowSaveDialog(false);
    setShowFormulaDetailsDialog(true);
    setFormulaDetails({
      ...formulaDetails,
      name: newFormulaName,
      productFormulaMaterials: newFormulaMaterials.map((material) => ({
        materialVariantId: material.materialId,
        quantityByUom: material.quantity
      }))
    });
  };
  const handleUseOnce = () => {
    setTemporaryFormula({
      id: 'temp-' + Date.now(),
      name: newFormulaName || 'Temporary Formula',
      quantityRangeStart: formulaDetails.quantityRangeStart,
      quantityRangeEnd: formulaDetails.quantityRangeEnd,
      productFormulaMaterial: newFormulaMaterials.map((material) => ({
        id: 'temp-' + Date.now() + '-' + material.materialId,
        materialVariant: {
          id: material.materialId,
          name: materials.find((m) => m.id === material.materialId)?.name || '',
          image: materials.find((m) => m.id === material.materialId)?.image || '',
          material: {
            materialUom: {
              uomCharacter:
                materials.find((m) => m.id === material.materialId)?.material.materialUom
                  .uomCharacter || ''
            }
          }
        },
        quantityByUom: material.quantity
      }))
    });
    setShowSaveDialog(false);
    setIsCreatingFormula(false);
    setSelectedFormula('temp');
  };
  const handleFormulaDetailsSubmit = async () => {
    setIsSavingFormula(true);
    try {
      const batch = productionBatches.find((item) => item.id === selectedBatch);
      if (!batch) {
        throw new Error('Selected batch not found');
      }
      const res = await createProductFormula(
        batch.productionPlanDetail.productSizeId,
        formulaDetails.name,
        formulaDetails.quantityRangeStart,
        formulaDetails.quantityRangeEnd,
        formulaDetails.productFormulaMaterials
      );
        if(res.statusCode === 201){
          navigate('/export-request');
          toast({variant: 'success', title: 'Formula created', description: 'Your formula has been successfully created.'});
        }

      // Re-fetch the product formulas to update the list
      await fetchProductFormulas();

      // Reset form fields after submission
      setNewFormulaName('');
      setNewFormulaMaterials([]);
      setIsCreatingFormula(false);
      setShowFormulaDetailsDialog(false);
    } catch (error) {
      console.error('Error saving formula:', error);
      setError('Failed to save formula');
    } finally {
      setIsSavingFormula(false);
    }
  };
  useEffect(() => {
    if (selectedBatch) {
      fetchProductFormulas();
    }
  }, [selectedBatch]);

  const handleCreateExportRequest = async () => {
    if (!selectedBatch || !selectedFormula) {
      setError('Please select a production batch and a formula');
      return;
    }

    setIsCreatingExportRequest(true);
    try {
      let response;
      if (selectedFormula === 'temp' && temporaryFormula) {
        // Handle temporary formula case
        const materialExportRequestDetail = temporaryFormula.productFormulaMaterial.map(
          (material) => ({
            materialVariantId: material.materialVariant.id,
            quantityByUom: material.quantityByUom * productQuantity
          })
        );
        response = await createMaterialExportRequest(
          selectedBatch,
          exportDescription,
          materialExportRequestDetail,
          'custom'
        );
        if (response.statusCode === 201) {
          toast({
            variant: 'success',
            title: 'Export request created',
            description: 'Your material export request has been successfully created.'
          });
          navigate('/export-request');
        } else {
          throw new Error('Unexpected status code: ' + response.statusCode);
        }
      } else {
        // Handle saved formula case
        response = await createMaterialExportRequest(
          selectedBatch,
          exportDescription,
          selectedFormula,
          'formula'
        );
        if (response.statusCode === 201) {
          toast({
            variant: 'success',
            title: 'Export request created',
            description: 'Your material export request has been successfully created.'
          });
          navigate('/export-request');
        } else {
          throw new Error('Unexpected status code: ' + response.statusCode);
        }
      }

      // Handle successful creation (e.g., show success message, reset form, etc.)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Failed to create export request',
          description: error.message || 'An unexpected error occurred. Please try again.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to create export request',
          description: 'An unexpected error occurred. Please try again.'
        });
      }
    } finally {
      setIsCreatingExportRequest(false);
    }
  };

  const fetchProductFormulas = async () => {
    try {
      setIsLoading(true);
      const response = await getProductFormulaByProductionBatchFn(selectedBatch as string);
      const batch = productionBatches.find((b) => b.id === selectedBatch);
      if (batch) {
        setProductQuantity(batch.productionPlanDetail.quantityToProduce);
        // Filter suitable formulas
        const suitableFormulas = response.filter(
          (formula: ProductFormula) =>
            batch.productionPlanDetail.quantityToProduce >= formula.quantityRangeStart &&
            batch.productionPlanDetail.quantityToProduce <= formula.quantityRangeEnd
        );
        setProductFormulas(suitableFormulas);
      }
    } catch (err) {
      setError('Failed to fetch product formulas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormulaDetailsDialog = () => (
    <Dialog open={showFormulaDetailsDialog} onOpenChange={setShowFormulaDetailsDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Formula Details</DialogTitle>
          <DialogDescription>
            Please fill in the remaining details for your formula.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="formula-name">Formula Name</Label>
            <Input
              id="formula-name"
              value={formulaDetails.name}
              onChange={(e) => setFormulaDetails({ ...formulaDetails, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="quantity-range-start">Quantity Range Start</Label>
            <Input
              id="quantity-range-start"
              type="number"
              value={formulaDetails.quantityRangeStart}
              onChange={(e) =>
                setFormulaDetails({
                  ...formulaDetails,
                  quantityRangeStart: parseInt(e.target.value)
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="quantity-range-end">Quantity Range End</Label>
            <Input
              id="quantity-range-end"
              type="number"
              value={formulaDetails.quantityRangeEnd}
              onChange={(e) =>
                setFormulaDetails({ ...formulaDetails, quantityRangeEnd: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowFormulaDetailsDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleFormulaDetailsSubmit} disabled={isSavingFormula}>
            {isSavingFormula ? 'Saving...' : 'Save Formula'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
            setProductQuantity(batch.productionPlanDetail.quantityToProduce);
            // Filter suitable formulas
            const suitableFormulas = response.filter(
              (formula: any) =>
                batch.productionPlanDetail.quantityToProduce >= formula.quantityRangeStart &&
                batch.productionPlanDetail.quantityToProduce <= formula.quantityRangeEnd
            );
            setProductFormulas(suitableFormulas);

            if (suitableFormulas && suitableFormulas.length > 0) {
              setSelectedFormula(suitableFormulas[0].id);
            } else {
              setSelectedFormula('new');
            }

            setIsLoading(false);
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
    } else {
      setSelectedFormula('new');
    }
  };
  const handleMaterialChange = (materialId: string, quantity: number) => {
    setNewFormulaMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.materialId === materialId ? { ...material, quantity } : material
      )
    );
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

  // const handleAddNewFormulaMaterial = () => {
  //   setNewFormulaMaterials([...newFormulaMaterials, { materialId: '', quantity: 0 }]);
  // };

  // const handleRemoveNewFormulaMaterial = (index: number) => {
  //   setNewFormulaMaterials(newFormulaMaterials.filter((_, i) => i !== index));
  // };

  // const handleNewFormulaMaterialChange = (
  //   index: number,
  //   field: 'materialId' | 'quantity',
  //   value: string | number
  // ) => {
  //   const updatedMaterials = [...newFormulaMaterials];
  //   updatedMaterials[index][field] = value;
  //   setNewFormulaMaterials(updatedMaterials);
  // };

  const handleCreateFormula = async () => {
    setIsCreatingFormula(true);
  };

  const handleAddMaterial = () => {
    if (selectedMaterialId && newMaterialQuantity > 0) {
      setNewFormulaMaterials((prev) => [
        ...prev,
        { materialId: selectedMaterialId, quantity: newMaterialQuantity }
      ]);
      setShowAddMaterialDialog(false);
      setSelectedMaterialId('');
      setNewMaterialQuantity(0);
    }
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
                            onValueChange={(value) => handleMaterialChange(material.id, value[0])}
                            max={50}
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
          <DialogDescription>
            Select a material and specify the quantity to add to your formula.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material-select">Material</Label>
            <Select onValueChange={setSelectedMaterialId} value={selectedMaterialId}>
              <SelectTrigger id="material-select">
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="material-quantity">Quantity</Label>
            <Input
              id="material-quantity"
              type="number"
              min="0"
              step="0.01"
              value={newMaterialQuantity}
              onChange={(e) => setNewMaterialQuantity(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddMaterialDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMaterial}
            disabled={!selectedMaterialId || newMaterialQuantity <= 0}>
            Add Material
          </Button>
        </DialogFooter>
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
          <Button variant="outline" onClick={handleUseOnce}>
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
                    {batch.name} (Quantity: {batch.productionPlanDetail.quantityToProduce})
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
                {temporaryFormula && (
                  <TabsTrigger value="temp">{temporaryFormula.name}</TabsTrigger>
                )}
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
                                {material.materialVariant.material.materialUom.uomCharacter +
                                  ' ' +
                                  `(${material.materialVariant.material.materialUom.name})`}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
              {temporaryFormula && (
                <TabsContent value="temp">
                  <Card>
                    <CardHeader>
                      <CardTitle>{temporaryFormula.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Quantity Range: {temporaryFormula.quantityRangeStart} -{' '}
                        {temporaryFormula.quantityRangeEnd}
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
                          {temporaryFormula.productFormulaMaterial.map((material) => (
                            <TableRow key={material.id}>
                              <TableCell className="flex items-center space-x-2">
                                <img
                                  src={material.materialVariant.image || '/placeholder.svg'}
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
              )}
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

            <div className="space-y-4">
              <div>
                <Label htmlFor="export-description">Description</Label>
                <Textarea
                  id="export-description"
                  placeholder="Enter a description for this export request"
                  value={exportDescription}
                  onChange={(e: any) => setExportDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardFooter className="flex justify-between items-center pt-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleCreateExportRequest}>Create Material Request</Button>
        </CardFooter>
      </Card>

      {renderFormulaCreator()}
      {renderAddMaterialDialog()}
      {renderSaveDialog()}
      {renderFormulaDetailsDialog()}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
