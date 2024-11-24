import ProductionStaffLayout from '@/layouts/ProductionStaffLayout';
import PurchaseStaffLayout from '@/layouts/PurchaseStaffLayout';
import WarehouseManagerLayout from '@/layouts/WarehouseManagerLayout';
import WarehouseStaffLayout from '@/layouts/WarehouseStaffLayout';
import TestPage from '@/pages/test';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ProductionStaffRoute from './ProductionStaffRoute';
import ImportPurchaseOrder from '@/pages/demoPO';
import Demo from '@/pages/demo';
import PurchaseOrderManagement from '@/pages/Purchase Order/management';
import StepperDemo from '@/pages/demoStepper';
import PurchaseOrderDetails from '@/pages/Purchase Order/detail';
import PurchaseOrderDeliveryDetails from '@/pages/Purchase Order Delivery/detail';
import CreateImportRequest from '@/pages/ImportRequests/create';
import CreateImportRequestMenu from '@/pages/ImportRequests/menu';
import PurchaseStaffRoute from './PurchaseStaffRoute';
import WarehouseManagerRoute from './WarehouseManagerRoute';
import WarehouseStaffRoute from './WarehouseStaffRoute';

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
import CreateInventoryReport from '@/pages/Stocktaking/create';
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
import ExportRequestList from '@/pages/ExportRequestList/management';
import ProductionBatchManagement from '@/pages/Production Batch/management';
import ExportReceiptDetail from '@/pages/ExportReceiptDetail';
import ExportReceiptList from '@/pages/ExportReceiptList/management';

const RouterComponent: React.FC = () => {
  const router = createBrowserRouter([
    { path: '/', element: <Navigate to="login" /> },

    {
      path: '/login',
      element: <Login />
    },
    {
      element: <WarehouseManagerRoute />,
      children: [
        {
          element: <WarehouseManagerLayout />,
          children: [
            {
              path: '/home',
              element: <Home />
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <WarehouseStaffRoute />,
      children: [
        {
          element: <WarehouseStaffLayout />,
          children: [
            {
              path: '/warehouse-staff/home',
              element: <Home />
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <PurchaseStaffRoute />,
      children: [
        {
          element: <PurchaseStaffLayout />,
          children: [
            {
              path: '/import-request/:id',
              element: <ViewImportRequest />
            },
            {
              path: '/import-request',
              element: <ImportRequestManagement />
            },
            {
              path: '/export-request',
              element: <ExportRequestList />
            },
            {
              path: '/export-request/:id',
              element: <ViewExportRequest />
            },
            {
              path: '/home',
              element: <MyTasks />
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
              path: '/warehouse-staff/stocktaking/plan/:id',
              element: <WarehouseStaffStocktakingPlanDetails />
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
            // {
            //   path: '/stocktaking/create',
            //   element: <CreateInventoryReport/>
            // },
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
              path: '/tasks',
              element: <MyTasks />
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
              path: '/import-receipt/',
              element: <ImportReceiptList />
            },
            {
              path: '/export-receipt/:id',
              element: <ExportReceiptDetail />
            },
            {
              path: '/export-receipt/',
              element: <ExportReceiptList />
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
              path: '/product-variant',
              element: <ProductManagement />
            },
            {
              path: '/product-variant/:id',
              element: <ProductVariantDetails />
            },
            {
              path: '/dashboard',
              element: <Home />
            }
          ]
        },
        {
          element: <PurchaseStaffLayout />,
          children: [
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
              path: '/import-request/create',
              element: <CreateImportRequestMenu />
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
            { path: '/production-batch', element: <ProductionBatchManagement /> }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <ProductionStaffRoute />,
      children: [
        {
          element: <ProductionStaffLayout />,
          children: [
            {
              path: '/production-staff/home',
              element: <Home />
            }
          ]
        }
      ]
    },

    {
      path: '/PODemo',
      element: <ImportPurchaseOrder />
    },

    {
      path: '/stepperdemo',
      element: <StepperDemo />
    }

    // { path: '*', element: <ErrorPage /> },
  ]);
  return <RouterProvider fallbackElement={<Loading />} router={router} />;
};
export default RouterComponent;
