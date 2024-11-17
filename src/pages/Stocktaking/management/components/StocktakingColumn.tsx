import { badgeVariants } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { getStatusBadgeVariant } from "@/helpers/getStatusBadgeVariant";
import { CustomColumnDef } from "@/types/CompositeTable";
import { InventoryReport, InventoryReportStatus } from "@/types/InventoryReport";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

const handleViewClick = (id: string) => {
  const navigate = useNavigate();
  return navigate(`/stocktaking/${id}`);
}

const StocktakingColumn: CustomColumnDef<InventoryReport>[] = [
    {
      header: 'Inventory report code',
      accessorKey: 'code',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <div>
            <div>{row.original.code}</div>
          </div>
        );
      }
    },
  
    {
      header: 'Time',
      accessorKey: 'from',
      enableColumnFilter: false,
      cell: ({ row }) => {
        const dateString = row.original.createdAt;
        if (!dateString) {
          return <div>N/A</div>;
        }
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return (
          <div>
            <div>{formattedDate}</div>
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
          className={badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '', InventoryReportStatus) })}>
          {(row.original.status ?? 'N/A')}
        </div>
      ),
      filterOptions: InventoryReportStatus.map((status) => ({ label: status.label, value: status.value }))
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const request = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewClick(request.id)}>View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];