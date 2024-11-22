// import React from 'react'
// import { useState } from "react"
// import { ChevronDown, ChevronUp } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/Badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { productFormula, ProductSize } from '@/types/ProductType'
// type Props = {
//     productSize: ProductSize[]
// }
// const ProductFormula = ({productSize} :Props) => {
//     const [expandedFormulas, setExpandedFormulas] = useState<string[]>([])

//     const toggleFormula = (id: string) => {
//       setExpandedFormulas((prev) =>
//         prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
//       )
//     }
//     // const productFormulas: productFormula[] = productSize.map((size) => size.productFormula)
//     return (
//       <div className="container mx-auto p-4 space-y-4">
//         <h1 className="text-2xl font-bold mb-4">Product Formulas</h1>
//         {productFormulas.map((formula) => (
//           <Card key={formula.id} className="w-full">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-lg">{formula.name}</CardTitle>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => toggleFormula(formula.id)}
//                 >
//                   {expandedFormulas.includes(formula.id) ? (
//                     <ChevronUp className="h-4 w-4" />
//                   ) : (
//                     <ChevronDown className="h-4 w-4" />
//                   )}
//                 </Button>
//               </div>
//               <div className="flex space-x-2 mt-2">
//                 <Badge variant="outline">{formula.code}</Badge>
//                 <Badge variant={formula.isBaseFormula ? "default" : "secondary"}>
//                   {formula.isBaseFormula ? "Base Formula" : "Extended Formula"}
//                 </Badge>
//                 <Badge variant="outline">
//                   Quantity: {formula.quantityRangeStart} - {formula.quantityRangeEnd}
//                 </Badge>
//               </div>
//             </CardHeader>
//             {expandedFormulas.includes(formula.id) && (
//               <CardContent>
//                 <h3 className="font-semibold mb-2">Materials:</h3>
//                 <div className="space-y-4">
//                   {formula.productFormulaMaterial.map((material, index) => (
//                     <div key={index} className="flex items-center space-x-4">
//                       <Avatar className="h-12 w-12">
//                         <AvatarImage src={material.materialVariant.image} alt={material.materialVariant.name} />
//                         <AvatarFallback>{material.materialVariant.name.slice(0, 2)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium">{material.materialVariant.name}</p>
//                         <p className="text-sm text-gray-500">{material.materialVariant.code}</p>
//                         <p className="text-sm">
//                           Quantity: {material.quantityByUom} {material.material.materialUom.uomCharacter}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             )}
//           </Card>
//         ))}
//       </div>
//     )
// }

// export default ProductFormula