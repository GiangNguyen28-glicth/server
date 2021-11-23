export declare class UserDTO {
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    email: string;
    CMND: string;
    role?: UserRole;
}
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
