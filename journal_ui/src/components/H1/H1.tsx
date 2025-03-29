import "./styles.css";

type Props = {
    onInput: (event: InputEvent) => void 
    placeholder: string
}


export function H1({ placeholder, onInput }: Props) {
    return(
        <h1 class="h1__jorunal-entry ">
            <pre class="editable-element" onInput={onInput}  contentEditable={true}></pre>
        </h1>
    );
}