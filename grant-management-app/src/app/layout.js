import localFont from "next/font/local";
import "./globals.css";
import ToastProvider from "@/app/providers/ToastLoadingProvider";
import AuthProvider from "@/app/providers/AuthProvider";
import MUIContextProvider from "@/app/providers/MUIContext";
import Navbar from "@/app/UiComponents/MuiNavbar";
import DotsLoader from "@/app/UiComponents/feedback/loaders/DotsLoading";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "الصفحة الرئيسية",
    description: "",
};

export default function RootLayout({children}) {
    return (
          <html lang="ar" dir="rtl">
          <body
                className={`${geistSans.variable} ${geistMono.variable} `}
          >
          <MUIContextProvider>
              <ToastProvider>
                  <AuthProvider>
                      <Navbar/>
                      <DotsLoader/>
                      {children}
                  </AuthProvider>
              </ToastProvider>
          </MUIContextProvider>
          </body>
          </html>
    );
}
