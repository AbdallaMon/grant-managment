import {GrantListLinksAndChildren} from "@/app/UiComponents/DataViewer/GrantLinks";
import ChangeGrantMeta from "@/app/UiComponents/DataViewer/ChangeGrantMeta";
import GrantLinksProvider from "@/app/providers/GrantLinksProvider";
import CheckIfApplicationAllowed from "@/app/UiComponents/feedback/CheckIfApplicationAllowed";

export default function Layout({children, params}) {
    return (
          <CheckIfApplicationAllowed appId={params.id} appStatus={"DRAFT"}>

              <GrantLinksProvider id={params.id}>
                  <GrantListLinksAndChildren id={params.id}>
                      <ChangeGrantMeta/>
                      {children}
                  </GrantListLinksAndChildren>
              </GrantLinksProvider>
          </CheckIfApplicationAllowed>
    )
}
