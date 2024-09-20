"use client";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {Failed, Success} from "@/app/UiComponents/feedback/loaders/toast/ToastUpdate";
import {useAuth} from "@/app/providers/AuthProvider";

let toastId;

export default function Layout({supervisor, admin, student, sponsor}) {
    const router = useRouter();
    let {user, isLoggedIn, validatingAuth} = useAuth()
    useEffect(() => {
        async function fetchData() {
            if (validatingAuth || toastId === undefined) {
                toastId = toast.loading("يتم التاكد من صلاحيتك");
            }
            if (!isLoggedIn && !validatingAuth) {
                toast.update(toastId, Failed("يجب عليك تسجيل الدخول اولا , جاري اعادة التوجية..."));
                router.push("/login");
                return
            }
            if (isLoggedIn && !validatingAuth) {
                toast.update(
                      toastId,
                      Success("تم التاكد من صلاحيتك , جاري تحميل البيانات."),
                );
            }
        }

        fetchData();
    }, [validatingAuth]);
    console.log(user, "user")
    if (!user || !user.role) return null;
    const role = user?.role;
    return (
          <div className={"min-h-screen bg-bgSecondary py-20"}>
              {
                  role === "ADMIN" ? admin : role === "STUDENT" ? student : role === "SUPERVISOR" ? supervisor : sponsor
              }
          </div>

    );
}
