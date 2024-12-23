import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/Dialog';
import { Progress } from '@/components/ui/progress';
import { CircleCheckBig, FileUp, Trash, XCircle } from 'lucide-react';
import Colors from '@/constants/color';
import ExcelIcon from '@/assets/images/ExcelFile_Icon.png';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Step, Stepper } from 'react-form-stepper';
import { importPurchaseOrder } from '@/api/services/importPurchaseOrder';
import { AxiosProgressEvent } from 'axios';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE_KB = 100;

type SheetRow = (string | number | null)[];

type UploadExcelProps = {
  fileName: string;
  onUploadComplete: (sheets: Record<string, SheetRow[]>) => void;
  continueButtonLabel?: string;
  onContinue: () => void;
  triggerButtonLabel?: string;
};

const UploadExcel: React.FC<UploadExcelProps> = ({
  fileName,
  onUploadComplete,
  onContinue,
  continueButtonLabel = 'Open File',
  triggerButtonLabel = 'Import'
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [poId, setPoID] = useState<string | null>(null);
  const [poNumber, setPoNumber] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    processFile(file);
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
      setActiveStep(1);
      uploadFileToServer(file);
    }
  };

  const uploadFileToServer = async (file: File) => {
    try {
      const response = await importPurchaseOrder(file);
      console.log(response);

      if (response.statusCode !== 201) {
        handleUploadErrors(response);
        setActiveStep(1);
      } else {
        setIsUploadComplete(true);
        setActiveStep(2);
        if (response?.data?.data?.id) {
          setPoID(response?.data?.data?.id);
          setPoNumber(response?.data?.data?.poNumber); // Save PO number
        }
      }
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.');
      setActiveStep(1);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadErrors = (response: any) => {
    if (response.statusCode === 400 && response.message === 'Invalid file format') {
      setUploadError('The file type is invalid. Please upload a valid Excel (.xlsx) file.');
    } else if (response.statusCode === 415 && response.message === 'Invalid format') {
      setUploadError(
        'The uploaded file format does not match the required template. Please use the correct template and try again.'
      );
    } else if (
      response.statusCode === 415 &&
      response.message.includes('POInfo table header is invalid')
    ) {
      setUploadError(
        'The uploaded file contains invalid data. The POInfo table header is incorrect'
      );
    } else if (response.message === 'There is error in the file' && response.errors) {
      setUploadError(
        `We found issues in the uploaded file. <a href="${response.errors}" target="_blank" class="underline text-blue-600">Click here</a> to download the file with errors and correct them.`
      );
    } else {
      setUploadError('An unknown error occurred. Please try again.');
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setIsUploadComplete(false);
    setUploadProgress(0);
    setUploadError(null);
    setActiveStep(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderProductionPlan = () => (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl">Production Plan</h1>
      <Button onClick={() => setActiveStep((prevStep) => prevStep + 1)}>Next</Button>
    </div>
  );

  const renderUploadExcel = () => (
    <div>
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
          <div className="px-4 w-full ">
            {isUploading ? (
              <Progress value={uploadProgress} className="h-2 bg-gray-200 mt-2 w-full" />
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
    <main className="flex flex-col justify-center items-center p-6 bg-white rounded-md shadow-md space-y-4">
      <CircleCheckBig color={Colors.success} size={80} className="text-center mb-2" />
      <div className="text-center">
        <h1 className="font-bold text-3xl text-green-600 mb-2 whitespace-nowrap">
          PO {poNumber} Uploaded Successfully!
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md">
          Your purchase order has been uploaded successfully. You can now proceed to view or manage
          it.
        </p>
      </div>
    </main>
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Button>{triggerButtonLabel}</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}>
        <DialogTitle>
          <h1 className="text-xl font-semibold capitalize ">Upload {fileName}</h1>
        </DialogTitle>

        <Stepper
          activeStep={activeStep}
          styleConfig={{
            activeBgColor:
              uploadError && activeStep === 1 ? 'red' : Colors.primaryLightBackgroundColor,
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
          <Step label="Choose production plan" />
          <Step label="Upload Excel" />
          <Step label="Upload successfully" />
        </Stepper>

        {activeStep === 0 && renderProductionPlan()}
        {activeStep === 1 && renderUploadExcel()}
        {activeStep === 2 && renderUploadSuccessfully()}

        {activeStep === 2 && (
          <div className="flex justify-center items-center gap-5 mt-6">
            <Button className="bg-white text-red-500 ring-1 ring-red-500 w-32">Close</Button>
            <Button
              className="w-32"
              onClick={() => {
                if (poId) {
                  navigate(`/purchase-staff/purchase-order/detail/${poId}`);
                }
              }}>
              Open file
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadExcel;
