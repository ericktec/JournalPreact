export interface RegisterUser {
    email: string;
    username: string;
    authentication ? : {
        salt: string;
        password: string;
        refreshToken?: Array<string>
    }
};

export interface User extends RegisterUser {
    _id: string
};

export interface jwtUserToken {
    email: string;
    username: string;
    _id: string;
}