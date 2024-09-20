"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/providers/AuthProvider";

export default function HandleAuth({children}) {
    const {isLoggedIn} = useAuth()

    const router = useRouter();
    useEffect(() => {
        if (isLoggedIn) router.push("/dashboard/");
    }, [isLoggedIn]);

    return (
          <>
              <div className={"flex bg-bgSecondary p-3  w-full h-full min-h-screen "}>

                  {children}
              </div>
          </>
    );
}
