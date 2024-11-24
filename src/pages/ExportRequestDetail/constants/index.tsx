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
    state: ['EXPORTING', 'EXPORTED']
  },
  {
    title: 'Production Confirmation',
    state: ['PRODUCTION_APPROVED', 'PRODUCTION_REJECTED']
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
