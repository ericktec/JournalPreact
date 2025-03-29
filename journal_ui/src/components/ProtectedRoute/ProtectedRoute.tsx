import { useContext, useEffect } from "preact/hooks";
import { UserContext } from "../../contexts/userContext";
import { Route, useLocation } from "preact-iso";


export default function ProtectedRoute(props) {

    const currentUser= useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        console.log(currentUser)
        if(!currentUser || !currentUser.isAuthenticated) location.route("/login");
    }, [currentUser]);

    return(
        <Route {...props}/>
    );
}