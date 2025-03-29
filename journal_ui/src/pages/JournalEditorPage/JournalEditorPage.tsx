import { JournalEditor } from "../../components/JournalEditor/JournalEditor";
import { v4 as uuid } from "uuid"
import { useEffect, useState } from "preact/hooks";
import "./JournalEditorPage.css";
import { JournalContentType, JournalEntry } from "../../types/journalTypes";
import { getJournalById } from "../../utils/http/journals";

type Props = {
    id: string
};


export default ({id}: Props) => {

    const saveJournal = (journalData: JournalEntry) => {
        console.log(journalData);
    }

    return (
        <div class="journal__page">
            <JournalEditor edit={true} id={id}/>
        </div>
    )
}