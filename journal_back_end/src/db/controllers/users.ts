import { ObjectId } from "mongodb";
import { RegisterUser, User } from "../../types/UserTypes";
import { getDatabase } from "../dbClient";

export async function getUserByEmail (email: string) {
    const db = getDatabase();
    return  await db.collection("users").findOne({email});
}

export async function createNewUser (user: RegisterUser) {
    const db = getDatabase();
    return await db.collection("users").insertOne(user);
}

export async function getUserBySessionToken (sessionCookie: string) {
    const db = getDatabase();
    const projection = {
        username: 1,
        email: 1,
        _id: 1,
    }
    return await db.collection("users").findOne({"authentication.sessionCookie": sessionCookie}, {projection});
}

export async function getUserById(id: string) {
    if(!id) throw Error("Not id provided");
    const objectId = new ObjectId(id);
    return await getDatabase().collection("users").findOne({"_id": objectId});
}

export async function updateSessionCookie(providedUserId: string | ObjectId, sessionCookie: string) {
    let id;
    if(typeof providedUserId === "string") id = new ObjectId(providedUserId);
    else id = providedUserId;
    const filter = { "_id": id };
    const update = {"$set": {"authentication.sessionCookie": sessionCookie}};

    return await getDatabase().collection("users").updateOne(filter, update)
}

export async function updateRefreshToken(providedUserId: string | ObjectId, refreshToken: string) {
    let id;
    if(typeof providedUserId === "string") id = new ObjectId(providedUserId);
    else id = providedUserId;
    const filter = { "_id": id };
    const update = {"$push": {"authentication.refreshToken": refreshToken}};

    return await getDatabase().collection("users").updateOne(filter, update)
}

export async function getRefreshTokensByUserId(providedUserId: string | ObjectId) {
    let id;
    if(typeof providedUserId === "string") id = new ObjectId(providedUserId);
    else id = providedUserId

    console.log(id)

    const filter = {"_id": id};

    const projection = {
        "_id": 0,
        "authentication.refreshToken": 1,
    }
    return await getDatabase().collection("users").findOne(filter, {projection});
}

export async function deleteRefreshTokenByUserId(providedUserId: string | ObjectId, refreshToken: string) {
    let id;
    if(typeof providedUserId === "string") id = new ObjectId(providedUserId);
    else id = providedUserId;

    const filter = { "_id": id };
    const update = {"$pull": {"authentication.refreshToken": refreshToken}};

    return await getDatabase().collection("users").updateOne(filter, update)
}