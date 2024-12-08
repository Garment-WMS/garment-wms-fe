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
  
  export function MaterialSummaryTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Ordered</TableHead>
            <TableHead>Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.code}>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.code}</TableCell>
              <TableCell>{material.ordered}</TableCell>
              <TableCell>{material.received}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  