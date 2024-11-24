import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/Table';
import React from 'react';

interface Props {
  // define your props here
}

const TableSkeleton: React.FC<Props> = (props) => {
  return (
    <Table>
      <TableBody>
        {[...Array(10)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-6 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-[100px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
