// page.js
import AppShell from "@/components/AppShell/AppShell";

export default function Home() {
    return <AppShell mode="overview" goalLimit={3} habitLimit={2} />;
}
