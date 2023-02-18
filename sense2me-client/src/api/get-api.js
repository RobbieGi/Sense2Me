import { useEffect, useState } from "react";

function useRequest(){

    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API, {mode: "cors"})
        .then(res => {
            if (!res.ok) {
                throw new Error('Fetch failed');
            }
            return res.json();
        })
        .then(data => setResults(data))
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, []);

    return results;

}



export default useRequest;