export const importRequestStatusList = [
  {
    title: 'Request created',
    state: ['PENDING']
  },
  {
    title: 'Request approval',
    state: ['REJECTED', 'CANCELED', 'APPROVED']
  },
  {
    title: 'Material Delivery',
    state: ['IMPORTING', 'IMPORTED']
  },
  {
    title: 'Production Confirmation',
    state: ['IMPORTING', 'IMPORTED']
  }
];
export const statusOrder = [
  'PENDING',
  'CANCELED',
  'REJECTED',
  'APPROVED',
  'DELIVERING',
  'DELIVERED',
  'PRODUCTION_APPROVED',
  'PRODUCTION_REJECTED',
  'RETURNED'
];
