"use client"
import {useEffect, useState} from "react";
import FullScreenLoader from "@/app/UiComponents/feedback/loaders/FullscreenLoader";
import {getData} from "@/app/helpers/functions/getData";
import {Alert} from "@mui/material";

export default function CheckIfApplicationAllowed({children, appStatus, appId}) {

    const [loading, setLoading] = useState()
    const [error, setError] = useState(null)

    useEffect(() => {
        async function getAuthorization() {
            const request = await getData({url: `student/applications/${appId}/check?status=${appStatus}&`, setLoading})

            if (request.error) {
                setError(request.error)
            } else {
                setError(null)
            }
        }

        getAuthorization()
    }, [])

    if (loading) return <FullScreenLoader/>
    if (!error && !loading) return children
    if (error && !loading) return <Alert severity="error">
        {error}
    </Alert>
}