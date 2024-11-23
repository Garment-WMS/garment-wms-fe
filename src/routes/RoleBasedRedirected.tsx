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
      return warehouseStaffComponent;
    case 'WAREHOUSE_MANAGER':
      return managerComponent;
    case 'PURCHASING_STAFF':
        return purchasingStaffComponent;
    case 'PRODUCTION_DEPARTMENT':
        return productionDepartmentComponent;
    case 'INSPECTING_DEPARTMENT':
        return inspectingDepartmentComponent;
    case 'FACTORY_DIRECTOR':
        return factoryDirectorComponent;
    default:
      return <Navigate to="/login" />;
  }
};

export default RoleBasedRedirect;
