'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { flexRender, Table } from '@tanstack/react-table';
import { MdAdd } from "react-icons/md";


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon
} from '@radix-ui/react-icons';

import { CustomColumnDef } from '@/types/CompositeTable';
import { User } from '@/types/DemoUser';
import { DataTableFacetedFilter } from '@/components/common/CompositeTable/DatatableFacedFilter';
import { DataTableViewOptions } from '@/components/common/CompositeTable/DataTableViewOptions';
import { useNavigate } from 'react-router-dom';

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: QuestionMarkCircledIcon
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: CircleIcon
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: StopwatchIcon
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircledIcon
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CrossCircledIcon
  }
];

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDownIcon
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUpIcon
  }
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const navigate = useNavigate();
  function onClick(){
    navigate('/purchase-staff/import-request/create')
  }
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('username')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[450px]"
        />
        {table
          .getHeaderGroups()[0]
          .headers.map(
            (header) =>
              !header.isPlaceholder &&
              header.column.getCanFilter() && (
                <DataTableFacetedFilter
                  column={header.column}
                  title={`${flexRender(header.column.columnDef.header, header.getContext())}`}
                  options={(header.column.columnDef as CustomColumnDef<User>).filterOptions || []}
                />
              )
          )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-5">
        <DataTableViewOptions table={table} />
        <Button onClick={onClick} variant={'default'} size="sm" className="ml-auto hidden h-8 lg:flex">
          <MdAdd className="mr-2 h-4 w-4"/>
          Add
        </Button>
      </div>
    </div>
  );
}
