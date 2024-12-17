import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatDateTimeToDDMMYYYYHHMM } from '@/helpers/convertDate';
import { Link } from 'react-router-dom';
import { PODelivery } from '@/types/PurchaseOrder';

// interface MaterialPackage {
//   name: string
//   code: string
// }

// interface PoDeliveryDetail {
//   quantityByPack: number
//   actualImportQuantity: number
//   materialPackage: MaterialPackage
// }

// interface PoDelivery {
//   id: string
//   code: string
//   status: string
//   expectedDeliverDate: string | null
//   deliverDate: string | null
//   poDeliveryDetail: PoDeliveryDetail[]
// }

interface PurchaseOrderDeliveryTableProps {
  poId: string;
  poDeliveries: PODelivery[];
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'PENDING':
      return 'default';
    case 'FINISHED':
      return 'success';
    case 'IMPORTING':
      return 'warning';
    case 'CANCELLED':
      return 'danger';
    default:
  }
}
export function PurchaseOrderDeliveryTable({
  poId,
  poDeliveries
}: PurchaseOrderDeliveryTableProps) {
  console.log(poDeliveries);
  const handleNavigateToPoDelivery = (id: string) => {};
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Delivery Code</TableHead>
          <TableHead>Import request</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expected Date</TableHead>
          <TableHead>Deliver Date</TableHead>
          <TableHead>Materials</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {poDeliveries.map((delivery) => (
          <TableRow key={delivery.id}>
            <TableCell>
              <Link className="text-bluePrimary hover:underline" to={`/purchase-order/${poId}`}>
                {delivery.code}
              </Link>
            </TableCell>
            <TableCell>
              {delivery?.importRequest?.[0] ? (
                <Link
                  className="text-bluePrimary hover:underline"
                  to={`/import-request/${delivery.importRequest[0].id}`}>
                  {delivery.importRequest[0].code}
                </Link>
              ) : (
                'N/A'
              )}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(delivery.status)}>{delivery.status}</Badge>
            </TableCell>
            <TableCell>
              {formatDateTimeToDDMMYYYYHHMM(delivery?.expectedDeliverDate) || 'N/A'}
            </TableCell>
            <TableCell>{formatDateTimeToDDMMYYYYHHMM(delivery?.deliverDate) || 'N/A'}</TableCell>
            <TableCell>
              <ul className="list-disc pl-5">
                {delivery.poDeliveryDetail.map((detail, index) => (
                  <li key={index}>
                    {detail.materialPackage.name} ({detail.materialPackage.code})
                  </li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
