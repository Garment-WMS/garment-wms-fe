import React from 'react'
import { CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import Colors from '@/constants/color'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useGetProfile } from '@/hooks/useGetProfile';
import { Label } from './ui/Label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import placeholder from '@/assets/images/avatar.png';
import useLogout from '@/hooks/useLogout';
type Props = {}

const TopBar = (props: Props) => {
  const logout = useLogout();
  const user = useGetProfile();
    const iconSize = 32;
    const blue = Colors.blue[500];
  return (
    <div className='w-full h-20 pl-6 flex bg-white'>
    
    <div className='w-full flex gap-2 justify-end items-center pr-8'>
    <IoIosNotificationsOutline color={blue} size={iconSize}/>

    <CiSettings color={blue} size={iconSize}/>
    
    <DropdownMenu>
  <DropdownMenuTrigger>
    <Avatar>
      <AvatarImage src={user.avatar || placeholder} alt="@shadcn" />
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent className='mr-12 '>
    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuLabel className='font-medium' >Role: {convertTitleToTitleCase(user.role)}</DropdownMenuLabel>
    <DropdownMenuLabel >Email: {user.email}</DropdownMenuLabel>
    <DropdownMenuLabel >Phone: {user.phone}</DropdownMenuLabel>
    <DropdownMenuItem onClick={logout} className='text-red-500 font-bold'>
      <div className='flex justify-center items-center gap-2'>
        <LogOut />Log out
      </div>
      </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    
    
    </div>
    
    </div>
  )
}

export default TopBar