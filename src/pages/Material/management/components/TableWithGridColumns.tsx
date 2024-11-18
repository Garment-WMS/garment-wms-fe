// import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
// import { CustomColumnDef } from "@/types/CompositeTable";
// import { Material } from "@/types/MaterialTypes";
// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
// const handleViewClick = (requestId: string) => {
//     const basePath = location.pathname.split('/import-request')[0]; // Get base path (either manager or purchase-staff)

//     // Navigate to the new route
//     navigate(`${basePath}/import-request/${requestId}`);
//   };

// export const importRequestColumn: CustomColumnDef<Material>[] = [
//     {
//       header: 'Material code',
//       accessorKey: 'code',
//       enableColumnFilter: true,
//       cell: ({ row }) => {
//         return (
//           <div>
//             <div>{row.original.code}</div>
//           </div>
//         );
//       }
//     },
//     {
//       header: 'Material name',
//       accessorKey: 'name',
//       enableColumnFilter: true,
//       cell: ({ row }) => {
//         return (
//           <div>
//             <div>{row.original.name}</div>
//           </div>
//         );
//       }
//     },
//     {
//       header: 'Material type',
//       accessorKey: 'materialType',
//       enableColumnFilter: true,
//       filterOptions: materialType.map((delivery) => ({
//         label: delivery.label,
//         value: delivery.value
//       })),
//       cell: ({ row }) => <div>{row.original.materialType.name}</div>
//     },
   
//     {
//       header: 'Status',
//       accessorKey: 'status',
//       enableColumnFilter: true,
//       cell: ({ row }) => (
//         <div className={badgeVariants({ variant: getStatusBadgeVariant(row.original.status ?? '') })}>
//           {formatString(row.original.status ?? 'N/A')}
//         </div>
//       ),
//       filterOptions: Status.map((status) => ({ label: status.label, value: status.value }))
//     },
//     {
//       id: 'actions',
//       enableHiding: false,
//       cell: ({ row }) => {
//         const request = row.original;

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <DotsHorizontalIcon className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem onClick={() => handleViewClick(request.id)}>View</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       }
//     }
//   ];