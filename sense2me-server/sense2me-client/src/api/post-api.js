import { useEffect, useState } from "react";

function usePostRequest(){
    const [response, setResponse] = useState(null)

    useEffect(() => {
        fetch(process.env.REACT_APP_API, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Credentials': true,
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
                'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
            },
            body: JSON.stringify(
            {name: "Anxiety Maze",
            price: "4.00",
            description: "A cloth maze where you have to guide a metal ball through"}
            )
        })
        .then(res => {
            return res.json()
        }).then(data => setResponse(data))
    }, [])

    return response;
}

export default usePostRequest;