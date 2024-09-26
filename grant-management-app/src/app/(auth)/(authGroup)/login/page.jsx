"use client";
import Link from "next/link";
import {loginInputs} from "./data";
import {useAuth} from "@/app/providers/AuthProvider";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import AuthForm from "@/app/UiComponents/formComponents/forms/AuthForm";

export default function LoginPage() {
    const {setLoading} = useToastContext();
    const {setIsLoggedIn, setUser} = useAuth()

    async function handleLogin(data) {
        const response = await handleRequestSubmit(
              data,
              setLoading,
              "auth/login",
              false,
              "جاري تسجيل الدخول",
        );
        if (response.status === 200) {
            setIsLoggedIn(true)
            setUser(response.user)
        }
    }

    const subTitle = <Link href={"/register"} className="font-[500] flex justify-center mb-2 mt-1">انشاء حساب
        جديد؟</Link>;
    return (
          <>
              <AuthForm
                    btnText={"تسجيل الدخول"}
                    inputs={loginInputs}
                    formTitle={"تسجيل الدخول"}
                    onSubmit={handleLogin}
                    subTitle={subTitle}
              >
                  <Link href={"/reset"} className={"text-secondary"}>نسيت كلمة السر ؟</Link>
              </AuthForm>
          </>
    );
}
