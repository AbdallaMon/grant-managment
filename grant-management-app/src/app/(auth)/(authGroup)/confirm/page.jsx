"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useAuth} from "@/app/providers/AuthProvider";

export default function ConfirmationPage({searchParams}) {
    const {token} = searchParams;
    const {setLoading} = useToastContext();
    const {isLoggedIn, user: {emailConfirmed}, setIsLoggedIn, setUser} = useAuth();
    const router = useRouter();
    useEffect(() => {
        async function handleConfirmation() {
            if (isLoggedIn && emailConfirmed) {
                router.push("/dashboard/");
                return;
            }
            const res = await handleRequestSubmit(
                  {},
                  setLoading,
                  `auth/confirm/${token}`,
                  false,
                  "جاري تاكيد بريدك الالكتروني",
            );
            if (res.status === 200) {
                setIsLoggedIn(true)
                setUser(res.user)
                router.push("/dashboard");
            }
        }

        handleConfirmation();
    }, []);

    return "جاري تاكيد بريدك الالكتروني";
}
