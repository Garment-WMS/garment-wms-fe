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
  TbShoppingCartCog
} from 'react-icons/tb';
import { LuClipboardCopy, LuContainer } from 'react-icons/lu';
import { GiRolledCloth } from 'react-icons/gi';

type Props = {};
const iconSize = 22;
const PurchaseStaffMenu: MenuProps[] = [
  {
    title: 'Dashboard',
    renderIcon: <TbHome size={iconSize} />,
    link: '/dashboard'
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
    title: 'Import Request',
    renderIcon: <LuClipboardCopy size={iconSize} />,
    link: '/import-request'
  },
  {
    title: 'Product',
    renderIcon: <TbPackage size={iconSize} />,
    link: '/product-variant'
  },
  {
    title: 'Material',
    renderIcon: <GiRolledCloth size={iconSize} />,
    link: '/material-variant'
  },
  {
    title: 'Report',
    renderIcon: <TbClipboardData size={iconSize} />,
    link: '/report'
  }
];
const PurchaseStaffLayout = (props: Props) => {
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

export default PurchaseStaffLayout;
