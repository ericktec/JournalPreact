import { Response, Request } from "express";
import { getUserByEmail, getUserById } from "../db/controllers/users"
import {get} from "lodash";

// Example on how to check if user is auth and how to retrieve it from the req
export const getAUserIfAuth = async (req: Request, res: Response) => {
    const user = await getUserByEmail("ericktec80@gmail.com")
    const currentUserId = get(req, "identity._id", "") as string;
    console.log(currentUserId.toString());

    if(user) {
        res.status(200).json(user.email);
    } else {
        res.sendStatus(400)
    }
}
