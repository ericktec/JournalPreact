import express, { Request, Response, NextFunction } from "express";
import { get, identity, merge } from "lodash";
import { getUserBySessionToken } from "../db/controllers/users";
import { authCookieName } from "../config/authentication";
import * as jwt from "jsonwebtoken";
import { VerifyErrors } from "jsonwebtoken";

// export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const sessionToken = req.cookies[authCookieName]
//         console.log(sessionToken)

//         if(!sessionToken) return res.sendStatus(403);

//         const existingUser = await getUserBySessionToken(sessionToken);

//         if(!existingUser) return res.sendStatus(403);

//         merge(req, { identity: existingUser });

//         return next();

//     } catch (error) {
//         console.error(error);
//         return res.sendStatus(400);
//     }
// };

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // const authHeader = req.headers['authorization'];
        // if(!authHeader) throw Error("No authentication header");
        // const token = authHeader.split(' ')[1];
        const token = req.cookies["jwt-accessToken"];
        if (!process.env.ACCESS_TOKEN_SECRET)
            throw Error("Access token secret has not been set");
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err: VerifyErrors | null, user: any) => {
                merge(req, {
                    user,
                });

                next();
            }
        );
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
};
