import React from 'react';
import { useGetProfile } from '@/hooks/useGetProfile';

enum RoleCode {
  ADMIN = 'ADMIN',
  WAREHOUSE_STAFF = 'WAREHOUSE_STAFF',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  FACTORY_DIRECTOR = 'FACTORY_DIRECTOR',
  INSPECTION_DEPARTMENT = 'INSPECTION_DEPARTMENT',
  PRODUCTION_DEPARTMENT = 'PRODUCTION_DEPARTMENT',
  PURCHASING_STAFF = 'PURCHASING_STAFF'
}

interface RoleGuardProps {
  children: React.ReactNode;
  className?: string; // Add className for styling
}

const createRoleGuard = (requiredRole: RoleCode) => {
  const RoleGuard: React.FC<RoleGuardProps> = ({ children, className }) => {
    const user = useGetProfile();

    if (!user || user.role !== requiredRole) {
      return null; // Render nothing if the role doesn't match
    }

    return <div className={className}>{children}</div>; // Apply className to the wrapper div
  };

  return RoleGuard;
};

// Create separate components for each role
export const AdminGuardDiv = createRoleGuard(RoleCode.ADMIN);
export const WarehouseStaffGuardDiv = createRoleGuard(RoleCode.WAREHOUSE_STAFF);
export const WarehouseManagerGuardDiv = createRoleGuard(RoleCode.WAREHOUSE_MANAGER);
export const FactoryDirectorGuardDiv = createRoleGuard(RoleCode.FACTORY_DIRECTOR);
export const InspectionDepartmentGuardDiv = createRoleGuard(RoleCode.INSPECTION_DEPARTMENT);
export const ProductionDepartmentGuardDiv = createRoleGuard(RoleCode.PRODUCTION_DEPARTMENT);
export const PurchasingStaffGuardDiv = createRoleGuard(RoleCode.PURCHASING_STAFF);
