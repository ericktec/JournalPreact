
import "./styles.css";
import headingOneIcon from "../../assets/editMenuItemsIcons/h1.svg";
import headingTwoIcon from "../../assets/editMenuItemsIcons/h2.svg";
import headingThreeIcon from "../../assets/editMenuItemsIcons/h3.svg";
import headingFourIcon from "../../assets/editMenuItemsIcons/h4.svg";
import imgIcon from "../../assets/editMenuItemsIcons/img.svg";
import codeIcon  from "../../assets/editMenuItemsIcons/code.svg";
import paragraphIcon from "../../assets/editMenuItemsIcons/p.svg";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { Ref, useEffect } from "preact/hooks";
import { forwardRef } from "preact/compat";
import { JournalContentType } from "../../types/journalTypes";


export type EditElementsMenuOptions = {
    type: JournalContentType;
    label: string;
};

type Props = {
    onSelectMenuItem: (valueSelected: JournalContentType) => void,
    display ?: boolean;
    openPosition: {left: number, top: number}
}

const menuOptions = [
    {
        type: JournalContentType.h1,
        label: "Heading 1",
        image: headingOneIcon
    },
    {
        type: JournalContentType.h2,
        label: "Heading 2",
        image: headingTwoIcon
    },
    {
        type: JournalContentType.h3,
        label: "Heading 3",
        image: headingThreeIcon

    },
    {
        type: JournalContentType.h4,
        label: "Heading 4",
        image: headingFourIcon

    },
    {
        type: JournalContentType.img,
        label: "Image",
        image: imgIcon
    },
    {
        type: JournalContentType.p,
        label: "Paragraph",
        image: paragraphIcon
    },
    {
        type: JournalContentType.code,
        label: "Code",
        image: codeIcon
    }
];


export const EditElementsMenu = forwardRef(({ onSelectMenuItem, display, openPosition } : Props, ref: Ref<any>) => {
    const filterElementInput = useSignal<string>("");

    useEffect(() => {
        if(display === false) filterElementInput.value = "";
    }, [display])

    function onFilterMenu(event: ChangeEvent<HTMLInputElement>) {
        const inputElement = event.target as HTMLInputElement;
        filterElementInput.value = inputElement.value.trim();
    }



    const menuOptionsWithFilter = filterElementInput.value ==="" ? menuOptions : menuOptions.filter(option => {
        if(option.label.toLowerCase().includes(filterElementInput.value) || option.type.includes(filterElementInput.value)) return true; 
    });

    return(
        <div class={`EditElementsMenu__container ${display === false ? "hidden" : ""}`} style={openPosition}>
            <input class="EditElementsMenu-input" onChange={onFilterMenu} ref={ref} value={filterElementInput} />
            {menuOptionsWithFilter.map(option => 
                <div class="EditElementMenu-item__container" onClick={() => onSelectMenuItem(option.type)}>
                    <img class="EditElementMenu-img" src={option.image}/>
                    <div>{option.label}</div>
                </div>
            )}
        </div>
    );
});