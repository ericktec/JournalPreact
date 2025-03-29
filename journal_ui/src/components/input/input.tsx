import { Component, ComponentType, Ref } from "preact";
import {
    HTMLProps,
    Inputs,
    PropsWithChildren,
    forwardRef,
} from "preact/compat";
import { useSignal } from "@preact/signals";
import "./styles.css";
import ShowPasswordIcon from "../IconComponents/EyeIcon";
import HidePasswordIcon from "../IconComponents/EyeOffIcon";

interface Props extends HTMLProps<HTMLInputElement> {
    displayIcon?: boolean;
    IconComponent?: ComponentType;
    type?: string;
}

const Input = forwardRef(function (
    { displayIcon, type, IconComponent, ...props }: Props,
    ref: Ref<HTMLInputElement>
) {
    const dynamicType = useSignal(type);

    function onTogglePasswordType(event: MouseEvent) {
        event.preventDefault();
        dynamicType.value = dynamicType.value === "text" ? "password" : "text";
    }

    return (
        <div
            class={`input__container ${
                displayIcon || type === "password" ? "input__container-img" : ""
            }`}
        >
            <input
                ref={ref}
                class={props.class}
                {...props}
                type={dynamicType}
            />
            {displayIcon && IconComponent && type !== "password" && (
                <div class="input-image">{<IconComponent />}</div>
            )}
            {type === "password" && (
                <button type="button" onClick={onTogglePasswordType} class="input-image-btn">
                    {dynamicType.value === "password" ? (
                        <ShowPasswordIcon
                            stroke={getComputedStyle(
                                document.documentElement
                            ).getPropertyValue("--primary-text-color")}
                        />
                    ) : (
                        <HidePasswordIcon
                            stroke={getComputedStyle(
                                document.documentElement
                            ).getPropertyValue("--primary-text-color")}
                        />
                    )}{" "}
                </button>
            )}
        </div>
    );
});

export default Input;
