"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Box } from "@mui/material";
import colors from "@/app/helpers/colors";
import Image from "next/image";

export default function HandleAuth({ children }) {
  const { isLoggedIn } = useAuth();
  const pathName = usePathname();
  console.log(pathName, "pathName");
  const router = useRouter();
  useEffect(() => {
    function handleRedirect() {
      const redirect = window.localStorage.getItem("redirect");
      if (isLoggedIn) {
        if (redirect && redirect.includes("dashboard")) {
          window.localStorage.removeItem("redirect");
          router.push(redirect);
        } else {
          router.push("/dashboard");
        }
      }
    }

    handleRedirect();
  }, [isLoggedIn, router]);
  if (pathName === "/register") {
    return (
      <Box
        sx={{
          backgroundColor: colors.bgSecondary,
          p: 1.5,
          display: "flex",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    );
  }
  return (
    <>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Image
          src="/login.jpg"
          alt="login Dashboard Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
