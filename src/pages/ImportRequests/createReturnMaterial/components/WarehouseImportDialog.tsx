'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Edit } from 'lucide-react';
import { getReturnImportRequest } from '@/api/purchase-staff/importRequestApi';
import Loading from '@/components/common/Loading';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { cn } from '@/lib/utils';

export interface Props {
  setIsNewdelivery: (value: boolean) => void;
  selectedRequest: any;
  setSelectedRequest: (value: any) => void;
  setPoDeliverydetails: (value: any) => void;
  defaultRequestId: string | undefined;
}

function SelectionSummary({
  selectedRequest,
  onEdit
}: {
  selectedRequest: any | null;
  onEdit: () => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2>Selected Material Export Request</h2>
          <Button onClick={onEdit} className="text-sm">
            {selectedRequest ? 'Edit' : 'Select'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Request:</span>
          {selectedRequest ? (
            <Badge variant="outline" className="flex items-center gap-2">
              {selectedRequest.code}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={onEdit}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit Selection</span>
              </Button>
            </Badge>
          ) : (
            <span className="text-muted-foreground">Not selected</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function WarehouseImportDialog({
  selectedRequest,
  setSelectedRequest,
  setPoDeliverydetails,
  setIsNewdelivery,
  defaultRequestId
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [rejectedRequests, setRejectedRequests] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleConfirm = (request: any) => {
    setSelectedRequest(request);
    setPoDeliverydetails(request.materialExportRequestDetail);
    setIsNewdelivery(true);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchRejectedRequests = async () => {
      try {
        setLoading(true);
        const response = await getReturnImportRequest();
        setRejectedRequests(response.data);
        if (defaultRequestId) {
          const selectedRequest = response.data.find((req: any) => req.id === defaultRequestId);
          if (selectedRequest) {
            setSelectedRequest(selectedRequest);
            setPoDeliverydetails(selectedRequest.materialExportRequestDetail);
          }
        }
      } catch (err) {
        console.error('Failed to fetch rejected requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedRequests();
  }, [defaultRequestId, setSelectedRequest, setPoDeliverydetails]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <Loading />
        </div>
      );
    }
    return (
      <ScrollArea className="h-[300px] w-full rounded-md border">
        <div className="p-4 space-y-4">
          {rejectedRequests.map((request) => (
            <Card
              key={request.id}
              className={cn(
                'transition-colors duration-200 cursor-pointer',
                selectedRequest?.id === request.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-accent'
              )}
              onClick={() => setSelectedRequest(request)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{request.code}</CardTitle>
                <Badge variant="destructive" className="ml-auto">
                  {convertTitleToTitleCase(request.status)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Ready for import</span>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  Created: {new Date(request.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Production Batch: {request.productionBatch?.code || 'N/A'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="space-y-4">
      <SelectionSummary selectedRequest={selectedRequest} onEdit={() => setIsOpen(true)} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Select Rejected Material Export Request</DialogTitle>
          </DialogHeader>
          {renderContent()}
          <DialogFooter className="flex justify-end">
            <Button onClick={() => handleConfirm(selectedRequest)} disabled={!selectedRequest}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
