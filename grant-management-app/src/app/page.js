"use client"
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import DotsLoader from "@/app/UiComponents/feedback/loaders/DotsLoading";

export default function Home() {
    const router = useRouter()
    useEffect(() => {
        router.push("/login")
    }, [])
    return (
          <DotsLoader instantLoading={true}/>
    );
}
