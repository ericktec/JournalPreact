import Sidebar from '../../components/SideBar/Sidebar';
import './style.css';
import { useCallback, useMemo, useRef, useState } from 'preact/hooks';
import { getJournals } from "../../utils/http/journals";
import useFetch from '../../hooks/useFetch';
import CircularLoadingSnippet from '../../components/CircularLoadingSnippet/CircularLoadingSnippet';
import { useSignal } from '@preact/signals';
import { useLocation } from "preact-iso";
import { Fragment } from 'preact/jsx-runtime';
import { GetJournalsResponse } from '../../types/journalTypes';
import Pagination from '../../components/Pagination/Pagination';
import { createPortal } from "preact/compat";
import Modal from '../../components/Modal/Modal';
import Input from '../../components/input/input';
import AddIcon from "../../components/IconComponents/AddIcon";
import { createJournal } from '../../utils/http/journals';
import { JournalEditor } from '../../components/JournalEditor/JournalEditor';

const initialJournalsFetched: GetJournalsResponse = {
	journals: {
		metaData: [
			{
				totalPages: 0,
				page: 1,
				totalDocuments: 0
			}
		],
		data: []
	}
}

export function Home() {
	const location = useLocation();
	const [resize, setResize] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState<number>(20);
	const containerRef = useRef<HTMLDivElement>(null);
	const newJournalsAdded = useSignal(0);
	const journalSideBarPage = useSignal(1);
	const journalParams = useMemo(() => [journalSideBarPage.value, 10], [journalSideBarPage.value, newJournalsAdded.value]);
    const {isFetching, fetchedData: journalsFetched, error}  = useFetch({fetchFunction: getJournals, initialValue: initialJournalsFetched, fetchParams: journalParams});
    const createEntryModalRef = useRef<HTMLDialogElement>(null);
    const newJournalTitleRef = useRef<HTMLInputElement>(null);
	const selectedJournalId = useSignal<string | null>(null);

	const onMouseDownResize = () => {
		setResize(true);
	}

	const onMouseUpResize = () => {
		setResize(false);
	}

	const onMouseLeaveHandler = () => {
		setResize(false);
	}

	const onMouseResizeMove = (event: MouseEvent) => {
		if(!containerRef.current) return;			
		if(resize === false) return;

		const parentBoundingRect = containerRef.current.getBoundingClientRect()
		const leftElementWidthPercentage = 100 * (event.pageX - parentBoundingRect.x) / parentBoundingRect.width; 
		setSidebarWidth(leftElementWidthPercentage);
	}

	const changeJournalPageSelected = (pageSelected: number) => {
		journalSideBarPage.value = pageSelected;
	}

    const onCloseCreateEntryHandler = (event: MouseEvent) => {
        if(!createEntryModalRef.current) return;
        createEntryModalRef.current.close();
        console.log(createEntryModalRef.current)
    }

    const onCreateNewJournalEntry = async (event: MouseEvent) => {
        if(!createEntryModalRef.current || !newJournalTitleRef.current) return;
        const newJournalTitle = newJournalTitleRef.current.value;

        if(!newJournalTitle) return;

        const response = await createJournal(newJournalTitle); 
        console.log(response)
        createEntryModalRef.current.close();
        newJournalTitleRef.current.value = "";
		newJournalsAdded.value += 1;
		journalSideBarPage.value = 1;
    }

    const onClickCreateEntryHandler = () => {
        if(!createEntryModalRef.current) return;
        createEntryModalRef.current.showModal();
    }

	const onSelectJournalHandler = (journalId: string) => {
		selectedJournalId.value = journalId;		
	}

	const onEditJournalHandler = () => {
		if(!selectedJournalId.value == null) return;
		location.route(`journal_editor/${selectedJournalId.value}`)	
	}

	return (
		<Fragment>
			{
				isFetching.value && 
				<div class="home__fetching">
					<CircularLoadingSnippet />
				</div>
			}
			<main ref={containerRef} class="home" style={{gridTemplateColumns:`minmax(10rem, ${sidebarWidth}%) minmax(30rem, 1fr)`}} onMouseMove={onMouseResizeMove}  onMouseUp={onMouseUpResize} onMouseLeave={onMouseLeaveHandler}>
				<div class="home__sidebar">
					<button class="btn btn-full-width btn-with-icon" onClick={onClickCreateEntryHandler}>
						<AddIcon fill="#ffff" width={20} height={20}/>
						Create Entry
					</button>
					<Sidebar data={journalsFetched.value.journals.data} selectedId={selectedJournalId.value} setSelectedId={onSelectJournalHandler}/>
					<Pagination totalPages={journalsFetched.value.journals.metaData[0]?.totalPages || 0} pageSelected={journalSideBarPage.value} changePageSelected={changeJournalPageSelected} />
					<div class="resizer" onMouseDown={onMouseDownResize}></div>
				</div>
				
				<div class="home__preview" >
					{
						journalsFetched.value.journals.data.length > 0 && selectedJournalId.value != null && 
						<Fragment>
							<JournalEditor edit={false} journalData={journalsFetched.value.journals.data.find(journal => journal._id === selectedJournalId.value)}/>
							<button class="btn home__edit-btn" onClick={onEditJournalHandler}>Edit</button>
						</Fragment>
					}
				</div>
			</main>


			{createPortal(
				<Modal ref={createEntryModalRef} footer={
					<div class="journalButtonsModal">
						<button class="btn btn-solid btn-danger" onClick={onCloseCreateEntryHandler}>Cancel</button>
						<button class="btn btn-solid btn-success" onClick={onCreateNewJournalEntry}>Create</button>
					</div>
				}>
					<h2>Create a new journal entry</h2>

					<form>
						<label htmlFor="inputTitleJournal">Title</label>
						<Input id="inputTitleJournal" class="full-width" ref={newJournalTitleRef}/>
					</form>

				</Modal>, document.body)}
		</Fragment>
	);
}

