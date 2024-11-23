export interface Account {
    id: string;
    email: string;
    username: string;
    avatarUrl: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
}

export interface User {
    id: string;
    accountId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    account: Account;
}