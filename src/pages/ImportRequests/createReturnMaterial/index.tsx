import React from 'react';
import { BreadcrumbResponsive } from './components/BreadcrumbReponsive';
import NewImportRequest from './components/NewImportRequest';

type Props = {};

const CreateReturnImportRequest = (props: Props) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border ">
      {/* <BreadcrumbResponsive /> */}
      <NewImportRequest />
    </div>
  );
};

export default CreateReturnImportRequest;