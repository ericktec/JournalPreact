import { baseUrl } from "../../config/httpConfig";
import { UserSignUp, UserLogIn, User } from "../../types/user";

const authBaseUrl = `${baseUrl}/authentication`;

export async function signUp<T>(userData: UserSignUp): Promise<T> {
    const response = await fetch(`${authBaseUrl}/signUp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });   

    if(!response.ok) throw Error("You couldn't sign up, please try again later");

    return await response.json();
}

export async function login (userData: UserLogIn) {
    const response = await fetch(`${authBaseUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if(!response.ok && response.status === 401) throw Error("Invalid username or password");
    else if(!response.ok) throw Error("You can't login at this moment, please try again later");

    return await response.json();
}

export async function checkIfUserIsLoggedIn (): Promise<User> {
    const response = await fetch(`${authBaseUrl}/me`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if(!response.ok) throw Error("Invalid user");
    const currentUser: User = await response.json();
    currentUser.isAuthenticated = true;
    return currentUser;
}

export async function logout () {
    const response = await fetch(`${authBaseUrl}/logout`, {
        method: "POST",
        credentials: "include"
    });
}


export async function requestForNewAccessToken () {
    const response = await fetch(`${authBaseUrl}/token`, {
        method: "POST", 
        credentials: "include"
    });

    const data = await response.json();
    if(!response.ok || data.status !== "success") {
        logout();
    }
}