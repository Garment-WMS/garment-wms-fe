import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/Table"
  
  const materials = [
    { name: "Red Fabric", code: "MAT-VAR-000002", ordered: 4, received: 2 },
    { name: "Black Plastic Buttons", code: "MAT-VAR-000008", ordered: 10, received: 5 },
    { name: "Sewing Thread (Red)", code: "MAT-VAR-000009", ordered: 10, received: 5 },
    { name: "Pellon SF101 Shape-Flex Fusible Interfacing", code: "MAT-VAR-000010", ordered: 10, received: 5 },
    { name: "Metal Collar Stays", code: "MAT-VAR-000011", ordered: 20, received: 10 },
    { name: "White Polyester Hem Tape", code: "MAT-VAR-000012", ordered: 6, received: 3 },
  ]
  interface MaterialVariantSummary{
    materialVariantSummary: Array<any>
  }
  export function MaterialSummaryTable({ materialVariantSummary }: MaterialVariantSummary) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materialVariantSummary?.map((material) => (
            <TableRow key={material.code}>
              <TableCell>
                
                <div className="flex items-center gap-2">
                  <img className="h-8 w-8" src={material?.image} alt={material?.name} />
                  {material?.name}
                </div>
                </TableCell>
              <TableCell>{material?.code}</TableCell>
              <TableCell>{material?.actualImportQuantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  