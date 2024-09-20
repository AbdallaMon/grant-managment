"use client"
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";
import {FaSignOutAlt} from "react-icons/fa";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useAuth} from "@/app/providers/AuthProvider";

export default function LogoutButton({fit}) {
    const {setLoading} = useToastContext();
    const {setUser, setIsLoggedIn} = useAuth()
    const router = useRouter();

    async function handleLogout() {
        const logout = await handleRequestSubmit(
              {},
              setLoading,
              `auth/logout`,
              false,
              "جاري تسجيل الخروج",
        );
        if (logout?.status === 200) {
            setIsLoggedIn(false)
            setUser(null)
            router.push("/login");
        }
    }

    return (
          <Button
                onClick={() => {
                    handleLogout();
                }}
                sx={{
                    width: fit ? "fit-content" : "100%",
                }}
                color="secondary"

          > <FaSignOutAlt/>
              Logout
          </Button>
    );
}