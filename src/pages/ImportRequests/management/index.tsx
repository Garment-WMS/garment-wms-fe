import React from 'react';
import Introduction from './components/Introduction';
import AnalystSection from './components/AnalystSection';
import ImportRequestList from './components/ImportRequestList';

const ImportRequestManagement = () => {
  return (
    <div className="h-full w-full px-4 flex flex-col gap-4">
      <Introduction />
      <AnalystSection />
      <ImportRequestList />
    </div>
  );
};

export default ImportRequestManagement;
