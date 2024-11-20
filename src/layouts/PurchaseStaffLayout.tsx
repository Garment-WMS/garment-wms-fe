import SideBar from '@/components/SideBar';
import { MenuProps } from '@/constants/interface';
import { Outlet } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaCalendar } from 'react-icons/fa';
import { GiClothes } from 'react-icons/gi';
import { RiFilePaper2Fill } from 'react-icons/ri';
import TopBar from '@/components/TopBar';

type Props = {};
const iconSize = 22;
const PurchaseStaffMenu: MenuProps[] = [
  {
    title: 'Dashboard',
    renderIcon: <FaHome size={iconSize} />,
    link: '/dashboard'
  },
  {
    title: 'Production Plan',
    renderIcon: <FaCalendar size={iconSize} />,
    link: '/production-plan'
  },

  {
    title: 'Purchase Order',
    renderIcon: <FaBoxOpen size={iconSize} />,
    link: '/purchase-order'
  },
  {
    title: 'Import Request',
    renderIcon: <FaBoxOpen size={iconSize} />,
    link: '/import-request'
  },
  {
    title: 'Product',
    renderIcon: <GiClothes size={iconSize} />,
    link: '/product'
  },
  {
    title: 'Material',
    renderIcon: <GiClothes size={iconSize} />,
    link: '/material-variant'
  },
  {
    title: 'Report',
    renderIcon: <RiFilePaper2Fill size={iconSize} />,
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
