import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/Table"
  
  const materials = [
    { name: "Red Farbic Roll ( 150m/roll )", code: "MAT-PAC-000004", ordered: 3, received: 1 },
    { name: "Black Plastic Buttons Pack of 100 (100 pcs/Pack)", code: "MAT-PAC-000010", ordered: 7, received: 3 },
    { name: "Metal Collar Stays Box (150 Pieces/Box)", code: "MAT-PAC-000019", ordered: 6, received: 4 },
    { name: "Red Sewing Thread Mini Box (2 Spools/Box)", code: "MAT-PAC-000013", ordered: 5, received: 5 },
    { name: "White Hem Tape Roll (10 meters/Roll)", code: "MAT-PAC-000020", ordered: 3, received: 3 },
    { name: "Metal Collar Stays Box (100 Pieces/Box)", code: "MAT-PAC-000018", ordered: 5, received: 5 },
    { name: "Pellon SF101 Fusible Interfacing Roll (10 meters/Roll)", code: "MAT-PAC-000014", ordered: 5, received: 5 },
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
  
  