import { MaterialAttribute } from '@/types/MaterialTypes'
import { Circle, Droplet, Hexagon, Info, Layers, Palette, Scale, Thermometer, FlaskRoundIcon as Flask, Flame, Waves, Sun, Package, Shirt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import React from 'react'
import { getIconAttributes } from '@/helpers/getIconAttributes'

type Props = {
    attributes?: MaterialAttribute[]
}

const Attributes: React.FC<Props> = ({attributes}) => {
  const iconClassName = "h-5 w-5"
  

    if(!attributes || attributes.length === 0) {
        return <div>No attributes</div>
    }
  return (
    <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {attributes.map((attr) => (
        <Card key={attr.id} className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            {getIconAttributes(attr.name)}
            <CardTitle className="ml-2 text-sm font-medium">{attr.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{attr.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  )
}

export default Attributes