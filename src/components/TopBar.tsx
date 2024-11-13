import React from 'react'
import { CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import Colors from '@/constants/color'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Props = {}

const TopBar = (props: Props) => {
    const iconSize = 32;
    const blue = Colors.blue[500];
  return (
    <div className='w-full h-20 pl-6 flex bg-white'>
    
    <div className='w-full flex gap-2 justify-end items-center pr-4'>
    <IoIosNotificationsOutline color={blue} size={iconSize}/>

    <CiSettings color={blue} size={iconSize}/>
    
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    </div>
    
    </div>
  )
}

export default TopBar