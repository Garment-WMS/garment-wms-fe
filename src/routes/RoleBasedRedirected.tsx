import { useGetProfile } from '@/hooks/useGetProfile';
import React from 'react';
import { Navigate } from 'react-router-dom';
interface Props {
  warehouseStaffComponent?: JSX.Element;
  managerComponent?: JSX.Element;
  purchasingStaffComponent?: JSX.Element;
  productionDepartmentComponent?: JSX.Element;
  inspectingDepartmentComponent?: JSX.Element;
  factoryDirectorComponent?: JSX.Element;
}
const RoleBasedRedirect = ({
  warehouseStaffComponent,
  managerComponent,
  purchasingStaffComponent,
  productionDepartmentComponent,
  inspectingDepartmentComponent,
  factoryDirectorComponent
}: Props) => {
  const user = useGetProfile();
  const role = user?.role;
  switch (role) {
    case 'WAREHOUSE_STAFF':
      return warehouseStaffComponent || <Navigate to="/403" />;
    case 'WAREHOUSE_MANAGER':
      return managerComponent || <Navigate to="/403" />;
    case 'PURCHASING_STAFF':
        return purchasingStaffComponent || <Navigate to="/403" />;
    case 'PRODUCTION_DEPARTMENT':
        return productionDepartmentComponent || <Navigate to="/403" />;
    case 'INSPECTING_DEPARTMENT':
        return inspectingDepartmentComponent || <Navigate to="/403" />;
    case 'FACTORY_DIRECTOR':
        return factoryDirectorComponent || <Navigate to="/403" />;
    default:
      return <Navigate to="/403" />;
  }
};

export default RoleBasedRedirect;
