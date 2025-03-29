import { ComponentChildren, Ref, VNode } from "preact";
import { useRef } from "preact/compat";
import { forwardRef } from "preact/compat";
import "./Modal.css";

type Props = {
    children: ComponentChildren
    footer?: VNode<any>
}

export default forwardRef(({children, footer}: Props, ref: Ref<HTMLDialogElement>) => {

    return(
        <dialog class="modal" ref={ref}>
            <div class="modal__body">
                <div class="modal__content">
                    {children}
                </div>
                {footer !== undefined && <div class="modal__footer">{footer}</div>}
            </div>
        </dialog>
    );
});