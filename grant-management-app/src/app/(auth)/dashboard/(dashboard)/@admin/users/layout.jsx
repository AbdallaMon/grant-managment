import {BasicTabs} from "@/app/UiComponents/DataViewer/BasicTabs";

export default function Layout({children}) {
    return (
          <>
              <UserTabs/>
              {children}
          </>
    )
}

function UserTabs() {
    const tabs = [
        {label: "الطلاب", href: "/dashboard/users"},
        {label: "المشرفين", href: "/dashboard/users/super-visor"},
        {label: "حسابات الداعمين", href: "/dashboard/users/sponsors"},
    ]
    return <BasicTabs tabs={tabs}/>
}