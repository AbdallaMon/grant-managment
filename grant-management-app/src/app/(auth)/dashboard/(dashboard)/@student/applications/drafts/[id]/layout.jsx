import {GrantListLinksAndChildren} from "@/app/UiComponents/DataViewer/GrantLinks";
import ChangeGrantMeta from "@/app/UiComponents/DataViewer/ChangeGrantMeta";
import GrantLinksProvider from "@/app/providers/GrantLinksProvider";

export default function Layout({children, params}) {
    return (
          <GrantLinksProvider id={params.id}>
              <GrantListLinksAndChildren id={params.id}>
                  <ChangeGrantMeta/>
                  {children}
              </GrantListLinksAndChildren>
          </GrantLinksProvider>
    )
}
