import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/Table"
import { formatDateTimeToDDMMYYYYHHMM } from "@/helpers/convertDate"
import { convertTitleToTitleCase } from "@/helpers/convertTitleToCaseTitle"
import { PurchaseOrder } from "@/types/PurchaseOrder"
import { Link } from "react-router-dom"
  
  interface PurchaseOrderSummaryProps {
    purchaseOrder: PurchaseOrder
  }
  
  export function PurchaseOrderSummary( {purchaseOrder} : PurchaseOrderSummaryProps) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">PO Code</TableCell>
            <TableCell>
              <Link to={`/purchase-order/${purchaseOrder.id}`} className="text-bluePrimary hover:underline">{purchaseOrder.poNumber}</Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Status</TableCell>
            <TableCell>{convertTitleToTitleCase(purchaseOrder.status)}</TableCell>
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
            <TableCell>{purchaseOrder.subTotalAmount.toLocaleString()} {purchaseOrder.currency}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
  
  