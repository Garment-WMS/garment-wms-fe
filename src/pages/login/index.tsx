import { Label } from '@/components/ui/Label';
import LoginForm from './components/LoginForm'; 
import backgroud from '@/assets/images/bg5.jpg'; 
import logo from '@/assets/images/warehouse-logo.svg';

const Login: React.FC = () => {
  return (
    <div
      className="w-full h-screen flex justify-center pb-2 bg-white px-4
    lg:grid lg:grid-cols-6 lg:gap-2 lg:h-screen lg:px-0"
    >
      <div
        className="hidden
      lg:col-span-4 lg:flex" 
      >
        <img
          src={backgroud}
          alt="Image"
          className="h-screen w-full object-fill"
        />
      </div>

      <div className="lg:col-span-2 flex flex-col h-full gap-5 rounded-lg">
        <div className="flex flex-col shrink justify-center items-center">
          <div className="">
            <img
              src={logo}
              alt="Image"
              className="lg:h-40 h-32  object-cover"
            />
          </div>
          <div className="flex flex-col shrink justify-center items-center">
            <Label className="font-sans font-bold text-2xl" htmlFor="name">
              Welcome to Warehouse Garment
            </Label>
            <Label className="font-sans font-semibold text-sm" htmlFor="name">
              Managing goods has never been easier
            </Label>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
export default Login;
