import { Request, Response } from "express";
import {
    createNewUser,
    getUserByEmail,
    updateSessionCookie,
    getUserById,
    updateRefreshToken,
    getRefreshTokensByUserId,
    deleteRefreshTokenByUserId
} from "../db/controllers/users";
import { authentication, random } from "../utils/crypto";
import { RegisterUser, User, jwtUserToken } from "../types/UserTypes";
import { authCookieName, authCookieExpireTime } from "../config/authentication";
import {get, merge} from "lodash";
import * as jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/jwtUtils";
import { VerifyErrors } from "jsonwebtoken";

if(!process.env.ACCESS_TOKEN_SECRET) throw("No Access token secret has been set");

export const singUp = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        if (!(email || password || username))
            throw Error("Not all data was provided");

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.status(400);
            return res.send({
                message: "Email is already registered",
            });
        }
        const salt = random();
        const user: RegisterUser = {
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        };
        const result = await createNewUser(user);
        console.log(`A new user with ${result.insertedId} was created`);
        return res
            .status(200)
            .json({ message: "User created successfully" })
            .end();
    } catch (error) {
        return res.sendStatus(400);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw Error("The data provided is wrong or is missing something");

        const doc = await getUserByEmail(email);

        if (!doc) throw Error("The provided username is wrong");

        const user: User = {
            _id: doc._id.toString(),
            email: doc.email,
            username: doc.username,
            authentication: doc.authentication,
        };

        if (!user.authentication?.salt || !user.authentication?.password)
            throw Error("The user has not password or salt");

        const receivedHash = authentication(user.authentication.salt, password);

        if (receivedHash !== user.authentication.password)
            return res.sendStatus(403);

        if(!process.env.ACCESS_TOKEN_SECRET) throw Error("Access token secret has not been set");

        const userDataForAccessToken: jwtUserToken = {
            username: user.username,
            email: user.email,
            _id: user._id
        };

        const accessToken = generateAccessToken(userDataForAccessToken); 

        if(!process.env.REFRESH_TOKEN_SECRET) throw Error("No Refresh token secret provided");
        const refreshToken = jwt.sign(userDataForAccessToken, process.env.REFRESH_TOKEN_SECRET)

        updateRefreshToken(user._id, refreshToken);

        res.cookie("jwt-accessToken", accessToken, {httpOnly: true,sameSite: false, secure: true});
        res.cookie("jwt-refreshToken", refreshToken, {httpOnly: true,sameSite: false, secure: true});

        res.json({accessToken, refreshToken});

    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        const user = get(req, "user", undefined) as jwtUserToken | undefined;
        if(!user) throw Error("Not valid user object")

        return res.status(200).send({
            _id: user._id,
            email: user.email,
            username: user.username
        });

    } catch(error) {
        console.error(error);
        res.sendStatus(403);
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies["jwt-refreshToken"];
        if(!refreshToken) return res.sendStatus(401);
        if(!process.env.REFRESH_TOKEN_SECRET) throw Error("No Refresh token secret provided");
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: VerifyErrors | null, user: any) => {
            if(err) return res.sendStatus(401); 
            const userToken = user as jwtUserToken;
            const tokens = await getRefreshTokensByUserId(userToken._id);
            const tokensArray: Array<string> = tokens?.authentication.refreshToken
            if(!tokensArray) return res.sendStatus(401);
            if(!tokensArray.includes(refreshToken)) return res.sendStatus(401);
            const accessToken = generateAccessToken({
                username: userToken.username,
                email: userToken.email,
                _id: userToken._id
            });


            res.cookie("jwt-accessToken", accessToken, {
                httpOnly: true,
                sameSite: false,
                secure: true
            });
            return res.status(200).json({status: "success"});
        });
    }
    catch(error) {
        console.error(error);
        return res.sendStatus(401);
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies["jwt-refreshToken"];
        const user = (jwt.decode(refreshToken)) as jwtUserToken;
        if(user && refreshToken)  {
            deleteRefreshTokenByUserId(user._id, refreshToken);
        }

        res.cookie('jwt-refreshToken', null, { expires: new Date(0) });
        res.cookie('jwt-accessToken', null, { expires: new Date(0) });

        res.status(200).json({
            "status": "success"
        });

    } catch(error) {
        return res.sendStatus(500);
    }
}

// export const me = async (req: Request, res: Response) => {
//     try {
//         const currentUserId = get(req, "identity._id", "") as string;
//         const user = await getUserById(currentUserId)
//         console.log(user);

//         if(!user) throw new Error("The provided id does not exist")
//         return res.status(200).send({
//             _id: user._id,
//             email: user.email,
//             username: user.username
//         });

//     } catch(error) {
//         console.error(error);
//         res.sendStatus(403);
//     }
// }