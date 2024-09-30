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
            label: "منح مطلوب لها تحديثات",
            href: "/dashboard/grants/uncompleted",
            hoverText: "المنح التي طلب الادمن او المشرف تحديثات من الطالب ولكنه لم يوفرها بعد"
        },
        {
            label: "المنح المحدثة من قبل الطالب", href: "/dashboard/grants/updated",
            hoverText: "المنح التي طلب الادمن او المشرف تحديثات من الطالب وفد عدل الطالب التحديثات بالفعل"
        },
        {
            label: "منح مقبولة بدون مشروع",
            href: "/dashboard/grants/no-grant",
            hoverText: "منح قمت بقبولها ولكن لم تقم بتخصيص مبلغ مالي او تضمها لمشروع حتي الان"
        },
        {label: "المنح المقبولة", href: "/dashboard/grants/approved"},
        {label: "المنح منتهية", href: "/dashboard/grants/end-grant"},
        {label: "المنح المرفوضة", href: "/dashboard/grants/rejected"},
    ]

    return <BasicTabs tabs={tabs}/>
}