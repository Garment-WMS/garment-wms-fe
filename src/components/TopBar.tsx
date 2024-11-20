import { CiSettings } from 'react-icons/ci';
import { IoIosNotificationsOutline } from 'react-icons/io';
import Colors from '@/constants/color';
import { IoIosQrScanner } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useGetProfile } from '@/hooks/useGetProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import placeholder from '@/assets/images/avatar.png';
import useLogout from '@/hooks/useLogout';
import ScannerPopup from './ScannerPopup';
type Props = {};

const TopBar = (props: Props) => {
  const logout = useLogout();
  const user = useGetProfile();
  const iconSize = 32;
  const blue = Colors.blue[500];
  return (
    <div className="w-full h-20 pl-6 flex bg-white">
      <div className="w-full flex gap-2 justify-end items-center pr-8">
        <ScannerPopup />
        <IoIosNotificationsOutline color={blue} size={iconSize} />
        <CiSettings color={blue} size={iconSize} />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || placeholder} alt="Profile picture" />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-lg font-medium leading-none">{user.name}</p>
                  <p className="text-sm leading-none text-muted-foreground">
                    {convertTitleToTitleCase(user.role)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <div className="flex flex-col space-y-1">
                    <p className="leading-none">Contact Information</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Avatar className="h-10 w-10">
            <AvatarImage src={placeholder} alt="Profile picture" />
            <AvatarFallback>KT</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default TopBar;
