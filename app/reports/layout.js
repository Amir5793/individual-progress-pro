import "@/app/globals.css"

export const metadata = {
    title: "Weekly Report",
    description: "Track and manage your weekly progress reports",
};

export default function ReportsLayout({children}) {
    return (
        <>
            {children}
        </>
    );
}
