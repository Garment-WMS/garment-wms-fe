import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Star } from 'lucide-react'

type Props = {}
const products = [
    { id: 1, reference: "COMM", name: "Communication", salesPrice: 1.00, cost: 0.00, unit: "km" },
    { id: 2, reference: "CONS_0001", name: "Whiteboard Pen", salesPrice: 1.20, cost: 0.00, unit: "Units" },
    { id: 3, reference: "CONS_25630", name: "Screw", salesPrice: 0.20, cost: 0.10, unit: "Units" },
    { id: 4, reference: "CONS_89957", name: "Bolt", salesPrice: 0.50, cost: 0.50, unit: "Units" },
  ]
const ImportRequestTable = (props: Props) => {
  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Internal Reference</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Variant Values</TableHead>
            <TableHead className="text-right">Sales Price</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">On Hand</TableHead>
            <TableHead className="text-right">Forecasted</TableHead>
            <TableHead>Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Star className="text-gray-400 hover:text-yellow-400 cursor-pointer" size={16} />
              </TableCell>
              <TableCell className="font-medium">{product.reference}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">{product.salesPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.cost.toFixed(2)}</TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell>{product.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ImportRequestTable