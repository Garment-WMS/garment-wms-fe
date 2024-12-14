import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import { MenuProps } from '@/constants/interface';
import React from 'react';
import { LuClipboardCopy } from 'react-icons/lu';
import {
  TbHome,
  TbPackage,
  TbPackageExport,
  TbReceipt,
  TbReceiptRefund,
  TbShirt
} from 'react-icons/tb';
import { Outlet } from 'react-router-dom';
import { MdOutlineInventory } from 'react-icons/md';
import { BiTask } from 'react-icons/bi';
import { PiPackage } from 'react-icons/pi';
import { CgArrowsExchangeAltV } from 'react-icons/cg';

type Props = {};
const iconSize = 22;
const PurchaseStaffMenu: MenuProps[] = [
  {
    title: 'Dashboard',
    renderIcon: <TbHome size={iconSize} />,
    link: '/dashboard'
  },

  {
    title: 'Stocktaking',
    renderIcon: <MdOutlineInventory size={iconSize} />,
    link: '/stocktaking'
  },

  {
    title: 'Import/Export',
    renderIcon: <CgArrowsExchangeAltV size={iconSize} />,
    isGroup: true,
    children: [
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
        title: 'Export request',
        renderIcon: <TbPackageExport size={iconSize} />,
        link: '/export-request'
      },
      {
        title: 'Export Receipt',
        renderIcon: <TbReceiptRefund size={iconSize} />,
        link: '/export-receipt'
      }
    ]
  },
  {
    title: 'Material/Product',
    renderIcon: <PiPackage size={iconSize} />,
    isGroup: true,
    children: [
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
    ]
  },
  {
    title: 'Dispose',
    renderIcon: <BiTask size={iconSize} />,
    link: '/dispose'
  },
  {
    title: 'Task',
    renderIcon: <BiTask size={iconSize} />,
    link: '/tasks'
  }
];
const WarehouseStaffLayout = (props: Props) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row">
      <SideBar menu={PurchaseStaffMenu} />
      <div className="flex flex-col gap-4 w-full h-full">
        <TopBar />
        <div className="flex-1 p-4 min-h-0 overflow-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WarehouseStaffLayout;
