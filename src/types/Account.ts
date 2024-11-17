import { Gender } from '@/enums/gender';

export interface Account {
  id: string;
  email: string;
  password: string;
  username: string;
  avatarUrl?: string;
  cidId?: string;
  dateOfBirth: Date;
  firstName: string;
  gender: Gender;
  isDeleted?: boolean;
  isVerified?: boolean;
  lastName: string;
  phoneNumber: string;
  status?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
  factoryDirector?: string;
  inspectionDepartment?: string;
  productionDepartment?: string;
  purchasingStaff?: string;
  warehouseManager?: string;
  warehouseStaff?: string;
}
