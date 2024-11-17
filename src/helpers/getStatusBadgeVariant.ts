export const getStatusBadgeVariant = (value: string, Status:any[]) => {
    const statusObj = Status.find((s) => s.value === value);
    return statusObj ? statusObj.variant : 'default'; // Default variant if no match is found
  };
  