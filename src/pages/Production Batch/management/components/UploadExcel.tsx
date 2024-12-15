import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/Dialog';
import { CircleCheckBig, FileUp, Trash, XCircle } from 'lucide-react';
import Colors from '@/constants/color';
import ExcelIcon from '@/assets/images/ExcelFile_Icon.png';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Step, Stepper } from 'react-form-stepper';
import { useNavigate } from 'react-router-dom';
import { importProductionBatch } from '@/api/services/productionBatch';
import Loading from '@/components/common/Loading';

const MAX_FILE_SIZE_KB = 500;

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
  invalidProductionPlan: {
    statusCode: 415,
    message: 'Invalid Production Plan, the production plan is not available',
    clientMessage: 'The uploaded file contains an invalid Production Plan.'
  },
  exceedQuantity: {
    statusCode: 400,
    message: 'Exceed quantity to produce in plan detail, you can not create this production batch',
    clientMessage: 'The quantity exceeds the allowed limit in the production plan detail.'
  },
  errorInFile: {
    message: 'There is an error in the file',
    clientMessage:
      'We found issues in the uploaded file. <a href="{errors}" target="_blank" class="underline text-blue-600">Click here</a> to download the file with errors and correct them.'
  },
  worksheetNotFound: {
    message: 'Invalid file format, worksheet not found',
    clientMessage:
      'This is not the production batch worksheet. Please use the correct template and try again.'
  },
  productionBatchTableNotFound: {
    statusCode: 400,
    message: 'Invalid format, production batch info table not found',
    clientMessage:
      'There seems to be an issue with the production batch info table. Please check and try again.'
  }
};

const UploadExcelProductionBatch: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [batchCode, setBatchCode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(0);

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
      setActiveStep(0);
      uploadFileToServer(file);
    }
  };

  const uploadFileToServer = async (file: File) => {
    try {
      const response = await importProductionBatch(file);
      if (response.statusCode !== 200 && response.statusCode !== 201) {
        handleUploadErrors(response);
        setActiveStep(0);
      } else {
        setIsUploadComplete(true);
        setActiveStep(1);
        if (response.data?.id) {
          setBatchId(response.data?.id);
        }
        if (response?.data?.code) {
          setBatchCode(response?.data?.code);
        }
      }
    } catch (error: any) {
      setUploadError('Failed to upload file. Please try again.');
      setActiveStep(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadErrors = (response: any) => {
    if (response?.message === errorMessages.exceedQuantity?.message) {
      setUploadError(errorMessages.exceedQuantity?.clientMessage);
    } else if (
      response.statusCode === errorMessages.invalidFileType?.statusCode &&
      response.message === errorMessages.invalidFileType?.message
    ) {
      setUploadError(errorMessages.invalidFileType?.clientMessage);
    } else if (
      response.statusCode === errorMessages.invalidFormat?.statusCode &&
      response.message === errorMessages.invalidFormat?.message
    ) {
      setUploadError(errorMessages.invalidFormat?.clientMessage);
    } else if (response?.message === errorMessages.errorInFile?.message && response.errors) {
      setUploadError(errorMessages.errorInFile?.clientMessage.replace('{errors}', response.errors));
    } else if (
      response.statusCode === errorMessages.invalidProductionPlan?.statusCode &&
      response.message.includes(errorMessages.invalidProductionPlan?.message)
    ) {
      setUploadError(errorMessages.invalidProductionPlan?.clientMessage);
    } else if (response?.message === errorMessages.worksheetNotFound?.message) {
      setUploadError(errorMessages.worksheetNotFound?.clientMessage);
    } else if (response?.message === errorMessages.productionBatchTableNotFound?.message) {
      setUploadError(errorMessages.productionBatchTableNotFound?.clientMessage);
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
    setBatchId(null);
    setActiveStep(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
          <div className="px-4 w-full">
            {isUploading ? (
              <div className="flex justify-center items-center">
                <Loading />
              </div>
            ) : uploadError ? (
              <div className="mt-4 flex flex-col bg-red-100 p-4 rounded-lg border border-red-300">
                <div className="flex items-center mb-2">
                  <XCircle size={30} color="red" />
                  <p className="ml-2 text-sm font-semibold text-red-600">{selectedFile?.name}</p>
                </div>
                <p
                  className="text-sm text-red-600"
                  dangerouslySetInnerHTML={{ __html: uploadError }}
                />
              </div>
            ) : (
              <p className="text-green-600 mt-2">Upload successful</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderUploadSuccessfully = () => (
    <main className="flex flex-col justify-center items-center p-6 bg-white rounded-md shadow-md space-y-6">
      <CircleCheckBig color={Colors.success} size={80} className="text-center mb-1" />
      <div className="text-center">
        <h1 className="font-bold text-xl text-green-600">
          Production Batch: {batchCode} uploaded successfully!
        </h1>
        <p className=" text-gray-500 mt-2">
          Your production batch has been uploaded successfully. You can now proceed to view or
          manage it.
        </p>
      </div>
    </main>
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="flex items-center gap-2">
          <FileUp size={20} />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold capitalize ">Upload Production Batch</h1>
            <DialogClose />
          </div>
        </DialogTitle>

        <Stepper
          activeStep={activeStep}
          styleConfig={{
            activeBgColor: uploadError ? 'red' : Colors.primaryLightBackgroundColor,
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
          <Step label="Upload Excel" />
          <Step label="Upload successfully" />
        </Stepper>

        {activeStep === 0 && renderUploadExcel()}
        {activeStep === 1 && renderUploadSuccessfully()}

        {activeStep === 1 && (
          <div className="flex justify-center items-center gap-5 mt-6">
            <Button
              className="bg-white text-red-500 ring-1 ring-red-500 w-32"
              onClick={handleReset}>
              Close
            </Button>
            <Button
              className="w-40"
              onClick={() => {
                if (batchId) {
                  navigate(`/production-batch/${batchId}`);
                }
              }}>
              View Production Batch
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadExcelProductionBatch;
