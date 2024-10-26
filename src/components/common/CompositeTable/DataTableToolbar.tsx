'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { flexRender, Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { DataTableViewOptions } from './DataTableViewOptions';

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

import { DataTableFacetedFilter } from './DatatableFacedFilter';
import { CustomColumnDef } from '@/types/CompositeTable';
import { User } from '@/types/DemoUser';

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
  searchColumnId?: string;
  searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchColumnId = 'id',
  searchPlaceholder = 'Search...'
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn(searchColumnId)?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[350px]"
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
      <DataTableViewOptions table={table} />
    </div>
  );
}
