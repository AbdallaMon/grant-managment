"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {getData} from "@/app/helpers/functions/getData";

export const GrantContext = createContext(null);
export default function GrantLinksProvider({children, id}) {
    const [nonFilledLinks, setNotFilledLinks] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getNotFilledLinks() {
            const nonFilledLinks = await getData({url: `student/applications/${id}/submit`, setLoading})
            console.log(nonFilledLinks, "nonfiled")
            setNotFilledLinks(nonFilledLinks.data)
        }

        getNotFilledLinks()
    }, [])
    return (
          <GrantContext.Provider value={{nonFilledLinks, setNotFilledLinks, loading, setLoading}}>
              {children}
          </GrantContext.Provider>
    );
}

export const useGrantLinks = () => {
    const context = useContext(GrantContext);
    return context;
};
