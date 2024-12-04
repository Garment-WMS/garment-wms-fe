export const importRequestStatusList = [
  {
    title: 'Request created',
    state: ['PENDING']
  },
  {
    title: 'Request approval',
    state: ['REJECTED', 'CANCELLED', 'APPROVED']
  },
  {
    title: 'Material Delivery',
    state: ['EXPORTING', 'EXPORTED']
  },
  {
    title: 'Goods Export Confirmation',
    state: ['PRODUCTION_APPROVED', 'PRODUCTION_REJECTED']
  }
];
export const statusOrder = [
  'PENDING',
  'CANCELLED',
  'REJECTED',
  'APPROVED',
  'DELIVERING',
  'DELIVERED',
  'PRODUCTION_APPROVED',
  'PRODUCTION_REJECTED',
  'RETURNED'
];
