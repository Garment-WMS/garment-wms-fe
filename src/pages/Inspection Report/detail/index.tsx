import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById';
import { useParams } from 'react-router-dom';

const InspectionRequestDetails = () => {
  const { id } = useParams();
  const { data, isPending, isError } = useGetInspectionRequestById(id!);
  return <div>Inspection Request detail {id}</div>;
};

export default InspectionRequestDetails;
