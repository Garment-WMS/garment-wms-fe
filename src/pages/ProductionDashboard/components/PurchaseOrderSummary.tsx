import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/Table"
import { convertTitleToTitleCase } from "@/helpers/convertTitleToCaseTitle"
import { PurchaseOrder } from "@/types/PurchaseOrder"
  
  // const purchaseOrders = [
  //   { id: "PUR-ORD-000001", status: "FINISHED", totalAmount: 122500000, deliveries: 2 },
  //   { id: "PUR-ORD-000002", status: "CANCELLED", totalAmount: 122500000, deliveries: 1 },
  // ]
  interface purchaseOrderSummary{
    purchaseOrder: PurchaseOrder[]
  }
  export function PurchaseOrderSummary({
    purchaseOrder
  }: purchaseOrderSummary) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Purchase Order ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount (VND)</TableHead>
            {/* <TableHead>Deliveries</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrder.map((order) => (
            <TableRow key={order?.id}>
              <TableCell>{order?.code}</TableCell>
              <TableCell>{convertTitleToTitleCase(order?.status)}</TableCell>
              <TableCell>{order?.subTotalAmount.toLocaleString()}</TableCell>
              {/* <TableCell>{order?.deliveries}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  