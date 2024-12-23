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
import { MenuProps } from '@/constants/interface';
import { LuClipboardCopy, LuContainer } from 'react-icons/lu';
import SideBar from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import { MdOutlineInventory } from 'react-icons/md';
import { BiTask } from 'react-icons/bi';
import { PiPackage } from 'react-icons/pi';
import { CgArrowsExchangeAltV } from 'react-icons/cg';
import { GrUserWorker } from 'react-icons/gr';
import { RiDeleteBin5Line } from "react-icons/ri";

type Props = {};
const iconSize = 22;
const WarehouseManagerMenu: MenuProps[] = [
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
    title: 'Production Plan',
    renderIcon: <TbCalendarCog size={iconSize} />,
    link: '/production-plan'
  },
  {
    title: 'Production Batch',
    renderIcon: <LuContainer size={iconSize} />,
    link: '/production-batch'
  },
  {
    title: 'Purchase Order',
    renderIcon: <TbShoppingCartCog size={iconSize} />,
    link: '/purchase-order'
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
      }
    ]
  },

  {
    title: 'Inspection Report',
    renderIcon: <TbClipboardData size={iconSize} />,
    link: '/report'
  },
  {
    title: 'Task Management',
    renderIcon: <BiTask size={iconSize} />,
    link: '/tasks-management'
  },
  {
    title: 'Dispose',
    renderIcon: <RiDeleteBin5Line  size={iconSize} />,
    link: '/dispose'
  },
  {
    title: 'Staff Management',
    renderIcon: <GrUserWorker size={iconSize} />,
    link: '/warehouse-staff'
  }
];
const WarehouseManagerLayout = (props: Props) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row">
      <SideBar menu={WarehouseManagerMenu} />
      <div className="flex flex-col gap-4 w-full h-full">
        <TopBar />
        <div className="flex-1 p-4 min-h-0 overflow-scroll w-[100%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WarehouseManagerLayout;
