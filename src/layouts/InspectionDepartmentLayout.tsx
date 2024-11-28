import SideBar from '@/components/SideBar';
import { MenuProps } from '@/constants/interface';
import { Outlet } from 'react-router-dom';
import TopBar from '@/components/TopBar';
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
import { BiTask } from 'react-icons/bi';

type Props = {};
const iconSize = 22;
const InspectionDepartmentMenu: MenuProps[] = [
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
  },
  {
    title: 'Task',
    renderIcon: <BiTask size={iconSize} />,
    link: '/tasks'
  }
];
const InspectionDepartmentLayout = (props: Props) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row">
      <SideBar menu={InspectionDepartmentMenu} />
      <div className="flex flex-col gap-4 w-full h-full">
        <TopBar />
        <div className="flex-1 p-4 min-h-0 overflow-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InspectionDepartmentLayout;
