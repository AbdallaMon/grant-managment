"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/providers/AuthProvider";

export default function HandleAuth({children}) {
    const {isLoggedIn} = useAuth()

    const router = useRouter();
    useEffect(() => {
        function handleRedirect() {
            const redirect = window.localStorage.getItem("redirect")
            if (isLoggedIn) {
                if (redirect && redirect.includes("dashboard")) {
                    window.localStorage.removeItem("redirect")
                    router.push(redirect)
                } else {
                    router.push("/dashboard")
                }
            }

        }

        handleRedirect()
    }, [isLoggedIn]);

    return (
          <>
              <div className={"flex bg-bgSecondary p-3  w-full h-full min-h-screen "}>

                  {children}
              </div>
          </>
    );
}
