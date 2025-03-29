import { Response, Request } from "express";
import {get} from "lodash";
import { createJournalWithUserId, getJournalsByUserId, getJournalByUserIdAndJournalId, updateJournalByIdAndUserId } from "../db/controllers/journals";
import { jwtUserToken } from "../types/UserTypes";

export const getJournals = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) ?? 1;
        const limit = Number(req.query.limit) ?? 10;

        if(page < 1 || limit < 1) return res.status(400).json({
            status: "error",
            message: "Invalid page or limit"
        });

        const user = get(req, "user", undefined) as jwtUserToken | undefined;
        if(!user) throw Error("Not valid user object")

        const journals = await getJournalsByUserId(user._id, page, limit);
        console.log(journals)
        if(journals.length <= 0) {
            return res.status(500).json({status: "error", message: "No journals available, something went wrong"});
        }

        return res.status(200).json({
            journals: journals[0]
        });
    }
    catch(error) {
        console.error(error);
        res.sendStatus(401);
    }
};

export const createJournal = async(req: Request, res: Response) => {
    try {
        const user = get(req, "user", undefined) as jwtUserToken | undefined;
        const {title} = req.body;
        console.log(title)

        if(!title) return res.sendStatus(400).json({
            error: "Invalid value in request, title cannot be empty"
        });

        if(!user) throw Error("Not valid user object");

        createJournalWithUserId(user._id, title);

        return res.status(200).json({
            status: "success",
            message: "New journal created correctly"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong, please try again"
        });
    }
}

export const getJournalById = async(req: Request, res: Response) => {
    try {
        const user = get(req, "user", undefined) as jwtUserToken | undefined;
        const journalId = String(req.query.journal);

        if(!journalId) return res.sendStatus(400).json({
            error: "Invalid value in request, journal cannot be empty"
        });

        if(!user) throw Error("Not valid user object");

        const journal = await getJournalByUserIdAndJournalId(user._id, journalId);        

        if(!journal) return res.status(404);

        return res.status(200).json({
            status: "success",
            message: "Journal retrieved correctly",
            data: journal
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong, please try again"
        });
    }
}

export const updateJournal = async(req: Request, res: Response) => {
    try {
        const user = get(req, "user", undefined) as jwtUserToken | undefined;
        const {journalId, journalData} = req.body;

        if(!journalId) return res.sendStatus(400).json({
            error: "Invalid value in request, journal cannot be empty"
        });

        if(!user) throw Error("Not valid user object");

        const journal = await updateJournalByIdAndUserId(user._id, journalId, journalData.content);        
        console.log(journal)

        if(!journal) return res.status(404);

        return res.status(200);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong, please try again"
        });
    }
}