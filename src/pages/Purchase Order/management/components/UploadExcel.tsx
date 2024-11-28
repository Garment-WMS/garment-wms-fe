import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/Dialog';
import { ArrowLeft, CircleCheckBig, FileUp, Import, Trash, XCircle } from 'lucide-react';
import Colors from '@/constants/color';
import ExcelIcon from '@/assets/images/ExcelFile_Icon.png';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Step, Stepper } from 'react-form-stepper';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { importPurchaseOrder } from '@/api/services/purchaseOrder';
import Loading from '@/components/common/Loading';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useGetAllProductionPlans } from '@/hooks/useGetAllProductionPlan';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/card';
import { convertDate } from '@/helpers/convertDate';
import { ProductionPlan } from '@/types/ProductionPlan';
import { ProductionPlanStatus, ProductionPlanStatusLabels } from '@/enums/productionPlan';

const MAX_FILE_SIZE_KB = 500;

type UploadExcelProps = {
  fileName: string;
  triggerButtonLabel?: string;
};

const statusColors = {
  [ProductionPlanStatus.PLANNING]: 'bg-blue-500 text-white',
  [ProductionPlanStatus.IN_PROGRESS]: 'bg-yellow-500 text-black',
  [ProductionPlanStatus.FINISHED]: 'bg-green-500 text-white'
};

const errorMessages = {
  invalidFileType: {
    statusCode: 400,
    message: 'Invalid file format',
    clientMessage: 'The file type is invalid. Please upload a valid Excel (.xlsx) file.'
  },
  invalidFormat: {
    statusCode: 415,
    message: 'Invalid format',
    clientMessage:
      'The uploaded file format does not match the required template. Please use the correct template and try again.'
  },
  invalidPOInfoHeader: {
    statusCode: 415,
    message: 'Invalid format, POInfo table header is invalid',
    clientMessage: 'The uploaded file contains invalid data. The POInfo table header is incorrect.'
  },
  invalidProductionPlan: {
    statusCode: 415,
    message: 'Invalid Production Plan, the production plan is not available',
    clientMessage: 'The uploaded file contains invalid Production Plan.'
  },
  errorInFile: {
    message: 'There is error in the file',
    clientMessage:
      'We found issues in the uploaded file. <a href="{errors}" target="_blank" class="underline text-blue-600">Click here</a> to download the file with errors and correct them.'
  }
};

const UploadExcel: React.FC<UploadExcelProps> = ({ fileName, triggerButtonLabel = 'Import' }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [poId, setPoID] = useState<string | null>(null);
  const [poNumber, setPoNumber] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<ProductionPlan>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 2
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    processFile(file);
  };

  const handleBackToStep1 = () => {
    setActiveStep(0);
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file: File | null) => {
    if (file) {
      setUploadError(null);
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > MAX_FILE_SIZE_KB) {
        setUploadError(`The file must not be over ${MAX_FILE_SIZE_KB} KB`);
        return;
      }
      setSelectedFile(file);
      setIsUploading(true);
      setActiveStep(0);
      uploadFileToServer(file);
    }
  };

  const uploadFileToServer = async (file: File) => {
    // if (!selectedPlan) {
    //   setUploadError('Please select a production plan.');
    //   return;
    // }
    try {
      const response = await importPurchaseOrder(file, 'selectedPlan.id');
      console.log(response);
      if (response.statusCode !== 200 && response.statusCode !== 201) {
        handleUploadErrors(response);
        setActiveStep(0);
      } else {
        setIsUploadComplete(true);
        setActiveStep(1);
        if (response.data?.id) {
          setPoID(response.data?.id);
        }
        if (response?.data?.poNumber) {
          setPoNumber(response?.data?.poNumber);
        }
        console.log('Import success ');
        console.log(response.data);
      }
    } catch (error: any) {
      setUploadError('Failed to upload file. Please try again.');
      setActiveStep(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadErrors = (response: any) => {
    if (
      response.statusCode === errorMessages.invalidFileType.statusCode &&
      response.message === errorMessages.invalidFileType.message
    ) {
      setUploadError(errorMessages.invalidFileType.message);
    } else if (
      response.statusCode === errorMessages.invalidFormat.statusCode &&
      response.message === errorMessages.invalidFormat.message
    ) {
      setUploadError(errorMessages.invalidFormat.clientMessage);
    } else if (
      response.statusCode === errorMessages.invalidPOInfoHeader.statusCode &&
      response.message.includes(errorMessages.invalidPOInfoHeader.message)
    ) {
      setUploadError(errorMessages.invalidPOInfoHeader.clientMessage);
    } else if (response.message === errorMessages.errorInFile.message && response.errors) {
      setUploadError(errorMessages.errorInFile.clientMessage.replace('{errors}', response.errors));
    } else if (
      response.statusCode === errorMessages.invalidProductionPlan.statusCode &&
      response.message.includes(errorMessages.invalidProductionPlan.message)
    ) {
      setUploadError(errorMessages.invalidProductionPlan.clientMessage);
    } else {
      setUploadError('An unknown error occurred. Please try again.');
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setIsUploadComplete(false);
    setUploadError(null);
    setActiveStep(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsUploadComplete(false);
    setUploadError(null);
    setPoID(null);
    setActiveStep(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (activeStep === 0 || activeStep === 1) {
      setShowConfirmation(true);
    } else {
      handleReset();
    }
  };

  const { productionPlanList, isPending, isError } = useGetAllProductionPlans({
    sorting,
    columnFilters: [{ id: 'status', value: 'IN_PROGRESS' }],
    pagination
  });

  const filteredPlans = productionPlanList?.data;

  const renderProductionPlan = () => {
    const handlePageChange = (newPageIndex: number) => {
      setPagination((prev) => ({
        ...prev,
        pageIndex: newPageIndex - 1 // Adjust for zero-based index
      }));
    };

    if (isPending) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loading />
        </div>
      );
    }

    if (isError) {
      return (
        <p className="text-red-500 text-center">
          Failed to fetch production plans. Please try again.
        </p>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-center">Select a Production Plan</h3>
        <div className="grid gap-6">
          {filteredPlans && filteredPlans.length > 0 ? (
            filteredPlans.map((plan: ProductionPlan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPlan(plan)}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{plan.name || `Plan ${plan.id.slice(0, 8)}`}</h4>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        className={`rounded-lg px-2 py-1 ${
                          statusColors[plan.status as ProductionPlanStatus] ||
                          'bg-gray-500 text-white'
                        }`}>
                        {ProductionPlanStatusLabels[plan.status as ProductionPlanStatus] ||
                          'Unknown'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {convertDate(plan.expectedStartDate)} - {convertDate(plan.expectedEndDate)}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-base font-mono">
                    {plan.code || `CODE-${plan.id.slice(0, 8)}`}
                  </Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center">No production plans available.</p>
          )}
        </div>
        {/* Custom Pagination */}
        <div className="mt-6 flex justify-center items-center space-x-6">
          <Button
            variant="secondary"
            disabled={!productionPlanList?.pageMeta?.hasPrevious}
            onClick={() => handlePageChange(productionPlanList?.pageMeta?.page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground text-center">
            Page {productionPlanList?.pageMeta?.page || 1} of{' '}
            {productionPlanList?.pageMeta?.totalPages || 1}
          </span>
          <Button
            variant="secondary"
            disabled={!productionPlanList?.pageMeta?.hasNext}
            onClick={() => handlePageChange(productionPlanList?.pageMeta?.page + 1)}>
            Next
          </Button>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => setActiveStep((prev) => Math.min(prev + 1, 3))}
            disabled={!selectedPlan}>
            Next Step
          </Button>
        </div>
      </div>
    );
  };

  const renderUploadExcel = () => (
    <div>
      {/* File Upload Section */}
      {!selectedFile && !uploadError && (
        <div
          className={`flex flex-col gap-5 justify-center items-center border-2 ${
            isDragging ? 'border-blue-700 bg-blue-50' : 'border-dashed border-blue-500'
          } rounded-lg p-10 cursor-pointer bg-gray-50`}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-700 hover:text-blue-800 flex flex-col gap-5 items-center">
            <FileUp size={45} color={Colors.primaryLightBackgroundColor} />
            <span className="font-semibold">Click or drag file to this area to upload</span>
          </label>
          <span className="text-sm text-gray-500">
            Formats accepted: .xlsx (Max size: {MAX_FILE_SIZE_KB} KB)
          </span>
        </div>
      )}

      {selectedFile && !isUploadComplete && (
        <div className="flex flex-col bg-gray-100 border border-dashed border-gray-300 rounded-lg mt-4 pb-3">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <img src={ExcelIcon} alt="Excel Icon" className="w-10 h-10 mr-4" />
              <div className="flex flex-col">
                <p className="font-semibold">{selectedFile.name}</p>
              </div>
            </div>
            <Trash
              size={20}
              color="red"
              className="cursor-pointer hover:opacity-30 ml-9"
              onClick={handleDeleteFile}
            />
          </div>
          <div className="px-4 w-full">
            {isUploading ? (
              <div className="flex justify-center items-center">
                <Loading />
              </div>
            ) : uploadError ? (
              <p className="text-red-600 mt-2">Upload failed</p>
            ) : (
              <p className="text-green-600 mt-2">Upload successful</p>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 flex flex-col bg-red-100 p-4 rounded-lg border border-red-300">
          <div className="flex items-center mb-2">
            <XCircle size={30} color="red" />
            <p className="ml-2 text-sm font-semibold text-red-600">{selectedFile?.name}</p>
          </div>
          <p className="text-sm text-red-600" dangerouslySetInnerHTML={{ __html: uploadError }} />
        </div>
      )}

      {isUploadComplete && !uploadError && selectedFile && (
        <div className="mt-4 flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <img src={ExcelIcon} alt="Excel Icon" className="w-8 h-8" />
            <div>
              <p className="text-sm text-gray-700 font-bold">{selectedFile.name}</p>
              <p className="text-xs text-green-600">Upload successfully</p>
            </div>
          </div>
          <Trash
            size={25}
            color="red"
            className="cursor-pointer hover:opacity-30"
            onClick={handleDeleteFile}
          />
        </div>
      )}
    </div>
  );

  const renderUploadSuccessfully = () => (
    <main className="flex flex-col justify-center items-center p-6 bg-white rounded-md shadow-md space-y-6">
      <CircleCheckBig color={Colors.success} size={80} className="text-center mb-1" />
      <div className="text-center">
        <h1 className="font-bold text-xl text-green-600">
          Purchase Order: {poNumber} uploaded successfully!
        </h1>
        <p className=" text-gray-500 mt-2">
          Your purchase order has been uploaded successfully. You can now proceed to view or manage
          it.
        </p>
      </div>
    </main>
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="flex items-center gap-2">
          <Import size={20} />
          {triggerButtonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold capitalize ">Upload {fileName}</h1>
            <Popover open={showConfirmation} onOpenChange={setShowConfirmation}>
              <PopoverTrigger asChild>
                <DialogClose onClick={handleClose} />
              </PopoverTrigger>
              <PopoverContent className="p-4 bg-white rounded-md shadow-md">
                <p>Are you sure you want to close? This will reset everything.</p>
                <div className="flex justify-between mt-4">
                  <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReset}>
                    Close Anyway
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogTitle>

        <Stepper
          activeStep={activeStep}
          styleConfig={{
            activeBgColor:
              uploadError && activeStep === 0 ? 'red' : Colors.primaryLightBackgroundColor,
            activeTextColor: Colors.commonBtnText,
            completedBgColor: Colors.primaryDarkBackgroundColor,
            completedTextColor: Colors.commonBtnText,
            inactiveBgColor: Colors.greyText,
            inactiveTextColor: Colors.commonBtnText,
            size: '30px',
            circleFontSize: '16px',
            labelFontSize: '13px',
            borderRadius: '20px',
            fontWeight: '300'
          }}>
          {/* <Step label="Choose production plan" /> */}
          <Step label="Upload Excel" />
          <Step label="Upload successfully" />
        </Stepper>

        {/* {activeStep === 0 && renderProductionPlan()} */}
        {activeStep === 0 && renderUploadExcel()}
        {activeStep === 1 && renderUploadSuccessfully()}

        {activeStep === 1 && (
          <div className="flex justify-center items-center gap-5 mt-6">
            <Button
              className="bg-white text-red-500 ring-1 ring-red-500 w-32"
              onClick={handleReset}>
              Close
              <DialogClose />
            </Button>
            <Button
              className="w-40"
              onClick={() => {
                if (poId) {
                  navigate(`/purchase-order/${poId}`);
                }
              }}>
              View purchase order
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadExcel;
