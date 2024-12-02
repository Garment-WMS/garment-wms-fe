
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { PlusCircle, Trash2 } from 'lucide-react'
import privateCall from '@/api/PrivateCaller'
import { materialApi, materialTypeApi } from '@/api/services/materialApi'
import { toast } from '@/hooks/use-toast'
import { UOM } from '@/types/MaterialTypes'
import { useNavigate } from 'react-router-dom'

interface Material {
  id: string
  name: string
}

interface MaterialAttribute {
  name: string
  value: string
  type: 'STRING' | 'NUMBER' | 'BOOLEAN'
}

interface MaterialPackage {
  name: string
  packUnit: string
  uomPerPack: number
  packedWidth: number
  packedLength: number
  packedHeight: number
  packedWeight: number
}

export default function CreateMaterialVariant() {
  const [materialType, setMaterialType] = useState<Material[]>([]);
  const [uom, setUom] = useState<UOM[]>([]);
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null); 
  const [imagePreview, setImagePreview] = useState<string | null>(null) // State to store preview URL
  const navigate = useNavigate()
  const [formData, setFormData] = useState()
  const [data, setData] = useState({
    materialId: '',
    name: '',
    reorderLevel: 0,
    attributes: [] as MaterialAttribute[],
    packages: [] as MaterialPackage[]
  })

  useEffect(() => {
    fetchMaterialTypes()
  }, [])

  const fetchMaterialTypes = async () => {
    try {
      const materialTypeResponse = await privateCall(materialTypeApi.getAll());
      setMaterialType(materialTypeResponse.data.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to fetch material types',
        title: 'Error'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setData(prev => ({ ...prev, [name]: value }))
  }

  const addAttribute = () => {
    setData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', value: '', type: 'STRING' }]
    }))
  }

  const updateAttribute = (index: number, field: keyof MaterialAttribute, value: string) => {
    setData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }))
  }

  const removeAttribute = (index: number) => {
    setData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const addPackage = () => {
    setData(prev => ({
      ...prev,
      packages: [...prev.packages, { 
        name: '', 
        packUnit: '', 
        uomPerPack: 0,
        packedWidth: 0,
        packedLength: 0,
        packedHeight: 0,
        packedWeight: 0
      }]
    }))
  }

  const updatePackage = (index: number, field: keyof MaterialPackage, value: string | number) => {
    setData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }))
  }

  const removePackage = (index: number) => {
    setData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSubmit = new FormData();

      formDataToSubmit.append('createMaterialDto', JSON.stringify(data));

      console.log('Image file before appending:', image); // Check the file object
      if (image) {
        formDataToSubmit.append('file', image);
      }
      
      
      const config = {
        'Content-Type': 'multipart/form-data',
      }

      
      
      const response = await privateCall(materialApi.createMaterialVariant(formDataToSubmit,config));

      if (response.status === 201) {
        toast({
          variant: 'success',
          description: 'Material variant created successfully',
          title: 'Success'
        });
        navigate('/material-variant')
      } else {
        throw new Error('Failed to create material variant');
      }
    } catch (error) {
      console.error('Error creating material variant:', error);
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white mx-auto p-4 rounded-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">Create Material Variant</h2>
      </div>

      <div className="space-y-4">
      <div>
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Selected Preview" 
              className="mt-4 max-w-xs rounded-md border" 
            />
          )}
      </div>
        <div>
          <Label htmlFor="materialId">Material</Label>
          <Select name="materialId" onValueChange={(value) => handleSelectChange('materialId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a material" />
            </SelectTrigger>
            <SelectContent>
              {materialType.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={data.name} onChange={handleInputChange} required />
        </div>

        {/* <div>
          <Label htmlFor="reorderLevel">Reorder Level</Label>
          <Input 
            id="reorderLevel" 
            name="reorderLevel" 
            type="number" 
            value={data.reorderLevel} 
            onChange={handleInputChange} 
            required 
          />
        </div> */}

        <div>
          <Label className='m-4'>Attributes</Label>
          {data.attributes.map((attr, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <Input 
                placeholder="Name" 
                value={attr.name} 
                onChange={(e) => updateAttribute(index, 'name', e.target.value)} 
              />
              <Input 
                placeholder="Value" 
                value={attr.value} 
                onChange={(e) => updateAttribute(index, 'value', e.target.value)} 
              />
              <Select 
                value={attr.type} 
                onValueChange={(value) => updateAttribute(index, 'type', value as 'STRING' | 'NUMBER' | 'BOOLEAN')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STRING">String</SelectItem>
                  <SelectItem value="NUMBER">Number</SelectItem>
                  <SelectItem value="BOOLEAN">Boolean</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" variant="ghost" onClick={() => removeAttribute(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addAttribute} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Attribute
          </Button>
        </div>

        <div>
          <Label className='m-4'>Packages</Label>
          {data.packages.map((pkg, index) => (
            <div key={index} className="space-y-2 mt-2 p-4 border rounded">
              <div>
                <Label>Name</Label>
              <Input 
                placeholder="Name" 
                value={pkg.name} 
                onChange={(e) => updatePackage(index, 'name', e.target.value)} 
              />
              </div>
              <div>
                <Label>Pack Unit</Label>
                <Input 
                placeholder="Pack Unit" 
                value={pkg.packUnit} 
                onChange={(e) => updatePackage(index, 'packUnit', e.target.value)} 
              />
              </div>
              <div>
                <Label>UOM per Pack</Label>
                <Input 
                type="number" 
                placeholder="UOM per Pack" 
                value={pkg.uomPerPack} 
                onChange={(e) => updatePackage(index, 'uomPerPack', parseFloat(e.target.value))} 
              />
              </div>
              <div>
                <Label>Width of the package</Label>
                <Input 
                type="number" 
                placeholder="Packed Width" 
                value={pkg.packedWidth} 
                onChange={(e) => updatePackage(index, 'packedWidth', parseFloat(e.target.value))} 
              />
              </div>
              <div>
                <Label>Length of the package</Label>
                <Input 
                type="number" 
                placeholder="Packed Length" 
                value={pkg.packedLength} 
                onChange={(e) => updatePackage(index, 'packedLength', parseFloat(e.target.value))} 
              />
              </div>
              <div>
                <Label>Height of the package</Label>
                <Input 
                type="number" 
                placeholder="Packed Height" 
                value={pkg.packedHeight} 
                onChange={(e) => updatePackage(index, 'packedHeight', parseFloat(e.target.value))} 
              />
              </div>
              <div>
                <Label>Weight of the package</Label>
                <Input 
                type="number" 
                placeholder="Packed Weight" 
                value={pkg.packedWeight} 
                onChange={(e) => updatePackage(index, 'packedWeight', parseFloat(e.target.value))} 
              />
              </div>
              
              <Button type="button" variant="ghost" onClick={() => removePackage(index)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Package
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPackage} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Material Variant'}
      </Button>
    </form>
  )
}

