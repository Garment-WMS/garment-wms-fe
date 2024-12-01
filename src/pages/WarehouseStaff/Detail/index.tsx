import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { CalendarIcon, PhoneIcon, AtSignIcon, UserIcon, CheckCircle2, XCircle } from 'lucide-react';
import avatar from '@/assets/images/avatar.png';
import { convertToVietnamesePhoneNumber } from '../../../helpers/convertPhoneNumber';
import { convertDate } from '@/helpers/convertDate';

// Mock data based on the provided JSON structure
const mockStaffData = {
  id: '4ddc8392-eba0-42bc-aa49-eb36f8d6cba3',
  accountId: 'ce30e8ea-ab23-4d89-81b2-9b660a13dbc7',
  createdAt: '2024-10-29T09:11:44.941Z',
  updatedAt: '2024-10-29T09:11:44.941Z',
  deletedAt: null,
  account: {
    id: 'ce30e8ea-ab23-4d89-81b2-9b660a13dbc7',
    email: 'warehouseStaff@example.com',
    username: 'warehouseSTaff',
    avatarUrl: null,
    cidId: null,
    dateOfBirth: '2003-04-19T00:00:00.000Z',
    firstName: 'Khoa',
    gender: 'MALE',
    isDeleted: false,
    isVerified: false,
    lastName: 'Trong',
    phoneNumber: '+84375561293',
    status: 'active',
    createdAt: '2024-10-29T09:11:44.941Z',
    deletedAt: null,
    updatedAt: '2024-10-29T09:11:44.941Z'
  }
};

const WarehouseStaffDetail = () => {
  const { account } = mockStaffData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-t-4 border-t-blue-500">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={account.avatarUrl || avatar}
                    alt={`${account.firstName} ${account.lastName}`}
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {account.firstName[0]}
                    {account.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  className="absolute -bottom-2 right-0 px-2 py-0.5"
                  variant={account.status === 'active' ? 'default' : 'secondary'}>
                  {account.status}
                </Badge>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  {account.firstName} {account.lastName}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">Warehouse Staff</p>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  {account.isVerified ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {account.isVerified ? 'Verified Account' : 'Unverified Account'}
                  </span>
                </div>
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
                    <p className="font-medium">{account.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{account.username}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <PhoneIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {convertToVietnamesePhoneNumber(account.phoneNumber)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{convertDate(account.dateOfBirth)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50/50">
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(account.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{new Date(account.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarehouseStaffDetail;
