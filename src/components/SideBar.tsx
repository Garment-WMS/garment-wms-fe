import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import control from '@/assets/images/control.png';
import logo from '@/assets/images/warehouse-logo.svg';
import { GoSignOut } from 'react-icons/go';
import { SideBarProps } from '@/constants/interface';
import useLogout from '@/hooks/useLogout';
import SideBarMenuItem from './SideBarMenuItem';

const SideBar: React.FC<SideBarProps> = ({ menu }) => {
  const title = 'Garment Inventory';
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [activeTitle, setActiveTitle] = useState(menu[0]?.title || '');
  const location = useLocation();
  const iconSize = 22;
  const constraintWindowWidth = 800;
  const handleMenuClick = (menuTitle: string) => {
    setActiveTitle(menuTitle);
  };
  const logout = useLogout();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < constraintWindowWidth) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const findActiveMenu = (menuItems: typeof menu) => {
      for (const item of menuItems) {
        if (item.link && currentPath.startsWith(item.link)) {
          return item.title;
        }
        if (item.isGroup && item.children) {
          const activeChild : any= findActiveMenu(item.children);
          if (activeChild) return activeChild;
        }
      }
      return '';
    };
    const activeMenuTitle = findActiveMenu(menu);
    if (activeMenuTitle) {
      setActiveTitle(activeMenuTitle);
    }
  }, [location.pathname, menu]);

  return (
    <div className="flex min-h-screen">
      <div
        className={`${
          open ? 'w-[258px]' : 'w-20'
        } bg-bluePrimary min-h-screen p-5 sticky pt-8 duration-300 ring-1 ring-blue-200`}
      >
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
            className={`text-white origin-left font-semibold text-xl duration-200 font-primary ${
              !open && 'scale-0'
            }`}
          >
            {title}
          </h1>
        </div>
        <div className="pt-2 overflow-y-auto max-h-[calc(100vh-150px)]">
        <ul className="pt-2">
          {menu.map((menuItem, index) => (
            <SideBarMenuItem
              key={index}
              menu={menuItem}
              open={open}
              activeTitle={activeTitle}
              handleMenuClick={handleMenuClick}
            />
          ))}
        </ul>
        <div
          onClick={logout}
          className={`flex font-semibold rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 mt-2
         ${!open && 'justify-center'}`}
        >
          <GoSignOut size={iconSize} />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>Logout</span>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default SideBar;

