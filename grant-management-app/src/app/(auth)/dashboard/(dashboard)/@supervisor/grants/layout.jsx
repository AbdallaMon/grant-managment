import {BasicTabs} from "@/app/UiComponents/DataViewer/BasicTabs";

export const metadata = {
    title: "منح الطلاب",
};

export default function Layout({children}) {
    return (
          <>
              <GrantTabs/>
              {children}
          </>
    );
}

function GrantTabs() {
    const tabs = [
        {label: "مشاريع المنح", href: "/dashboard/grants"},
        {label: "طلبات المنح", href: "/dashboard/grants/applications"},
        {
            label: "منح تحتاج إلى تحديثات",
            href: "/dashboard/grants/uncompleted",
            hoverText: "منح طلب المشرفون أو المسؤولون تحديثات من الطلاب ولم يتم تقديمها بعد",
        },
        {
            label: "منح محدثة من قبل الطلاب",
            href: "/dashboard/grants/updated",
            hoverText: "منح قام الطلاب بتحديثها بعد طلب المشرفين أو المسؤولين",
        },
        {
            label: "منح مقبولة بدون تخصيص مشروع",
            href: "/dashboard/grants/no-grant",
            hoverText: "منح تم قبولها ولكن لم يتم تخصيص أموال لها أو ربطها بمشروع بعد",
        },
        {label: "المنح المقبولة", href: "/dashboard/grants/approved"},
        {label: "المنح المنتهية", href: "/dashboard/grants/end-grant"},
        {label: "المنح المرفوضة", href: "/dashboard/grants/rejected"},
    ];

    return <BasicTabs tabs={tabs}/>;
}
