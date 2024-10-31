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
            label: "الطلبات قيد المراجعة",
            href: "/dashboard/grants/under-review",
            hoverText: "طلبات المنح التي يقوم المشرفون بمراجعتها حاليًا",
        },
        {
            label: "منح تحتاج إلى تحديثات",
            href: "/dashboard/grants/uncompleted",
            hoverText: "منح طلب المشرفون تحديثات من الطلاب ولم يتم توفيرها بعد من قبله",
        },
        {
            label: "منح محدثة من قبل الطلاب",
            href: "/dashboard/grants/updated",
            hoverText: "منح قام الطلاب بتحديثها بعد طلب المشرفين",
        },
        {
            label: "منح مقبولة بدون تخصيص مشروع",
            href: "/dashboard/grants/no-grant",
            hoverText: "منح مقبولة لكن لم يتم تخصيص مشروع أو مبلغ مالي لها",
        },
        {label: "المنح المقبولة", href: "/dashboard/grants/approved"},
        {label: "المنح المنتهية", href: "/dashboard/grants/end-grant"},
        {label: "المنح المرفوضة", href: "/dashboard/grants/rejected"},
    ];

    return <BasicTabs tabs={tabs}/>;
}
