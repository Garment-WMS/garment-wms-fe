export const importRequestStatusList = [
  {
    title: 'At Depot',
    state: ['ARRIVED']
  },
  {
    title: 'Import request approval',
    state: ['REJECTED', 'CANCELED', 'APPROVED']
  },
  {
    title: 'In Inspection',
    state: ['INSPECTING', 'INSPECTED']
  },

  {
    title: 'Import To Warehouse',
    state: ['IMPORTING', 'IMPORTED']
  }
];
export const statusOrder = [
  'ARRIVED',
  'CANCELED',
  'REJECTED',
  'APPROVED',
  'INSPECTING',
  'INSPECTED',
  'IMPORTING',
  'IMPORTED'
];
