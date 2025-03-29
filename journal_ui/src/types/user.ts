export type UserSignUp = {
    email: string;
    username: string;
    password: string;
};

export type UserLogIn = {
    email: string;
    password: string;
};

export type User = {
    _id: string
    email: string;
    username: string;
    isAuthenticated: boolean;
}