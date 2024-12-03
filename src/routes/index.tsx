import ProductionStaffLayout from '@/layouts/ProductionStaffLayout';
import PurchaseStaffLayout from '@/layouts/PurchaseStaffLayout';
import WarehouseManagerLayout from '@/layouts/WarehouseManagerLayout';
import WarehouseStaffLayout from '@/layouts/WarehouseStaffLayout';
import TestPage from '@/pages/test';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ProductionStaffRoute from './ProductionStaffRoute';
import ImportPurchaseOrder from '@/pages/demoPO';

import PurchaseOrderManagement from '@/pages/Purchase Order/management';
import StepperDemo from '@/pages/demoStepper';
import PurchaseOrderDetails from '@/pages/Purchase Order/detail';
import PurchaseOrderDeliveryDetails from '@/pages/Purchase Order Delivery/detail';
import CreateImportRequest from '@/pages/ImportRequests/create';
import CreateImportRequestMenu from '@/pages/ImportRequests/menu';

import Loading from '@/components/common/Loading';
import ImportRequestManagement from '@/pages/ImportRequests/management';
import ViewImportRequest from '@/pages/ImportRequests/view';
import MaterialDetails from '@/pages/Material/MaterialDetails';
import MaterialVariantUpdate from '@/pages/Material/update';
import MaterialManagement from '@/pages/Material/management';
import Login from '@/pages/login';
import Home from '@/pages/home';
import StocktakingManagement from '@/pages/Stocktaking/management';
import StocktakingDetails from '@/pages/Stocktaking/details';
import CreateDynamicPlan from '@/pages/StocktakingPlan/create/CreateDynamicPlan';
import CreateStocktakingPlan from '@/pages/StocktakingPlan/create';
import CreateOverallPlan from '@/pages/StocktakingPlan/create/CreateOverallPlan';
import StocktakingPlanDetails from '@/pages/StocktakingPlan/details';
import WarehouseStaffStocktakingManagement from '@/pages/WarehouseStaff/Stocktaking/management';
import WarehousestaffStocktakingDetails from '@/pages/WarehouseStaff/Stocktaking/details';
import WarehouseStaffStocktakingPlanDetails from '@/pages/WarehouseStaff/StocktakingPlan/details';
import RoleBasedRedirect from './RoleBasedRedirected';
import ImportReceipt from '@/pages/ImportReceiptDetail';
import MyTasks from '@/pages/tasks';
import TaskDetailPage from '@/pages/tasks/taskDetails';
import ProductionPlanManagement from '@/pages/Production Plan/management';
import ProductionPlanDetail from '@/pages/Production Plan/detail';
import ImportReceiptList from '@/pages/ImportReceiptList/management';
import CreateExportRequest from '@/pages/ExportRequest';
import ViewExportRequest from '@/pages/ExportRequestDetail';
import InspectionRequestDetails from '@/pages/Inspection Report/detail';
import InspectionRequestManagement from '@/pages/Inspection Report/management';
import CreateImportRequestProduct from '@/pages/ImportRequests/createImportProduct';
import ProductManagement from '@/pages/Product/Management';
import ProductVariantDetails from '@/pages/Product/Details';
import ProductionBatchManagement from '@/pages/Production Batch/management';
import RoleBasedLayoutMiddleware from '@/components/authentication/roleBasedLayoutMiddleware';
import InspectionDepartmentLayout from '@/layouts/InspectionDepartmentLayout';
import FactoryDirectorLayout from '@/layouts/FactoryDirectorLayout';
import ExportReceiptList from '@/pages/ExportReceiptList/management';
import ExportReceiptDetail from '@/pages/ExportReceiptDetail';
import NotfoundPage from '@/pages/404';
import TaskManagers from '@/pages/Task Manager';
import TaskDetailManagingPage from '@/pages/Task Manager/taskDetails';
import WarehouseStaffImportRequestManagement from '@/pages/WarehouseStaff/ImportRequests/management';
import WarehouseStaffImportReceiptList from '@/pages/WarehouseStaff/ImportReceiptList/management';
import ExportRequestList from '@/pages/ExportRequestList/management';
import WarehouseStaffExportRequestList from '@/pages/WarehouseStaff/ExportRequestList/management';
import { Scheduler } from '@/pages/demo';
import ProductionBatchDetail from '@/pages/Production Batch/detail';
import WarehouseStaffManagement from '@/pages/WarehouseStaff/Management';
import WarehouseStaffDetai from '@/pages/WarehouseStaff/Detail';
import WarehouseStaffDetail from '@/pages/WarehouseStaff/Detail';
import CreateMaterialVariant from '@/pages/Material/create';
import CreateProductVariant from '@/pages/Product/Create';
import WarehouseStaffExportReceiptList from '@/pages/WarehouseStaff/ExportReceiptList/management';

const RouterComponent: React.FC = () => {
  const router = createBrowserRouter([
    // { path: '/', element: <Navigate to="home" /> },
    {
      path: '/',
      element: (
        <RoleBasedLayoutMiddleware
          fallbackPath="/unauthorized"
          roleLayouts={{
            WAREHOUSE_MANAGER: WarehouseManagerLayout,
            WAREHOUSE_STAFF: WarehouseStaffLayout,
            PURCHASING_STAFF: PurchaseStaffLayout,
            PRODUCTION_DEPARTMENT: ProductionStaffLayout,
            INSPECTION_DEPARTMENT: InspectionDepartmentLayout,
            FACTORY_DIRECTOR: FactoryDirectorLayout
          }}
        />
      ),
      children: [
        // Manager-specific routes (e.g., warehouse manager)
        // {
        //   path: '/',
        //   element: <Home />,
        // },

        {
          path: '/dashboard',
          element: <Home />
        },
        {
          path: '/stocktaking',
          element: (
            <RoleBasedRedirect
              managerComponent={<StocktakingManagement />}
              warehouseStaffComponent={<WarehouseStaffStocktakingManagement />}
            />
          )
        },
        {
          path: '/stocktaking/:id',
          element: (
            <RoleBasedRedirect
              managerComponent={<StocktakingDetails />}
              warehouseStaffComponent={<WarehousestaffStocktakingDetails />}
            />
          )
        },
        {
          path: '/stocktaking/plan/:id',
          element: (
            <RoleBasedRedirect
              managerComponent={<StocktakingPlanDetails />}
              warehouseStaffComponent={<WarehouseStaffStocktakingPlanDetails />}
            />
          )
        },
        {
          path: '/stocktaking/plan/create',
          element: <RoleBasedRedirect managerComponent={<CreateStocktakingPlan />} />
        },
        {
          path: '/stocktaking/plan/create/dynamic',
          element: <RoleBasedRedirect managerComponent={<CreateDynamicPlan />} />
        },
        {
          path: '/stocktaking/plan/create/overall',
          element: <RoleBasedRedirect managerComponent={<CreateOverallPlan />} />
        },
        {
          path: '/import-request/:id',
          element: <ViewImportRequest />
        },
        {
          path: '/import-request',
          element: (
            <RoleBasedRedirect
              managerComponent={<ImportRequestManagement />}
              warehouseStaffComponent={<WarehouseStaffImportRequestManagement />}
              factoryDirectorComponent={<ImportRequestManagement />}
              inspectingDepartmentComponent={<ImportRequestManagement />}
              productionDepartmentComponent={<ImportRequestManagement />}
              purchasingStaffComponent={<ImportRequestManagement />}
            />
          )
          // element: <ImportRequestManagement />
        },
        {
          path: '/demo',
          element: <Scheduler />
        },
        {
          path: '/import-request/create',
          element: <CreateImportRequestMenu />
        },
        {
          path: '/import-request/create/material',
          element: <CreateImportRequest />
        },
        {
          path: '/import-request/create/material/:id',
          element: <CreateImportRequest />
        },
        {
          path: '/import-request/create/product',
          element: <CreateImportRequestProduct />
        },
        {
          path: '/export-request',
          element: (
            <RoleBasedRedirect
              managerComponent={<ExportRequestList />}
              warehouseStaffComponent={<WarehouseStaffExportRequestList />}
              factoryDirectorComponent={<ExportRequestList />}
              inspectingDepartmentComponent={<ExportRequestList />}
              productionDepartmentComponent={<ExportRequestList />}
              purchasingStaffComponent={<ExportRequestList />}
            />
          )
          // element: <ExportRequestList />
        },
        {
          path: '/export-request/:id',
          element: <ViewExportRequest />
        },
        {
          path: '/tasks',
          element: <MyTasks />
        },
        {
          path: '/tasks-management',
          element: <TaskManagers />
        },
        {
          path: '/tasks-management-detail/:id',
          element: <TaskDetailManagingPage />
        },
        {
          path: '/tasks-management/:id',
          element: <TaskManagers />
        },
        {
          path: '/tasks/:id',
          element: <TaskDetailPage />
        },
        {
          path: '/import-receipt/:id',
          element: <ImportReceipt />
        },
        {
          path: '/import-receipt',
          element: (
            <RoleBasedRedirect
              managerComponent={<ImportReceiptList />}
              warehouseStaffComponent={<WarehouseStaffImportReceiptList />}
              productionDepartmentComponent={<ImportReceiptList />}
              purchasingStaffComponent={<ImportReceiptList />}
              inspectingDepartmentComponent={<ImportReceiptList />}
              factoryDirectorComponent={<ImportReceiptList />}
            />
          )
          // element: <ImportReceipt />
        },
        {
          path: '/export-receipt/:id',
          element: <ExportReceiptDetail />
        },
        {
          path: '/export-receipt/',
          element: (
            <RoleBasedRedirect
              managerComponent={<ExportReceiptList />}
              warehouseStaffComponent={<WarehouseStaffExportReceiptList />}
              productionDepartmentComponent={<ExportReceiptList />}
              purchasingStaffComponent={<ExportReceiptList />}
              inspectingDepartmentComponent={<ExportReceiptList />}
              factoryDirectorComponent={<ExportReceiptList />}
            />
          )
          // element: <ExportReceiptList />
        },
        {
          path: '/material-variant/:id',
          element: <MaterialDetails />
        },
        {
          path: '/material-variant/update/:id',
          element: <MaterialVariantUpdate />
        },
        {
          path: '/material-variant',
          element: <MaterialManagement />
        },
        {
          path: '/material-variant/create',
          element: <CreateMaterialVariant />
        },
        {
          path: '/product-variant',
          element: <ProductManagement />
        },
        {
          path: '/product-variant/create',
          element: <CreateProductVariant />
        },
        {
          path: '/product-variant/:id',
          element: <ProductVariantDetails />
        },
        {
          path: '/purchase-order',
          element: <PurchaseOrderManagement />
        },
        {
          path: '/purchase-order/:id',
          element: <PurchaseOrderDetails />
        },
        {
          path: '/purchase-order/:poId/po-delivery/:deliveryId',
          element: <PurchaseOrderDeliveryDetails />
        },
        {
          path: '/production-plan',
          element: <ProductionPlanManagement />
        },
        {
          path: '/production-plan/:id',
          element: <ProductionPlanDetail />
        },
        {
          path: '/export-request/create',
          element: <CreateExportRequest />
        },
        {
          path: '/export-request/:id',
          element: <ViewExportRequest />
        },
        { path: '/report', element: <InspectionRequestManagement /> },
        {
          path: '/report/:id',
          element: <InspectionRequestDetails />
        },
        // { path: '/production-batch', element: <ProductionBatchManagement /> },
        {
          path: '/production-batch',
          element: (
            <RoleBasedRedirect
              purchasingStaffComponent={<ProductionBatchManagement />}
              productionDepartmentComponent={<ProductionBatchManagement />}
              managerComponent={<ProductionBatchManagement />}
            />
          )
        },
        { path: '/production-batch/:id', element: <ProductionBatchDetail /> },
        {
          path: '/warehouse-staff',
          element: <RoleBasedRedirect managerComponent={<WarehouseStaffManagement />} />
        },
        {
          path: '/warehouse-staff/:id',
          element: <WarehouseStaffDetail />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/unauthorized',
      element: <NotfoundPage />
    },

    { path: '*', element: <NotfoundPage /> }
  ]);
  return <RouterProvider fallbackElement={<Loading />} router={router} />;
};
export default RouterComponent;
