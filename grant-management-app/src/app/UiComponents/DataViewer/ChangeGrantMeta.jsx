"use client";
import {usePathname} from "next/navigation";
import {useEffect} from "react";
import {grantLinks} from "@/app/helpers/constants";

export default function ChangeGrantMeta() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSlug = pathSegments[pathSegments.length - 1];

    useEffect(() => {
        if (typeof window !== "undefined") {
            const currentItem = grantLinks.find((item) => item.href === lastSlug)
            if (!currentItem) return
            const title = currentItem.meta.title;
            const description = currentItem.meta.description;

            document.title = title;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute("content", description);
            } else {
                const meta = document.createElement("meta");
                meta.name = "description";
                meta.content = description;
                document.head.appendChild(meta);
            }
        }
    }, [lastSlug]);

    return null;
}
