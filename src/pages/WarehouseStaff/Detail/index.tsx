import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { CalendarIcon, PhoneIcon, AtSignIcon, UserIcon, CheckCircle2, XCircle } from 'lucide-react';
import avatar from '@/assets/images/avatar.png';
import { convertToVietnamesePhoneNumber } from '@/helpers/convertPhoneNumber';
import { convertDate } from '@/helpers/convertDate';
import { get } from '@/api/ApiCaller';

const WarehouseStaffDetail = () => {
  const { id } = useParams();
  const [staffData, setStaffData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouseStaff = async () => {
      try {
        const config = get(`/account/${id}`);
        const response = await fetch(config.url, {
          method: config.method,
          headers: config.headers
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setStaffData(data.data || null);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch warehouse staff details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchWarehouseStaff();
    }
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No data found for this staff member.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="" />
      <div className="relative max-w-4xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-t-4 border-t-blue-500">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={staffData?.avatarUrl || avatar}
                    alt={`${staffData?.firstName || ''} ${staffData?.lastName || ''}`}
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {staffData?.firstName?.[0] || 'N'}
                    {staffData?.lastName?.[0] || 'A'}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  className="absolute -bottom-2 right-0 px-2 py-0.5"
                  variant={staffData?.status === 'active' ? 'default' : 'secondary'}>
                  {staffData?.status || 'unknown'}
                </Badge>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  {staffData?.firstName || 'N/A'} {staffData?.lastName || 'N/A'}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">Warehouse Staff</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <AtSignIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{staffData?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{staffData?.username || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <PhoneIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {convertToVietnamesePhoneNumber(staffData?.phoneNumber || 'N/A')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{convertDate(staffData?.dateOfBirth || '')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50/50">
              <div>
                <p className="text-sm text-muted-foreground">Account created</p>
                <p className="font-medium">
                  {staffData?.createdAt ? new Date(staffData.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarehouseStaffDetail;
