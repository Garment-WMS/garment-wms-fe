import React from 'react';
import Introduction from './components/Introduction';
import AnalystSection from './components/AnalystSection';
import ImportRequestList from './components/ImportRequestList';
import { Card } from '@/components/ui/card';

const ImportRequestManagement = () => {
  return (
    <div className="h-full w-full px-4 flex flex-col gap-4">
      <Introduction />
      {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <Card className="lg:col-span-8">
          <ImportRequestList />
        </Card>
        <Card className="lg:col-span-4">
          <AnalystSection />
        </Card>
      </div> */}
          <ImportRequestList />
    </div>
  );
};

export default ImportRequestManagement;
