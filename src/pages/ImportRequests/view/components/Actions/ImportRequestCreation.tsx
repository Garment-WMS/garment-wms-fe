import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Clock, File, FileSpreadsheet, MoreVertical, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import React from 'react';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '@/pages/ImportRequests/slice/selector';

interface Props {
  // define your props here
}

const ImportRequestCreation: React.FC<Props> = (props) => {
  const importRequest: ImportRequest = useSelector(importRequestSelector.importRequest);
  let purchasingStaff = importRequest?.purchasingStaff as any;
  return (
    <Card className="flex flex-col w-full max-w-5xl h-full justify-center">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-2xl">Import Request Creation</CardTitle>
        <p className="text-sm text-muted-foreground">Request #1234</p>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage src={purchasingStaff?.account?.avatarUrl} alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-medium">Created by {purchasingStaff?.account.firstName}</p>
            <p className="text-xs text-muted-foreground">{purchasingStaff?.account.email}</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-4">Request Details</h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="font-medium w-24">Created:</span>
              <span>{purchasingStaff?.account.createdAt}</span>
            </div>
            <div className="flex items-center text-sm">
              <File className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="font-medium w-24">Type:</span>
              <span>May 15, 2023 at 14:30 UTC</span>
            </div>
            <div className="flex items-center text-sm">
              <User className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="font-medium w-24">Assigned:</span>
              <span>Inspection Department</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-4 text-sm border-t pt-6">
        <div className="flex items-center justify-between w-full">
          <span className="text-muted-foreground">
            Request created on May 14, 2023 at 09:30 UTC
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImportRequestCreation;
