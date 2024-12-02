'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { PlusCircle, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
}

interface ProductSize {
  name: string
  code: string
  width: number
  height: number
  length: number
  weight: number
  size: string
}

export default function CreateProductVariant() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    code: '',
    sizes: [] as ProductSize[]
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

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
      sizes: [...prev.sizes, { 
        name: '', 
        code: '', 
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
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }))
  }

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/product-variants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // router.push('/product-variants')
      } else {
        throw new Error('Failed to create product variant')
      }
    } catch (error) {
      console.error('Error creating product variant:', error)
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
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" value={formData.code} onChange={handleInputChange} required />
        </div>

        <div>
          <Label className='m-4'>Sizes</Label>
          {formData.sizes.map((size, index) => (
            <div key={index} className="space-y-2 mt-2 p-4 border rounded">
              <Input 
                placeholder="Name" 
                value={size.name} 
                onChange={(e) => updateSize(index, 'name', e.target.value)} 
              />
              <Input 
                placeholder="Code" 
                value={size.code} 
                onChange={(e) => updateSize(index, 'code', e.target.value)} 
              />
              <Input 
                type="number" 
                placeholder="Width" 
                value={size.width} 
                onChange={(e) => updateSize(index, 'width', parseFloat(e.target.value))} 
              />
              <Input 
                type="number" 
                placeholder="Height" 
                value={size.height} 
                onChange={(e) => updateSize(index, 'height', parseFloat(e.target.value))} 
              />
              <Input 
                type="number" 
                placeholder="Length" 
                value={size.length} 
                onChange={(e) => updateSize(index, 'length', parseFloat(e.target.value))} 
              />
              <Input 
                type="number" 
                placeholder="Weight" 
                value={size.weight} 
                onChange={(e) => updateSize(index, 'weight', parseFloat(e.target.value))} 
              />
              <Input 
                placeholder="Size" 
                value={size.size} 
                onChange={(e) => updateSize(index, 'size', e.target.value)} 
              />
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

