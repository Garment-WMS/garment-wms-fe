// import { useState } from 'react'
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Button } from "@/components/ui/button"
// import { Check, Trash2 } from 'lucide-react'
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger
//   } from '@/components/ui/DropdownMenu';
// import { IoIosNotificationsOutline } from 'react-icons/io';
// interface Notification {
//   id: string
//   title: string
//   message: string
//   type: string
//   createdAt: string
// }

// interface NotificationListProps {
//   notifications: Notification[]

// }

// export function NotificationList({ notifications}: NotificationListProps) {

//   const [expandedNotifications, setExpandedNotifications] = useState<string[]>([])

//   const toggleExpand = (id: string) => {
//     setExpandedNotifications(prev =>
//       prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
//     )
//   }

//   return (
//     <DropdownMenu>
//           <DropdownMenuTrigger>
//             <Button variant="ghost" className="relative rounded-full">
//               <IoIosNotificationsOutline color={blue} size={iconSize} />
//               {notifications?.length > 0 && (
//                 <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
//                   {notifications?.length}
//                 </span>
//               )}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-80" align="end" forceMount>
//             {/* <NotificationList
//               notifications={notifications}
//             /> */}
//             <div className="w-full">
//       <div className="flex justify-between items-center mb-2 px-2">
//         <h3 className="font-semibold text-sm">Notifications</h3>
//         {/* <Button variant="ghost" size="sm" onClick={onClearAll}>Clear all</Button> */}
//       </div>
//       <ScrollArea className="h-[300px]">
//         {notifications?.length === 0 ? (
//           <p className="text-center text-sm text-gray-500 py-4">No notifications</p>
//         ) : (
//           notifications.map((notification) => (
//             <div key={notification.id} className="mb-2 p-2 bg-gray-100 rounded-md">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h4 className="font-medium text-sm">{notification.title}</h4>
//                   <p className={`text-xs ${expandedNotifications.includes(notification.id) ? '' : 'truncate'}`}>
//                     {notification.message}
//                   </p>
//                   {notification.message?.length > 50 && (
//                     <button
//                       onClick={() => toggleExpand(notification.id)}
//                       className="text-xs text-blue-500 mt-1"
//                     >
//                       {expandedNotifications.includes(notification.id) ? 'Show less' : 'Show more'}
//                     </button>
//                   )}
//                 </div>
//                 {/* <div className="flex space-x-1">
//                   <Button variant="ghost" size="icon" onClick={() => onMarkAsRead(notification.id)}>
//                     <Check className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon" onClick={() => onDelete(notification.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div> */}
//               </div>
//               <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString('en-US', {
//   year: 'numeric',
//   month: 'numeric',
//   day: 'numeric',
//   hour: '2-digit',
//   minute: '2-digit',
//   hour12: false // Use 24-hour format
// })}</p>
//             </div>
//           ))
//         )}
//       </ScrollArea>
//     </div>
//           </DropdownMenuContent>
//         </DropdownMenu>

//   )
// }
