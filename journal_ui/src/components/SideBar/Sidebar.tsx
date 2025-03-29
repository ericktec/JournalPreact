import "./Sidebar.css"
import { Fragment } from "preact/jsx-runtime";
import { JournalEntry } from "../../types/journalTypes";

type Props = {
    data: Array<JournalEntry>;
    messageWhenDataIsEmpty?: string; 
    selectedId: string | null; 
    setSelectedId: (id: string) => void;
}

export default function Sidebar({data, messageWhenDataIsEmpty="No Data", selectedId, setSelectedId}: Props) {

    return (
        <Fragment>
            <ul class="sidebar__container">
                {data.map(journal => (
                    <li key={journal._id} class={`sidebar-item ${journal._id === selectedId ? "sidebar-item--active" : "" }`} onClick={() => setSelectedId(journal._id)}>
                        {journal.title}
                    </li>
                ))}
            </ul>
                <div class="sidebar__message">
                {
                    data.length === 0 && 
                    <p>{messageWhenDataIsEmpty}</p>
                }
                </div>
        </Fragment>
    );
}