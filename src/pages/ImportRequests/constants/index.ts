export const importRequestStatusList = [
  {
    title: 'At Depot',
    state: ['ARRIVED']
  },
  {
    title: 'Import request approval',
    state: ['REJECTED', 'CANCELLED', 'APPROVED']
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
  'CANCELLED',
  'REJECTED',
  'APPROVED',
  'INSPECTING',
  'INSPECTED',
  'AWAIT_TO_IMPORT',
  'IMPORTING',
  'IMPORTED'
];
