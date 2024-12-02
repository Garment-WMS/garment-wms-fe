'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { PlusCircle, Trash2 } from 'lucide-react'
import privateCall from '@/api/PrivateCaller'
import { productApi, productVariantApi } from '@/api/services/productApi'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

interface Product {
  id: string
  name: string
}
interface ProductAttribute {
  name: string
  value: string
  type: 'STRING' | 'NUMBER' | 'BOOLEAN'
}
interface ProductSize {
  width: number
  height: number
  length: number
  weight: number
  size: string
}

export default function CreateProductVariant() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    productAttributes: [] as ProductAttribute[],
    productSizes: [] as ProductSize[]
  })
  const [image, setImage] = useState<File | null>(null); 
  const [imagePreview, setImagePreview] = useState<string | null>(null) // State to store preview URL
  const navigate = useNavigate()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  const fetchProductTypes = async () => {
    try {
      const res = await privateCall(productApi.getAllProduct());
      const data = res.data.data.data;

      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch product types:', error);
    }
  };
  useEffect(() => {
    fetchProductTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      productSizes: [...prev.productSizes, { 
        
        width: 0,
        height: 0,
        length: 0,
        weight: 0,
        size: ''
      }]
    }))
  }

  const updateSize = (index: number, field: keyof ProductSize, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      productSizes: prev.productSizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }))
  }

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productSizes: prev.productSizes.filter((_, i) => i !== index)
    }))
  }
  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      productAttributes: [...prev.productAttributes, { name: '', value: '', type: 'STRING' }]
    }))
  }

  const updateAttribute = (index: number, field: keyof ProductAttribute, value: string) => {
    setFormData(prev => ({
      ...prev,
      productAttributes: prev.productAttributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }))
  }
  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productAttributes: prev.productAttributes.filter((_, i) => i !== index)
    }))
  }
  const validateUniqueFields = (): boolean => {
    const attributeNames = formData.productAttributes.map((attr) => attr.name);
    const packageNames = formData.productSizes.map((pkg) => pkg.size);

    const hasDuplicateAttributes = new Set(attributeNames).size !== attributeNames.length;
    const hasDuplicatePackages = new Set(packageNames).size !== packageNames.length;

    if (hasDuplicateAttributes) {
      toast({
        variant: 'destructive',
        description: 'Duplicate attribute names found. Each attribute must have a unique name.',
        title: 'Validation Error'
      });
      return false;
    }

    if (hasDuplicatePackages) {
      toast({
        variant: 'destructive',
        description: 'Duplicate Size names found. Each Size must have a unique name.',
        title: 'Validation Error'
      });
      return false;
    }

    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    validateUniqueFields();
    setLoading(true)

    try {
      const formDataToSubmit = new FormData();

      formDataToSubmit.append('createProductDto', JSON.stringify(formData));

      if (image) {
        formDataToSubmit.append('file', image);
      }
      
      
      const config = {
        'Content-Type': 'multipart/form-data',
      }

      
      
      const response = await privateCall(productVariantApi.createProductVariant(formDataToSubmit,config));

      if (response.status === 201) {
        toast({
          variant: 'success',
          description: 'Material variant created successfully',
          title: 'Success'
        });
        navigate('/product-variant')
      } else {
        throw new Error('Failed to create material variant');
      }
    } catch (error) {
      const errorList = error.response.data.message;
      toast({
        variant: 'destructive',
        description: errorList,
        title: 'Error'
      });
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white mx-auto p-4 rounded-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">Create Product Variant</h2>
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
          <Label htmlFor="productId">Product</Label>
          <Select name="productId" onValueChange={(value) => handleSelectChange('productId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>

        <div>
          <Label className='m-4'>Attributes</Label>
          {formData.productAttributes.map((attr, index) => (
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
          <Label className='m-4'>Sizes</Label>
          {formData.productSizes.map((size, index) => (
            <div key={index} className="space-y-2 mt-2 p-4 border rounded">
              <div>
                <Label>Size</Label>
                <Input 
                placeholder="Name" 
                value={size.size} 
                onChange={(e) => updateSize(index, 'size', e.target.value)} 
              />
              </div>
              <div>
                <Label>Size Width</Label>
                <Input 
                type="number" 
                placeholder="Width" 
                value={size.width} 
                onChange={(e) => updateSize(index, 'width', parseFloat(e.target.value))} 
              />
              </div>
              <div>
                <Label>Size Height</Label>
                 <Input 
                type="number" 
                placeholder="Height" 
                value={size.height} 
                onChange={(e) => updateSize(index, 'height', parseFloat(e.target.value))} 
              />
              </div>
             <div>
              <Label>Size Length</Label>
              <Input 
                type="number" 
                placeholder="Length" 
                value={size.length} 
                onChange={(e) => updateSize(index, 'length', parseFloat(e.target.value))} 
              />
             </div>
              <div>
                <Label>Size Weight</Label>
                <Input 
                type="number" 
                placeholder="Weight" 
                value={size.weight} 
                onChange={(e) => updateSize(index, 'weight', parseFloat(e.target.value))} 
              />
              </div>
             
              <Button type="button" variant="ghost" onClick={() => removeSize(index)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Size
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addSize} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Size
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product Variant'}
      </Button>
    </form>
  )
}

