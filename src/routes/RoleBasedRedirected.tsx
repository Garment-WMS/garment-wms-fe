import { useGetProfile } from '@/hooks/useGetProfile';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
      return warehouseStaffComponent || <Navigate to="/403" state={{ from: location }}/>;
    case 'WAREHOUSE_MANAGER':
      return managerComponent || <Navigate to="/403" state={{ from: location }}/>;
    case 'PURCHASING_STAFF':
        return purchasingStaffComponent || <Navigate to="/403"state={{ from: location }} />;
    case 'PRODUCTION_DEPARTMENT':
        return productionDepartmentComponent || <Navigate to="/403" state={{ from: location }}/>;
    case 'INSPECTION_DEPARTMENT':
        return inspectingDepartmentComponent || <Navigate to="/403" state={{ from: location }}/>;
    case 'FACTORY_DIRECTOR':
        return factoryDirectorComponent || <Navigate to="/403" state={{ from: location }}/>;
    default:
      return <Navigate to="/403" state={{ from: location }}/>;
  }
};

export default RoleBasedRedirect;
