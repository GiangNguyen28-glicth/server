export declare class UserDTO {
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirm: String;
    phoneNumber: string;
    email: string;
    CMND: string;
    address: string;
    role?: UserRole;
}
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
