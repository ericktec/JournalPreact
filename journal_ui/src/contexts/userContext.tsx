import {h, Context, createContext } from "preact";
import { useState, StateUpdater, useEffect } from "preact/hooks";
import { User } from "../types/user";
import { checkIfUserIsLoggedIn, requestForNewAccessToken } from "../utils/http/authHttp";
import { useLocation } from "preact-iso";

export const UserContext = createContext<User>(null);
export const SetUserContext = createContext<StateUpdater<User>>(null);

export function UserProvider ({children}) {
    const [user, setUser] = useState<User>(null);
    const location = useLocation();

    useEffect(() => {
        requestForNewAccessToken();
        const getNewAccessTokenInterval = setInterval(requestForNewAccessToken, 1000 * 60 * 15);
        async function sendUserCookie () {
            try {
                const currentUser = await checkIfUserIsLoggedIn();
                setUser(currentUser);
                if(currentUser.isAuthenticated) location.route("/home");
            } catch (error){
                console.error(error);
            }
        }
        sendUserCookie();

        return () => {
            clearInterval(getNewAccessTokenInterval);
        }
    }, []);

    return (
        <UserContext.Provider value={user}>
            <SetUserContext.Provider value={setUser}>
                {children}     
            </SetUserContext.Provider>
        </UserContext.Provider>
    )
}