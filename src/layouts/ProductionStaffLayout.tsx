import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  TbCalendarCog,
  TbClipboardData,
  TbHome,
  TbPackage,
  TbShirt,
  TbShoppingCartCog,
  TbReceipt,
  TbPackageExport,
  TbReceiptRefund 
} from 'react-icons/tb';
import { LuClipboardCopy, LuContainer } from 'react-icons/lu';
import { MenuProps } from '@/constants/interface';
import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
type Props = {};
const iconSize = 22;
const ProductionStaffMenu: MenuProps[] = [
  {
    title: 'Dashboard',
    renderIcon: <TbHome size={iconSize} />,
    link: '/dashboard'
  },
  {
    title: 'Import Request',
    renderIcon: <LuClipboardCopy size={iconSize} />,
    link: '/import-request'
  },
  {
    title: 'Import Receipt',
    renderIcon: <TbReceipt size={iconSize} />,
    link: '/import-receipt'
  },

  {
    title: 'Material',
    renderIcon: <TbPackage size={iconSize} />,
    link: '/material-variant'
  },
  {
    title: 'Product',
    renderIcon: <TbShirt size={iconSize} />,
    link: '/product-variant'
  },
  {
    title: 'Report',
    renderIcon: <TbClipboardData size={iconSize} />,
    link: '/report'
  }
];
const ProductionStaffLayout = (props: Props) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row">
    <SideBar menu={ProductionStaffMenu} />
    <div className="flex flex-col gap-4 w-full h-full">
      <TopBar />
      <div className="flex-1 p-4 min-h-0 overflow-scroll">
        <Outlet />
      </div>
    </div>
  </div>
);
};

export default ProductionStaffLayout;
