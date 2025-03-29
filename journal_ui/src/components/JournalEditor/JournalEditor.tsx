import "./style.css";
import { v4 as uuid } from "uuid"
import { useEffect, useReducer, useRef, useState } from "preact/hooks";
import { useSignal, useSignalEffect } from "@preact/signals";
import { H1 } from "../../components/H1/H1";
import { EditElementsMenu } from "../../components/EditElementsMenu/EditElementsMenu";
import { deepClone } from "../../utils/stateUtils";
import { JournalContentType, JournalContent, JournalEntry } from "../../types/journalTypes";
import useFetch from "../../hooks/useFetch";
import { getJournalById, updateJournal } from "../../utils/http/journals";

// An enum with all the types of actions to use in our reducer
enum EditActionTypes {
    CreateElement = "createElement",
    DeleteElement = "deleteElement",
    ChangeElementType = "changeElementType",
    InputText = "inputText",
    changeEntireJournalState = "changeEntireJournalState"
}

// An interface for our actions
interface EditAction {
    type: EditActionTypes;
    payload: any;
}

const initialJournalState: JournalEntry = {
    _id: uuid(),
    title: "",
    createdAt: "",
    user: "",
    content: [
        {
            id: uuid(),
            type: JournalContentType.h2,
            content: ""
        }
    ]
};


function journalContentReducer(state: JournalEntry, action: EditAction) {
    switch (action.type) {
        case EditActionTypes.changeEntireJournalState: {
            const currentJournalData = action.payload;
            console.log(currentJournalData)
            if(currentJournalData.content.length === 0) {
                currentJournalData.content.push({
                    id: uuid(),
                    type: JournalContentType.h2,
                    content: ""
                });
            }

            return currentJournalData;
        }

        case EditActionTypes.CreateElement: {

            const newIndex = action.payload.index + 1 ;
            const newElement: JournalContent = {
                id: uuid(),
                type: action.payload.type,
                content: ""
            };

            const currentState = deepClone(state);
            currentState.content.splice(newIndex, 0, newElement);
            return currentState;
        }
        case EditActionTypes.InputText : {
            const { index, inputText } : {index: number, inputText: string} = action.payload;
            const currentState = deepClone(state);
            currentState.content.forEach((element, i) => {
                if(i === index) {
                    element.content = inputText} 
                    return;
            });
            return currentState;
        }
        case EditActionTypes.ChangeElementType: {
            const { index, type } : {index: number, type: JournalContentType} = action.payload;
            const currentState: JournalEntry = deepClone(state); 

            currentState.content.forEach((element, i) => {
                if(i === index) {
                    element.type = type;

                    if(typeof element.content === "string") {
                        element.content = element.content.substring(0, element.content.length -1);
                    }
                    return;
                }
            });

            return currentState;
        }
        case EditActionTypes.DeleteElement: {
            const currentState: JournalEntry = deepClone(state);
            const {index} = action.payload;
            currentState.content = currentState.content.filter((_, i) => i !== index);
            return currentState;
        }
        default:
            return deepClone(state);
            break;
    }
}

type Props = {
    edit?: boolean;
    journalData?: JournalEntry
    id?: string
}

export function JournalEditor({ edit=true, journalData, id }: Props) {
    const currentFocusElementIndex = useSignal(0);
    const displayEditMenu = useSignal(false);
    const [journalState, journalDispatch] = useReducer(journalContentReducer, journalData === undefined ? initialJournalState : journalData);
    const currentElementToFocus = useRef(null);
    const menuEditorRef = useRef(null);
    const menuEditorPosition = useSignal({
        left: 0,
        top: 0
    });

    useEffect(() => {
        if(edit === false) { return; }

        (async function () {
            const journalData = await getJournalById(id);
            if(journalData.status !== "success") return;

            console.log(journalData)
            journalDispatch({type: EditActionTypes.changeEntireJournalState, payload: journalData.data});
            
        })()
    }, []);

    useEffect(() => {
        if(!journalData) return; 
        console.log(journalData)

        journalDispatch({ type: EditActionTypes.changeEntireJournalState, payload: journalData})
    }, [journalData])

    useEffect(() => {
        if(currentElementToFocus.current && displayEditMenu.value === false) {
            const range = new Range();
            range.selectNodeContents(currentElementToFocus.current);
            range.collapse(false);
            const selections = window.getSelection();
            selections.removeAllRanges();
            selections.addRange(range);
            currentElementToFocus.current.focus();
        }
    }, [currentFocusElementIndex.value, displayEditMenu.value]);

    const createElement = (elementData: JournalContent, index: number) => {
        return (
            <elementData.type key={elementData.id}>
                <pre 
                ref={index === currentFocusElementIndex.value ? currentElementToFocus : null} 
                data-index={index} 
                contentEditable={edit} 
                placeholder={"This is your paragraph"}
                onFocus={onFocusHandler}></pre>
            </elementData.type>
        )
    }

    const onBeforeInputHandler = (event: InputEvent) => {
        console.log(event)
        const targetElement = event.target as HTMLElement;
        const currentIndex = Number(targetElement.getAttribute("data-index"));
        //console.log(event.inputType);

        switch (event.inputType) {
            case "insertParagraph":
                event.preventDefault();
                journalDispatch({ type: EditActionTypes.CreateElement, payload: { type: JournalContentType.p, index: currentIndex } });
                currentFocusElementIndex.value = currentIndex + 1;
                break;
            case "deleteContentBackward":
                if(targetElement.innerText.length === 0 && currentIndex > 0) {
                    journalDispatch({type: EditActionTypes.DeleteElement, payload: {index: currentIndex}})
                    currentFocusElementIndex.value -=1;
                }
                break;
            default:
                break;
        }       
    };

    const onInputHandler = (event: InputEvent) => {

        if(displayEditMenu.value) return;

        const targetElement = event.target as HTMLElement;
        const currentIndex = Number(targetElement.getAttribute("data-index"));

        switch (event.inputType) {
            case "insertText":

                if(event.data === "/") {
                    const range = window.getSelection().getRangeAt(0);
                    var endOffset = range.endOffset;
                    const {bottom, right} = range.getBoundingClientRect();
                    menuEditorPosition.value = {
                        left: right,
                        top: bottom
                    };
                    displayEditMenu.value = true;
                    menuEditorRef?.current.focus();
                } else if(event.data === " " && displayEditMenu.value) {
                    displayEditMenu.value = false
                }

                journalDispatch({type: EditActionTypes.InputText, payload: {index: currentIndex, inputText: targetElement.innerText}});
                break;

            default:
                displayEditMenu.value = false;
                break;
        }
    }
    
    const handleOnKeyPress = (event: KeyboardEvent) => {
        //console.log(event.key);

        if(event.key === "Escape") {
            if(displayEditMenu.value) {
                displayEditMenu.value = false;
                currentElementToFocus?.current.focus();
            } else if(currentElementToFocus.current){
                currentElementToFocus.current.blur();
            }
        }
    }

    const onFocusHandler = (event :FocusEvent) => {
        const target = event.target as HTMLElement;
        currentFocusElementIndex.value = Number(target.getAttribute("data-index"));
    }

    const onSelectMenuItem = (selectedItem: JournalContentType) => {
        displayEditMenu.value = false;
        journalDispatch({
            type: EditActionTypes.ChangeElementType,
            payload: {
                index: currentFocusElementIndex.value,
                type: JournalContentType[selectedItem]
            }
        })
    }

    const onSaveChanges = async () => {
        const response = await updateJournal(journalState);
        console.log(response);
    }


    return (
        <div class="journalEditor__container" onBeforeInput={onBeforeInputHandler} onInput={onInputHandler} onKeyUp={handleOnKeyPress}>
            <EditElementsMenu ref={menuEditorRef}  onSelectMenuItem={onSelectMenuItem} display={displayEditMenu.value} openPosition={menuEditorPosition.value} />
            {journalState.content.map((element, i) => createElement(element, i))}
            {edit && <button class="btn btn-solid btn-success btn-save" onClick={onSaveChanges}>Save Changes</button>}
        </div>
    );
}