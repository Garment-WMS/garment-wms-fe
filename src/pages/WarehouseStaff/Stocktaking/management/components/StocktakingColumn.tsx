import { badgeVariants } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { formatDateTimeToDDMMYYYYHHMM } from "@/helpers/convertDate";
import { getStatusBadgeVariant } from "@/helpers/getStatusBadgeVariant";
import { CustomColumnDef } from "@/types/CompositeTable";
import { InventoryReport, InventoryReportPlanStatus } from "@/types/InventoryReport";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";



export const StocktakingColumn: CustomColumnDef<InventoryReport>[] = [
    {
      header: 'Inventory report code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <Link className="text-bluePrimary underline" to={`/${row.original.id}`}>{row.original.code}</Link>
          </div>
        );
      }
    },
  
    {
      header: 'Time started',
      accessorKey: 'from',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const dateString = row.original.from;
        if (!dateString) {
          return <div>N/A</div>;
        }
     
        return (
          <div>
            <div>{formatDateTimeToDDMMYYYYHHMM(dateString)}</div>
          </div>
        );
      }
    },
    {
      header: 'Time Ended',
      accessorKey: 'to',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const dateString = row.original.to;
        if (!dateString) {
          return <div>N/A</div>;
        }
     
        return (
          <div>
            <div>{formatDateTimeToDDMMYYYYHHMM(dateString)}</div>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableColumnFilter: true,
      cell: ({ row }) => (
        <div
          className={badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '', InventoryReportPlanStatus) })}>
          {(row.original.status ?? 'N/A')}
        </div>
      ),
      filterOptions: InventoryReportPlanStatus.map((status) => ({ label: status.label, value: status.value }))
    },
    // {
    //   id: 'actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const request = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <DotsHorizontalIcon className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem onClick={() => (window.location.href = `/stocktaking/${request.id}`)}>View</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   }
    // }
  ];