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
import { Router } from 'react-router-dom';

const RouterComponent: React.FC = () => {
  const router = createBrowserRouter([
    { path: '/', element: <Navigate to="home" /> },

    {
      path: '/home',
      element: <Home />
    },

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
      element: <Login />,
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
              path: '/purchase-staff/import-request/:id',
              element: <ViewImportRequest />
            },
            {
              path: '/purchase-staff/import-request',
              element: <ImportRequestManagement />
            },
            {
              path: '/purchase-staff/home',
              element: <Home />
            },
            {
              path: '/material-variant/:id',
              element: <MaterialDetails/>
            },
            {
              path: '/material-variant/update/:id',
              element: <MaterialVariantUpdate/>
            },
            {
              path: '/material-variant',
              element: <MaterialManagement/>
            },
          ]
        },
        {
          element: <PurchaseStaffLayout />,
          children: [
            {
              path: '/purchase-staff/purchase-order',
              element: <PurchaseOrderManagement />
            },
            {
              path: '/purchase-staff/purchase-order/:id',
              element: <PurchaseOrderDetails />
            },
            {
              path: '/purchase-staff/purchase-order/:poId/po-delivery/:deliveryId',
              element: <PurchaseOrderDeliveryDetails />
            },
            {
              path: '/purchase-staff/import-request/create/material',
              element: <CreateImportRequest />
            },
            {
              path: '/purchase-staff/import-request/create',
              element: <CreateImportRequestMenu />
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
