import privateCall from '@/api/PrivateCaller';
import { testApi } from '@/api/testAuth';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import usePrivateCall from '@/hooks/usePrivateCall';
import axios from 'axios';

const Home = () => {

  const testAuthFunction = async () => {
    try {
      const response = await privateCall(testApi.testAuth());
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <div className='w-full h-full'>
      <h1>Home</h1>
      <Button onClick={testAuthFunction}>Test Auth</Button>
    </div>
  );
};
export default Home;
