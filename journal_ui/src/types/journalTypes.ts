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

export type JournalContent = {
    id: string
    type: JournalContentType,
    content: string | ImageContent,
}


export type JournalEntry = {
    _id: string;
    title: string;
    content: Array<JournalContent>;
    user: string;
    createdAt: string | Date
};


export type GetJournalsResponse = {
    journals: {
        metaData: Array<{
            totalDocuments: number;
            page: number;
            totalPages: number
        }>;
        data: Array<JournalEntry>
    };
};
