import {BasicTabs} from "@/app/UiComponents/DataViewer/BasicTabs";

export default function Layout({children}) {
    return (
          <>
              <GrantTabs/>
              {children}
          </>
    )
}

function GrantTabs() {
    const tabs = [
        {label: "مشاريع المنح", href: "/dashboard/grants"},
        {label: "طلبات المنح", href: "/dashboard/grants/applications"},
        {
            label: "طلبات منح تحت المراجعه",
            href: "/dashboard/grants/under-review",
            hoverText: "منح قمت بتعين مشرف لمراجعتها"
        },
        {
            label: "منح مطلوب لها تحديثات",
            href: "/dashboard/grants/uncompleted",
            hoverText: "منح طلب الادمن او المشرف تحديثات من الطالب ولكنه لم يوفرها بعد"
        },
        {
            label: "المنح المحدثة من قبل الطالب", href: "/dashboard/grants/updated",
            hoverText: "منح طلب الادمن او المشرف تحديثات من الطالب وفد عدل الطالب التحديثات بالفعل"
        },
        {label: "المنح المقبولة", href: "/dashboard/grants/approved"},
        {label: "المنح المرفوضة", href: "/dashboard/grants/rejected"},
    ]
    return <BasicTabs tabs={tabs}/>
}