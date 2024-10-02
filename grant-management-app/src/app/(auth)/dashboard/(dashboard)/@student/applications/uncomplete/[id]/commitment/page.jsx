"use client"
import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,

    FormControlLabel,

    Typography
} from "@mui/material";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {getData} from "@/app/helpers/functions/getData";
import {LoadingState, SubmissionConfirmation} from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";
import {useGrantLinks} from "@/app/providers/GrantLinksProvider";
import CommitmentForm from "@/app/UiComponents/student/Commitment";

export default function Page({params: {id}}) {
    return <CommitmentForm id={id} extraParams={"status=UN_COMPLETE&"}/>

}
