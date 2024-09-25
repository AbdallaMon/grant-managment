import {GrantListLinksAndChildren} from "@/app/UiComponents/DataViewer/GrantLinks";

export default function Layout({children, params}) {
    return <GrantListLinksAndChildren id={params.id}>
        {children}
    </GrantListLinksAndChildren>
}
