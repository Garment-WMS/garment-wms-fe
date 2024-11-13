export interface user {
    id: string;
    email: string;
    lastName: string;
    firstName: string;
    username: string;
    avatarUrl: string;
    dateOfBirth?: string;
    gender?: string;
    phoneNumber?: number;
    material?: string;
    accessToken: string;
    refreshToken: string;
    factoryDirector: role;
    warehouseStaff: role;
    inspectionDepartment: role;
    purchasingStaff: role;
    productionDepartment:role;
    warehouseManager:role;
}

export interface role{
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}