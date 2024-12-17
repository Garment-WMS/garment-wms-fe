import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';

// const planDetails = [
//   { product: "Red Cotton T-Shirt - L", quantity: 50, produced: 50, manufacturing: 0, defects: 0 },
//   { product: "Red Cotton T-Shirt - M", quantity: 100, produced: 0, manufacturing: 0, defects: 0 },
//   { product: "Red Cotton T-Shirt - S", quantity: 50, produced: 0, manufacturing: 0, defects: 0 },
//   { product: "Black Polo T-Shirt - XL", quantity: 60, produced: 0, manufacturing: 0, defects: 0 },
//   { product: "Black Polo T-Shirt - M", quantity: 75, produced: 0, manufacturing: 0, defects: 0 },
//   { product: "Black Polo T-Shirt - L", quantity: 50, produced: 0, manufacturing: 0, defects: 0 },
// ]
interface ProductionPlanDetails {
  planDetails: Array<any>;
}
export function ProductionPlanDetails({ planDetails }: ProductionPlanDetails) {
  console.log(planDetails);
  const data = planDetails.map((detail) => ({
    name: detail.productSize.name,
    image: detail.productSize?.productVariant.image,
    quantityToProduct: detail.quantityToProduce,
    produced: detail.productPlanDetailProducedQuantity,
    manufacturing: detail.productPlanDetailManufacturingQuantity,
    defects: detail.productPlanDetailDefectQuantity
  }));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity to Produce</TableHead>
          <TableHead>Produced</TableHead>
          <TableHead>In Manufacturing</TableHead>
          <TableHead>Defects</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((detail) => (
          <TableRow key={detail.name}>
            <TableCell>
              <img
                src={detail.image}
                alt={detail.name}
                width={40}
                height={40}
                className="object-cover rounded-full"
              />
            </TableCell>
            <TableCell>{detail.name}</TableCell>
            <TableCell>{detail.quantityToProduct}</TableCell>
            <TableCell>{detail.produced}</TableCell>
            <TableCell>{detail.manufacturing}</TableCell>
            <TableCell>{detail.defects}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
