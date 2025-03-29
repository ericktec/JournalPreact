import * as jwt from "jsonwebtoken";
import { jwtUserToken } from "../types/UserTypes";

export function generateAccessToken(user: jwtUserToken) {
    if(!process.env.ACCESS_TOKEN_SECRET) throw Error("No access token secret provided");
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}