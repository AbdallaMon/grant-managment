"use client";
import {resetInputs, resetPasswordInputs} from "./data";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import AuthForm from "@/app/UiComponents/formComponents/forms/AuthForm";

export default function ResetPage({searchParams: {token}}) {
    const {setLoading} = useToastContext();
    const router = useRouter();

    async function handleReset(data) {
        try {
            await handleRequestSubmit(
                  data,
                  setLoading,
                  !token ? "auth/reset" : `auth/reset/${token}`,
                  false,
                  !token ? "جاري مراجعة البريد الالكتروني" : "جاري اعادة انشاء كلمة السر",
            );
            if (token) {
                router.push("/login");
            }
        } catch (e) {
            console.log(e);
        }
    }

    const subTitle = <Link href={"/login"} className="font-[500] flex justify-center mb-2 mt-1"> تسجيل الدخول؟</Link>;
    return (
          <>
              <AuthForm
                    btnText={"انشاء"}
                    inputs={token ? resetPasswordInputs : resetInputs}
                    formTitle={"انشاء كلمة سر جديدة"}
                    onSubmit={handleReset}
                    subTitle={subTitle}
              />
          </>
    );
}
