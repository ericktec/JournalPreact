import "./ErrorMessage.css";
import ErrorIcon from "../IconComponents/ErrorIcon";

type Props = {
    message: string
}

export default function ErrorMessage ({message}) {

    return(
        <div class="error__container">
            <ErrorIcon stroke={getComputedStyle(document.documentElement).getPropertyValue("--primary-text-color")} width={30} height={30}/>
            <p class="error-message">{message}</p>
        </div>
    )
}