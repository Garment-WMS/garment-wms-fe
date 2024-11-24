import { importRequestApi } from '@/api/purchase-staff/importRequestApi';
import { BreadcrumbResponsive } from '@/components/common/BreadcrumbReponsive';
import Loading from '@/components/common/Loading';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Disscussion from './components/Disscussion';
import ImportRequestSheet from './components/ImportRequestSheet';
import ImportRequestStatus from './components/ImportRequestStatus';
import { actions } from '../slice';
import IRProcessAndAction from './components/IRProcessAndAction';
type Props = {};

const ViewImportRequest = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { id } = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const breadcrumbItems = [
    { href: '/purchase-staff/import-request', label: 'Import Request' },
    { href: `/purchase-staff/import-request/${id}`, label: `Details of Request` }
  ];
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading

      try {
        const res = await axios(importRequestApi.getOne(id as string));
        if (res.status === 200) {
          const data = res.data.data;
          dispatch(actions.setImportRequest(data));
        } else {
          setError('Something went wrong');
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.'
          });
        }
      } catch (error) {
        setError('Something went wrong');
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, dispatch, refreshTrigger]);
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  return (
    <>
      {isLoading ? (
        <div className="w-full h-full flex-col items-center justify-center flex">
          <Loading size="100" />
        </div>
      ) : error ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-red-500 font-bold">{error}</p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl shadow-sm border">
          <div className="flex flex-col gap-3 px-4">
            <BreadcrumbResponsive breadcrumbItems={breadcrumbItems} itemsToDisplay={2} />
            <div className="flex flex-col lg:grid lg:grid-cols-8 gap-4">
              <div className="lg:col-span-6 order-2 lg:order-none">
                <ImportRequestSheet />
              </div>

              <div className="flex lg:col-span-2 order-1 lg:order-none">
                <ImportRequestStatus />
              </div>
              <div className="flex lg:col-span-6 order-3 lg:order-none">
                <IRProcessAndAction onApproval={handleRefresh} />
              </div>
              <div className="flex lg:col-span-6 order-3 lg:order-none">
                <Disscussion onApproval={handleRefresh} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewImportRequest;
