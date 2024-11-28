export interface AuthResponse {
    _id: string;
    tel: string;
    email: string;
    username: string;
    recipes?: string[];
}


export interface LoginData {
    email: string;
    password: string;
}


export interface RegisterData {
    username: string;
    email: string;
    tel: string;
    password: string;
    repeatPassword: string;
}