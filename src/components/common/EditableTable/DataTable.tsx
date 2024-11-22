import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { CSSProperties, useState } from 'react';
import { Button } from '@/components/ui/button';
import SelectionCommand from './SelectionCommand';
import { createZodSchema } from '@/helpers/createZodSchema';
import { Input } from '@/components/ui/Input';

const DEFAULT_REACT_TABLE_COLUMN_WIDTH = 150;

interface DataTableProps<TData, TValue> {
  columns: any;
  data: TData[];
  isEdit: Boolean;
  setDetails: any;
  setError: any;
}
const DataTable = <TData, TValue>({
  data,
  columns,
  isEdit,
  setDetails,
  setError
}: DataTableProps<TData, TValue>) => {
  const handleMaterialSelect = (rowIndex: number, material: any) => {
    setDetails((prevData: any) =>
      prevData.map((row: any, index: number) =>
        index === rowIndex
          ? {
              ...row,
              // Only update the columns that exist in both the row and material object
              ...Object.keys(row).reduce((acc, key) => {
                if (material[key] !== undefined) {
                  acc[key] = material[key];
                }
                return acc;
              }, {} as any) // Accumulator that dynamically adds material keys
            }
          : row
      )
    );
    togglePopover(`${rowIndex}`);
  };
  const addRow = (material: any) => {
    setDetails((prevData: any) => [
      ...prevData,
      {
        // Only add the columns that exist in both the material object and the previous rows
        ...Object.keys(prevData[0] || {}).reduce((acc, key) => {
          if (material[key] !== undefined) {
            acc[key] = material[key];
          } else {
            acc[key] = '';
          }
          return acc;
        }, {} as any)
      }
    ]);
    togglePopover('99');
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  });

  // Handle input change
  const handleInputChange = (rowIndex: number, columnId: string, value: any) => {
    const formattedValue =
      columnId === 'plannedQuantity' || columnId === 'actualQuantity' ? Number(value) : value;
    setDetails((prevData: any) =>
      prevData.map((row: any, index: number) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
    // Dynamically create the Zod schema for validation
    const schema = createZodSchema(columns);
    if (columnId == 'actualQuantity') {
      if (value > data[rowIndex]['plannedQuantity']) {
        setError(true);
        setValidationErrors((prev) => ({
          ...prev,
          [`${rowIndex}-${columnId}`]: 'Acutal Quantity must not exeed planned Quantity'
        }));
        return;
      }
    }
    const updatedRow = {
      ...data[rowIndex],
      [columnId]: formattedValue
    };

    // Validate the updated row using the dynamically generated schema
    const result = schema.safeParse(updatedRow);

    if (!result.success) {
      setError(true);
      // Find and display the validation error for the specific field
      const error = result.error.issues.find((issue) => issue.path[0] === columnId);
      if (error) {
        setValidationErrors((prev) => ({
          ...prev,
          [`${rowIndex}-${columnId}`]: error.message
        }));
        return;
      }
    }
    setError(false);
    // Clear any previous error for the field if validation passes
    setValidationErrors((prev) => ({
      ...prev,
      [`${rowIndex}-${columnId}`]: ''
    }));
  };
  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({});
  // Toggle open state for popovers
  const togglePopover = (cellId: string) => {
    setOpenPopovers((prev) => ({
      ...prev,
      [cellId]: !prev[cellId] // Toggle the specific popover
    }));
  };
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const styles: CSSProperties =
                    header.getSize() !== DEFAULT_REACT_TABLE_COLUMN_WIDTH
                      ? { width: `${header.getSize()}px` }
                      : {};

                  return (
                    <TableHead key={header.id} style={styles}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell key={cell.id}>
                    {cell.column.columnDef.isEditable && isEdit ? (
                      cell.column.columnDef.isPopover ? (
                        <Popover
                          open={openPopovers[`${rowIndex}`] || false} // Check open state for each popover
                          onOpenChange={() => togglePopover(`${rowIndex}`)} // Toggle the specific popover
                        >
                          <PopoverTrigger asChild>
                            <Button variant={'outline'}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            {data && (
                              <SelectionCommand
                                dataTable={data}
                                onSelectMaterial={(material) =>
                                  handleMaterialSelect(rowIndex, material)
                                }
                              />
                            )}
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <>
                          <Input
                            type="number"
                            value={cell.getValue() as string} // Assuming the value is a string
                            onChange={(e) =>
                              handleInputChange(rowIndex, cell.column.id, e.target.value)
                            }
                            className={`border rounded p-1 ${validationErrors[`${rowIndex}-${cell.column.id}`] ? 'border-red-500' : ''}`}
                          />
                          {validationErrors[`${rowIndex}-${cell.column.id}`] && (
                            <div className="text-red-500 text-sm ">
                              {validationErrors[`${rowIndex}-${cell.column.id}`]}
                            </div>
                          )}
                        </>
                      )
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
          {/* {isEdit && (
            <TableRow>
              <TableCell>
                <Popover
                  open={openPopovers[`99`] || false} // Check open state for each popover
                  onOpenChange={() => togglePopover(`99`)} // Toggle the specific popover
                >
                  <PopoverTrigger asChild>
                    <Button variant={'outline'}>+ New Material</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <SelectionCommand
                      dataTable={data}
                      onSelectMaterial={(material) => addRow(material)}
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              {table.getAllColumns().map((column) => (
                <TableCell key={column.id}></TableCell>
              ))}
            </TableRow>
          )} */}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => {
            return (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => {
                  return (
                    <TableCell key={footer.id} colSpan={footer.colSpan}>
                      {flexRender(footer.column.columnDef.footer, footer.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableFooter>
      </Table>
    </div>
  );
};

export default DataTable;
