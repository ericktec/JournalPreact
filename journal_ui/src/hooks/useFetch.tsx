import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

type Props = {
    fetchFunction: Function,
    fetchParams?: Array<any>
    initialValue: any 
}

export default function ({fetchFunction, initialValue, fetchParams=[]}: Props) {
    const isFetching = useSignal(false);
    const fetchedData = useSignal(initialValue)
    const error = useSignal({message: "", error: false});

    useEffect(() => {
        async function fetchData() {
            try {
                isFetching.value = true;
                const data = await fetchFunction(...fetchParams);
                fetchedData.value = data;
            }
            catch (e) {
                error.value = {
                    error: true,
                    message: e || "Failed to fetch data"
                }                
            }
            finally {
                isFetching.value = false;
            }
        }
        
        fetchData()
    }, [fetchFunction, fetchParams])

    return {
        isFetching,
        fetchedData,
        error
    }
}