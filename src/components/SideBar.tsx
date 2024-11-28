import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import control from '@/assets/images/control.png';
import logo from '@/assets/images/warehouse-logo.svg';
import { GoSignOut } from 'react-icons/go';
import { SideBarProps } from '@/constants/interface';
import useLogout from '@/hooks/useLogout';

const SideBar: React.FC<SideBarProps> = ({ menu }) => {
  const title = 'Garment Storage';
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate('/');
  };
  const [open, setOpen] = useState(true);
  const [activeTitle, setActiveTitle] = useState(menu[0]?.title || '');
  const location = useLocation();
  const iconSize = 22;
  const constraintWindowWidth = 800;
  const handleMenuClick = (menuTitle: string) => {
    setActiveTitle(menuTitle);
  };
  const logout = useLogout();
  // Handle screen resize and collapse sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < constraintWindowWidth) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update activeTitle based on the current URL
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingMenu = menu.find((Menu) => currentPath.startsWith(Menu.link));
  if (matchingMenu) {
    setActiveTitle(matchingMenu.title);
  }
  }, [location.pathname, menu]);

  return (
    <div className="flex min-h-screen">
      <div
        className={` ${
          open ? 'w-[258px]' : 'w-20 '
        } bg-bluePrimary min-h-screen p-5 sticky pt-8 duration-300 ring-1 ring-blue-200`}>
        {window.innerWidth >= constraintWindowWidth && (
          <img
            src={control}
            className={`absolute cursor-pointer -right-3 top-[50px] w-7 border-slate-300
             border-2 rounded-full  ${!open && 'rotate-180'}`}
            onClick={() => setOpen(!open)}
          />
        )}
        <div className="flex gap-x-3 items-center">
          <img src={logo} className={`cursor-pointer duration-500 w-16 h-16 ${open && ''}`} />
          <h1
            className={`text-white origin-left font-semibold text-xl duration-200 font-primary   ${
              !open && 'scale-0'
            }`}>
            {title}
          </h1>
        </div>
        <ul className="pt-6">
          {menu.map((Menu, index) => (
            <Link key={index} to={Menu.link}>
              <li
                key={index}
                className={`flex font-semibold  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-sm items-center gap-x-4 mt-2
                hover:text-white
                ${activeTitle === Menu.title ? 'text-bluePrimary-foreground' : 'text-white'}
               ${activeTitle === Menu.title && 'bg-blue-100 text-primaryDark'} 
              ${!open && 'justify-center'}  
              `}
                onClick={() => handleMenuClick(Menu.title)}>
                {Menu.renderIcon}
                <span className={`${!open && 'hidden'} origin-left duration-200`}>
                  {Menu.title}
                </span>
              </li>
            </Link>
          ))}
        </ul>
        <div
          onClick={logout}
          className={`flex font-semibold  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 mt-2
         ${!open && 'justify-center'}`}>
          <GoSignOut size={iconSize} />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
