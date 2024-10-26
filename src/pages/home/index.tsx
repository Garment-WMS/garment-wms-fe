import privateCall from '@/api/PrivateCaller';
import { testApi } from '@/api/testAuth';
import { Button } from '@/components/ui/button';
import usePrivateCall from '@/hooks/usePrivateCall';

const Home = () => {

  const testAuthFunction = async () => {
    try {
      const response = await privateCall(testApi.testAuth());
      console.log(response.data);
    } catch (error) {
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
