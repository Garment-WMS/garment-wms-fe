import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/Table"
import { formatDateTimeToDDMMYYYYHHMM } from "@/helpers/convertDate"
  
  interface PurchaseOrderSummaryProps {
    purchaseOrder: {
      poNumber: string
      status: string
      orderDate: string
      expectedFinishDate: string
      totalQuantityToImport: number
      totalImportQuantity: number
      totalFailImportQuantity: number
      totalAmount: number
      currency: string
    }
  }
  
  export function PurchaseOrderSummary({ purchaseOrder }: PurchaseOrderSummaryProps) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">PO Number</TableCell>
            <TableCell>{purchaseOrder.poNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Status</TableCell>
            <TableCell>{purchaseOrder.status}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Order Date</TableCell>
            <TableCell>{formatDateTimeToDDMMYYYYHHMM(purchaseOrder.orderDate)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Expected Finish Date</TableCell>
            <TableCell>{formatDateTimeToDDMMYYYYHHMM(purchaseOrder.expectedFinishDate)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Total Quantity to Import</TableCell>
            <TableCell>{purchaseOrder.totalQuantityToImport}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Total Imported Quantity</TableCell>
            <TableCell>{purchaseOrder.totalImportQuantity}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Total Failed Import Quantity</TableCell>
            <TableCell>{purchaseOrder.totalFailImportQuantity}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Total Amount</TableCell>
            <TableCell>{purchaseOrder.totalAmount.toLocaleString()} {purchaseOrder.currency}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
  
  