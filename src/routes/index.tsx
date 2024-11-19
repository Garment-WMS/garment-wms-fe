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
import ImportReceipt from '@/pages/ImportReceiptDetail';
import { Router } from 'react-router-dom';
import MyTasks from '@/pages/tasks';
import TaskDetailPage from '@/pages/tasks/taskDetails';
import ProductionPlanManagement from '@/pages/Production Plan/management';
import ProductionPlanDetail from '@/pages/Production Plan/detail';
import ImportReceiptList from '@/pages/ImportReceiptList/management';

const RouterComponent: React.FC = () => {
  const router = createBrowserRouter([
    { path: '/', element: <Navigate to="home" /> },

    {
      path: '/demo',
      element: <Demo />
    },

    {
      path: '/test',
      element: <TestPage />
    },
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
              path: '/warehouse-manager/home',
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
              path: '/home',
              element: <Home />
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
            }
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
