import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import Google from '@/assets/images/Google.png';
import SelectRole from './SelectRole';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions } from '../slice';
import { user } from '../types';
import Cookies from 'js-cookie';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '@/enums/httpStatus';
import { Role } from '@/enums/role';
import { authApi } from '@/api/auth/auth';
import Loading from '@/components/common/Loading';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const LoginForm: React.FC = ({ className, ...props }: UserAuthFormProps) => {
  const dispatch = useDispatch();
  // const [userName, setUserName] = React.useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // const handleGoogleLogin = () => {
  //     window.location.replace(devEnvGoogleAuth());
  // };
  const { toast } = useToast();
  const roleValues = Role.map((role) => role.value) as [string, ...string[]];

  const formSchema = z.object({
    email: z.string().email({
      message: 'Invalid email format.'
    }),

    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters long.'
      })
      // .regex(/[A-Z]/, {
      //   message: 'Mật khẩu phải chứa ít nhất 1 ký tự in hoa.',
      // })
      .regex(/[a-z]/, {
        message: 'Password must contain at least 1 lowercase letter.'
      })
      // .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      //   message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.',
      // })
      .regex(/[0-9]/, {
        message: 'Password must contain at least 1 number.'
      }),
    role: z.enum(roleValues, {
      required_error: 'Role need to be chosen.'
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: undefined
    }
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    switch (values.role) {
      case 'purchasing-staff':
        login('PURCHASING_STAFF', values.email, values.password);
        break;
      case 'warehouse-manager':
        login('WAREHOUSE_MANAGER', values.email, values.password);
        break;
      case 'warehouse-staff':
        login('WAREHOUSE_STAFF', values.email, values.password);
        break;
      case 'production-department':
        login('PRODUCTION_DEPARTMENT', values.email, values.password);
        break;
      case 'inspection-department':
        login('INSPECTION_DEPARTMENT', values.email, values.password);
        break;
      default:
        break;
    }
    
  }

  async function login(role: string, us: string, pw: string) {
    try {
      let res;
      res = await axios(authApi.login(us, pw, role));
      // Process the response
      const accessToken = res.data.data.accessToken;
      const refreshToken = res.data.data.refreshToken;
      const staff: user = res.data.data.user;

      // Set tokens and user data
      staff.accessToken = accessToken;
      staff.refreshToken = refreshToken;
      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);

      // Dispatch and navigate
      dispatch(actions.setUser(staff));
      navigate('/home');
    } catch (error: any) {
      // Handle login errors
      const message = error.response?.data?.message || 'UNKNOWN_ERROR';
      switch (message) {
        case HTTP_MESSAGE.INVALID_EMAIL:
          toast({
            title: 'Login Error',
            variant: 'destructive',
            description: "Email doesn't exist"
          });
          break;
        case HTTP_MESSAGE.INVALID_PW:
          toast({
            title: 'Login Error',
            variant: 'destructive',
            description: 'Password is wrong'
          });
          break;
        default:
          toast({
            title: 'Login Error',
            variant: 'destructive',
            description: 'Something went wrong'
          });
          break;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn('grid gap-6 lg:mx-10', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3">
            {/* <div className="grid gap-1"> */}
            <div className="flex justify-center items-center">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className=" text-black mb-2">Role</FormLabel>
                    <FormControl>
                      <SelectRole field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-black mb-2">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} className="text-black mb-4" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-black mb-2">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password..."
                      type="password"
                      {...field}
                      className="text-black mb-4"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-5" variant={'default'} disabled={loading} type="submit">
            {loading ? (<Loading/>) : 'Login with email'}
            </Button>
          </div>
          {/* </div> */}
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
