import { Outlet, ScrollRestoration } from 'react-router-dom';

const PurchaseStaffRoute = () => {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
};

export default PurchaseStaffRoute;
