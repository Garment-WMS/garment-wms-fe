export const importRequestStatusList = [
  {
    title: 'At Depot',
    state: ['ARRIVED']
  },
  {
    title: 'In Inspection',
    state: ['INSPECTING', 'INSPECTED']
  },
  {
    title: 'Waiting for approval',
    state: ['PENDING', 'CANCELED', 'REJECTED', 'APPROVED']
  },
  {
    title: 'Import To Warehouse',
    state: ['IMPORTING', 'IMPORTED']
  }
];
