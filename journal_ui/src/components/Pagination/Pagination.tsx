import { h } from "preact";
import { useMemo } from "preact/hooks";
import "./Pagination.css";


type Props = {
    totalPages: number;
    pageSelected: number;
    changePageSelected: (pageSelected: number) => void;
}

const maxNumberOfTotalPages = 6;

export default ({totalPages, pageSelected, changePageSelected}: Props) => {
    console.log(pageSelected)

    const onPageClickHandler = (event: MouseEvent) => {
        const target  = event.target as HTMLButtonElement;
        if(!target) return;
        const pageSelected = Number(target.getAttribute("data-page"));
        if(!pageSelected) return;

        changePageSelected(pageSelected)        
    }


    const pages = useMemo(() => {
        const buttons = [];
        if(totalPages > maxNumberOfTotalPages) {
            for(let i = 0; i < maxNumberOfTotalPages - 2 ; i++) {
                buttons.push(
                    <button class={`pagination__btn ${pageSelected === (i + 1) ? 'pagination__btn-active' : ''}`} data-page={i + 1} onClick={onPageClickHandler}>
                        {i + 1}
                    </button>
                )
            }

            buttons.push(
                <button class="pagination__btn">
                    ...
                </button>
            );

            buttons.push(
                <button class={`pagination__btn ${pageSelected === (totalPages + 1) ? 'pagination__btn-active' : ''}`} data-page={totalPages} onClick={onPageClickHandler}>
                    {totalPages}
                </button>
            )
        } else {
            for(let i = 0; i < totalPages; i++) {
                buttons.push(
                    <button class={`pagination__btn ${pageSelected === (i + 1) ? 'pagination__btn-active' : ''}`} data-page={i + 1} onClick={onPageClickHandler}>
                        {i + 1}
                    </button>
                )
            }
        }

        return buttons;
    }, [totalPages, pageSelected]);


    return (
        <div class="pagination">
            {
                pages.map(pageBtn => pageBtn)
            }
        </div>
    );
}