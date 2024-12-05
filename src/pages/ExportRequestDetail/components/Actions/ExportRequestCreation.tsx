import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, File, FileSpreadsheet, MoreVertical, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import { useSelector } from 'react-redux';

import { MaterialExportRequest } from '@/types/exportRequest';
import exportRequestSelector from '../../slice/selector';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { convertDate } from '@/helpers/convertDate';

interface Props {
  // define your props here
}

const ExportRequestCreation: React.FC<Props> = (props) => {
  const importRequest: MaterialExportRequest = useSelector(exportRequestSelector.exportRequest);
  let productionDepartment = importRequest?.productionDepartment as any;
  return (
    <Card className="flex flex-col w-full max-w-5xl h-full justify-center">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-2xl">Export Request Creation</CardTitle>
        <p className="text-sm text-muted-foreground">Request #{importRequest?.code}</p>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0">
          {productionDepartment ? (
            <>
              <Avatar className="w-20 h-20 mb-4">
                <AvatarImage src={productionDepartment?.account?.avatarUrl} alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Created by {productionDepartment?.account.firstName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {productionDepartment?.account.email}
                </p>
              </div>
            </>
          ) : (
            <div>Not found production department</div>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-4">Request Details</h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="font-medium w-24">Created:</span>
              <span>{new Date(productionDepartment?.account.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-sm">
              <File className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="font-medium w-24">Type:</span>
              Export Material for Production
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-4 text-sm border-t pt-6">
        <div className="flex items-center justify-between w-full">
          <span className="text-muted-foreground">
            Request created on {convertDate(importRequest?.createdAt)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExportRequestCreation;
