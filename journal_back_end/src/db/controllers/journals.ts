import { ObjectId, Timestamp } from "mongodb";
import { getDatabase } from "../dbClient";
import { Journal, JournalContent, NewJournalEntry } from "../../types/JournalTypes";


export async function getJournalsByUserId(userId: string, page=1, limit=10) {
    const db = getDatabase();
    const userObjectId = new ObjectId(userId);
    // const response = await db.collection("journal")
    // .find({
    //     "user_id": userObjectId,
    // })
    // .sort({createdAt: 1})
    // .skip(page * limit)
    // .limit(limit)
    // .toArray()

    const aggregatePipeline = [
        {
            $match: {
                "user": userObjectId
            }
        },
        {
            "$facet": {
                metaData: [
                    {
                        "$count": 'totalDocuments'
                    },
                    {
                        "$addFields": {
                            page,
                            totalPages: {"$ceil" :{$divide: ["$totalDocuments", limit]}}
                        }
                    }
                ],
                data:[
                    {
                        $sort: {
                            "createdAt": -1
                        }
                    },
                    {
                        $skip: (page-1) * limit
                    },
                    {
                        $limit: limit
                    }
                ]
            }
        },
    ];

    const response = await db.collection("journals").aggregate(aggregatePipeline).toArray();

    return response
}

export async function createJournalWithUserId(userId: string, title: string) {
    const db = getDatabase();
    const userObjectId = new ObjectId(userId);
    const newJournalEntry: NewJournalEntry = {
        title: title,
        user: userObjectId,
        content: [],
        createdAt: new Date()
    }

    return await db.collection("journals").insertOne(newJournalEntry);
}

export async function getJournalByUserIdAndJournalId (userId: string, journalId: string) {
    const db = getDatabase();
    const userObjectId = new ObjectId(userId);
    const journalObjectId = new ObjectId(journalId);

    const filter = {
        _id: journalObjectId,
        user: userObjectId
    }

    return await db.collection("journals").findOne()
}

export async function updateJournalByIdAndUserId (userId: string, journalId: string, journalData: JournalContent) {
    const db = getDatabase();
    const userObjectId = new ObjectId(userId);
    const journalObjectId = new ObjectId(journalId);

    const filter = {
        _id: journalObjectId,
        user: userObjectId
    }

    const update = {
        $set: {
            journalData
        }
    }

    const result = await db.collection("journals").updateOne(filter, update);
    return result;
}