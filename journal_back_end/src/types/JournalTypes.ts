import { ObjectId, Timestamp } from "mongodb";

export type JournalContent = {
    id: string;
    type: string;
    content: string;
};

export type NewJournalEntry = {
    title: string;
    createdAt: Date;
    content: Array<JournalContent>;
    user: ObjectId;
}

export type Journal = NewJournalEntry & {
    _id: ObjectId
};

export enum JournalContentType {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    img = "img",
    p = "p",
    code = "code"
}

export type ImageContent = {
    file: File,
    name: string,
    content: string
}