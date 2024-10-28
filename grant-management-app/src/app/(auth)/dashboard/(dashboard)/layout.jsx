"use client";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {Failed, Success} from "@/app/UiComponents/feedback/loaders/toast/ToastUpdate";
import {useAuth} from "@/app/providers/AuthProvider";
import {Box} from "@mui/material";
import colors from "@/app/helpers/colors";

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
                window.localStorage.setItem("redirect", window.location.pathname)
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
    if (!user || !user.role) return null;
    const role = user?.role;
    return (
          <Box sx={
              {
                  minHeight: "100vh",
                  py: 10,
                  backgroundColor: colors.bgSecondary
              }
          }>
              {
                  role === "ADMIN" ? admin : role === "STUDENT" ? student : role === "SUPERVISOR" ? supervisor : sponsor
              }
          </Box>

    );
}
