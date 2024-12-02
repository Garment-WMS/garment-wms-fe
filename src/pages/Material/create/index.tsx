'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { PlusCircle, Trash2 } from 'lucide-react'

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
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    materialId: '',
    name: '',
    reorderLevel: 0,
    attributes: [] as MaterialAttribute[],
    packages: [] as MaterialPackage[]
  })

//   useEffect(() => {
//     fetchMaterials()
//   }, [])

//   const fetchMaterials = async () => {
//     try {
//       // TODO: Replace with actual API call
//       const response = await fetch('/api/materials')
//       const data = await response.json()
//       setMaterials(data)
//     } catch (error) {
//       console.error('Error fetching materials:', error)
//     }
//   }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', value: '', type: 'STRING' }]
    }))
  }

  const updateAttribute = (index: number, field: keyof MaterialAttribute, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }))
  }

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const addPackage = () => {
    setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }))
  }

  const removePackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/material-variants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // router.push('/material-variants')
      } else {
        throw new Error('Failed to create material variant')
      }
    } catch (error) {
      console.error('Error creating material variant:', error)
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
          <Label htmlFor="materialId">Material</Label>
          <Select name="materialId" onValueChange={(value) => handleSelectChange('materialId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a material" />
            </SelectTrigger>
            <SelectContent>
              {materials.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name}
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
          <Label htmlFor="reorderLevel">Reorder Level</Label>
          <Input 
            id="reorderLevel" 
            name="reorderLevel" 
            type="number" 
            value={formData.reorderLevel} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div>
          <Label className='m-4'>Attributes</Label>
          {formData.attributes.map((attr, index) => (
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
          {formData.packages.map((pkg, index) => (
            <div key={index} className="space-y-2 mt-2 p-4 border rounded">
              <Input 
                placeholder="Name" 
                value={pkg.name} 
                onChange={(e) => updatePackage(index, 'name', e.target.value)} 
              />
              <Input 
                placeholder="Pack Unit" 
                value={pkg.packUnit} 
                onChange={(e) => updatePackage(index, 'packUnit', e.target.value)} 
              />
              <Input 
                type="number" 
                placeholder="UOM per Pack" 
                value={pkg.uomPerPack} 
                onChange={(e) => updatePackage(index, 'uomPerPack', parseFloat(e.target.value))} 
              />
              <Input 
                type="number" 
                placeholder="Packed Width" 
                value={pkg.packedWidth} 
                onChange={(e) => updatePackage(index, 'packedWidth', parseFloat(e.target.value))} 
              />
              <Input 
                type="number" 
                placeholder="Packed Length" 
                value={pkg.packedLength} 
                onChange={(e) => updatePackage(index, 'packedLength', parseFloat(e.target.value))} 
              />
              <Input 
                type="number" 
                placeholder="Packed Height" 
                value={pkg.packedHeight} 
                onChange={(e) => updatePackage(index, 'packedHeight', parseFloat(e.target.value))} 
              />
              <Input 
                type="number" 
                placeholder="Packed Weight" 
                value={pkg.packedWeight} 
                onChange={(e) => updatePackage(index, 'packedWeight', parseFloat(e.target.value))} 
              />
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

