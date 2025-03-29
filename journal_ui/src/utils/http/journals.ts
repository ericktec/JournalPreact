import { baseUrl } from "../../config/httpConfig";
import { GetJournalsResponse, JournalEntry } from "../../types/journalTypes";

export const getJournals = async (page=1, limit=10): Promise<GetJournalsResponse> => {
    const response = await fetch(`${baseUrl}/journals/getJournals?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include"
    });

    const data = await response.json();

    if(!response.ok) {
        throw Error(data);
    }

    return data;
}

export const createJournal = async (title: string) => {
    const response = await fetch(`${baseUrl}/journals/createJournal`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title
        })
    });

    if(!response.ok) throw Error("Something went wrong, try again later");

    return await response.json();
}

export const getJournalById = async(journalId: string) => {
    const response = await fetch(`${baseUrl}/journals/getJournal?journal=${journalId}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(!response.ok) throw Error("Couldn't find desired journal");

    return await response.json();
}

export const updateJournal = async(journalData: JournalEntry) => {
    const response = await fetch(`${baseUrl}/journals/updateJournal`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            journalId: journalData._id,
            journalData
        })
    })

    if(!response.ok) throw Error("Couldn't save new changes, please try again");

    return response;
}